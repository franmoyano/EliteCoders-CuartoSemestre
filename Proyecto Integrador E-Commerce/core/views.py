from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Categoria, Curso, Instructor, Leccion, Inscripcion
from .serializers import (
    CategoriaSerializer, InstructorSerializer, LeccionSerializer, EmptySerializer,
    CursoListSerializer, CursoDetailSerializer
)
from .permissions import IsAdminOrReadOnly, CanViewLessons


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly]


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsAdminUser]


class CursoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        """
        Si el usuario es staff/admin, muestra todos los cursos.
        Si no, muestra solo los publicados.
        """
        if self.request.user.is_staff:
            return Curso.objects.all()
        return Curso.objects.filter(publicado=True)

    def get_serializer_class(self):
        """
        Elige qué serializer usar basado en la acción solicitada.
        """
        if self.action == 'list':
            # Para la lista de cursos, usa el serializer ligero.
            return CursoListSerializer
        if self.action == 'inscribir':
            return EmptySerializer
        # Para cualquier otra acción (retrieve, create, update), usa el de detalle.
        return CursoDetailSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def inscribir(self, request, pk=None):
        """
        Endpoint para que un usuario autenticado se inscriba en este curso.
        """
        curso = self.get_object()
        usuario = request.user
        if Inscripcion.objects.filter(usuario=usuario, curso=curso).exists():
            return Response(
                {'error': 'Ya estás inscrito en este curso.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        Inscripcion.objects.create(usuario=usuario, curso=curso)
        return Response(
            {'status': 'Inscripción exitosa.'},
            status=status.HTTP_201_CREATED
        )


class LeccionViewSet(viewsets.ModelViewSet):
    serializer_class = LeccionSerializer
    permission_classes = [CanViewLessons]

    def get_queryset(self):
        curso_pk = self.kwargs['curso_pk']
        return Leccion.objects.filter(curso_id=curso_pk)

    def perform_create(self, serializer):
        curso_pk = self.kwargs['curso_pk']
        curso = Curso.objects.get(pk=curso_pk)
        serializer.save(curso=curso)


class MisCursosView(generics.ListAPIView):
    """
    Endpoint de solo lectura para los cursos del usuario autenticado.
    """
    # Se cambia el serializer al de lista para que sea más eficiente.
    serializer_class = CursoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        usuario_actual = self.request.user
        return Curso.objects.filter(inscritos__usuario=usuario_actual)