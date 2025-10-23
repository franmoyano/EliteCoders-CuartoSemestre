from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Categoria, Curso, Instructor, Leccion, Inscripcion, ItemCarrito, Carrito, Pedido
from .serializers import (
    CategoriaSerializer, InstructorSerializer, LeccionSerializer, EmptySerializer,
    CursoListSerializer, CursoDetailSerializer, CarritoSerializer, PedidoSerializer
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

class CarritoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el carrito del usuario autenticado.
    """
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user, activo=True)

    def list(self, request, *args, **kwargs):
        """
        Devuelve el carrito activo del usuario o lo crea si no existe.
        """
        carrito, created = Carrito.objects.get_or_create(
            usuario=request.user,
            completado=False
        )
        serializer = self.get_serializer(carrito)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='agregar')
    def agregar(self, request, pk=None):
        """
        Agrega un curso al carrito (o incrementa si ya existe).
        """
        carrito = self.get_object()
        curso_id = request.data.get('curso_id')

        if not curso_id:
            return Response({'error': 'Se requiere curso_id'}, status=status.HTTP_400_BAD_REQUEST)

        item, creado = ItemCarrito.objects.get_or_create(
            carrito=carrito,
            curso_id=curso_id,
            defaults={'cantidad': 1}
        )
        if not creado:
            item.cantidad += 1
            item.save()

        return Response({'status': 'Curso agregado al carrito'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='quitar')
    def quitar(self, request, pk=None):
        """
        Quita un curso del carrito.
        """
        carrito = self.get_object()
        curso_id = request.data.get('curso_id')

        try:
            item = ItemCarrito.objects.get(carrito=carrito, curso_id=curso_id)
            item.delete()
            return Response({'status': 'Curso quitado del carrito'}, status=status.HTTP_200_OK)
        except ItemCarrito.DoesNotExist:
            return Response({'error': 'El curso no está en el carrito'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='vaciar')
    def vaciar(self, request, pk=None):
        carrito = self.get_object()
        carrito.vaciar()
        return Response({'status': 'Carrito vaciado'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='checkout')
    def checkout(self, request, pk=None):
        """
        Convierte el carrito en un pedido.
        """
        carrito = self.get_object()
        if not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        pedido = Pedido.objects.create(usuario=request.user)
        pedido.generar_desde_carrito(carrito)

        # Opcional: inscribir al usuario automáticamente en los cursos comprados
        for item in pedido.items.all():
            from .models import Inscripcion
            Inscripcion.objects.get_or_create(usuario=request.user, curso=item.curso)

        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_201_CREATED)