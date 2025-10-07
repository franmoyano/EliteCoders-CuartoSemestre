# core/serializers.py
from rest_framework import serializers
from .models import Categoria, Curso, Leccion, Instructor, Inscripcion


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre'] # Campos que se mostrarán en la API

class LeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leccion
        fields = ['id', 'titulo', 'video_url', 'material_adjunto', 'orden']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['id', 'nombre', 'bio']

class LeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leccion
        fields = ['id', 'titulo', 'contenido_texto', 'video_url', 'material_adjunto', 'orden', 'curso']
        read_only_fields = ['curso']


class CursoListSerializer(serializers.ModelSerializer):
    """
    Serializer ligero para la lista de cursos.
    Muestra solo información resumida y NUNCA incluye las lecciones.
    """
    # Para mostrar los nombres en lugar de los IDs en la lista
    categoria = serializers.StringRelatedField()
    instructor = serializers.StringRelatedField()

    class Meta:
        model = Curso
        # Lista de campos optimizada para la vista de lista
        fields = [
            'id',
            'titulo',
            'precio',
            'imagen_portada',
            'instructor',
            'categoria'
        ]

# --- SERIALIZER DE DETALLE (EL QUE YA TENÍAMOS, PERO RENOMBRADO) ---
class CursoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para la vista de detalle de un curso.
    Incluye la lógica para mostrar lecciones solo a usuarios inscritos.
    """
    # Campos para LECTURA
    categoria = CategoriaSerializer(read_only=True)
    instructor = InstructorSerializer(read_only=True)
    lecciones = serializers.SerializerMethodField() # El campo inteligente

    # Campos para ESCRITURA
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=Instructor.objects.all(), source='instructor', write_only=True
    )

    class Meta:
        model = Curso
        fields = [
            'id', 'titulo', 'descripcion', 'precio',
            'publicado',
            'categoria', 'categoria_id',
            'instructor', 'instructor_id',
            'lecciones'
        ]

    def get_lecciones(self, obj):
        # Esta lógica ahora solo se ejecuta en la vista de detalle
        usuario = self.context['request'].user
        if usuario.is_authenticated and (Inscripcion.objects.filter(usuario=usuario, curso=obj).exists() or usuario.is_staff):
            queryset = obj.lecciones.all()
            return LeccionSerializer(queryset, many=True).data
        return []

class EmptySerializer(serializers.Serializer):
    """
    Un serializer vacío para acciones que no necesitan un cuerpo en la petición.
    """
    pass