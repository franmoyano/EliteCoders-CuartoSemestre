# core/serializers.py
from rest_framework import serializers
from .models import Categoria, Curso, Leccion, Instructor

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
        # --- AÑADIR ESTA LÍNEA ---
        # Hacemos que el campo 'curso' sea de solo lectura en la API.
        # No se podrá establecer al crear o actualizar, se infiere de la URL.
        read_only_fields = ['curso']


# --- VERSIÓN MEJORADA Y EXPLÍCITA DEL CURSOSERIALIZER ---
class CursoSerializer(serializers.ModelSerializer):
    # --- Campos para LECTURA (GET) ---
    # Muestran el objeto completo, son de solo lectura.
    categoria = CategoriaSerializer(read_only=True)
    instructor = InstructorSerializer(read_only=True)
    lecciones = LeccionSerializer(many=True, read_only=True)

    # --- Campos para ESCRITURA (POST, PUT) ---
    # Aceptan solo el ID. 'source' le dice a qué campo del modelo real apuntan.
    # 'write_only=True' significa que solo se usan para crear/actualizar, no para mostrar.
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=Instructor.objects.all(), source='instructor', write_only=True
    )

    class Meta:
        model = Curso
        # Definimos todos los campos que usará nuestro serializer
        fields = [
            'id', 'titulo', 'descripcion', 'precio',
            'publicado',
            'categoria',      # Para leer
            'categoria_id',   # Para escribir
            'instructor',     # Para leer
            'instructor_id',  # Para escribir
            'lecciones'
        ]