from rest_framework import viewsets
from .models import Categoria, Curso, Instructor, Leccion
from .serializers import CategoriaSerializer, CursoSerializer, InstructorSerializer, LeccionSerializer


# Un ViewSet para Categoria que nos da un CRUD completo
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# Un ViewSet para Curso que también nos da un CRUD completo
class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

class LeccionViewSet(viewsets.ModelViewSet):
    serializer_class = LeccionSerializer

    def get_queryset(self):
        """
        Este método filtra las lecciones para que solo devuelva
        aquellas que pertenecen al curso especificado en la URL.
        """
        # Obtenemos el ID del curso de los parámetros de la URL (kwargs)
        curso_pk = self.kwargs['curso_pk']
        return Leccion.objects.filter(curso_id=curso_pk)

    def perform_create(self, serializer):
        """
        Este método se asegura de que cuando se crea una nueva lección,
        se asigne automáticamente al curso correcto de la URL.
        """
        curso_pk = self.kwargs['curso_pk']
        curso = Curso.objects.get(pk=curso_pk)
        serializer.save(curso=curso)