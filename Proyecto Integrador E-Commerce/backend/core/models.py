# core/models.py

from django.db import models
from django.contrib.auth.models import User


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class Instructor(models.Model):
    nombre = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True, verbose_name="Biografía")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Instructor"
        verbose_name_plural = "Instructores"


class Curso(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, related_name='cursos', on_delete=models.SET_NULL, null=True)

    # --- CAMBIO IMPORTANTE ---
    # Antes era: instructor = models.CharField(max_length=100)
    # Ahora es una relación ForeignKey al nuevo modelo Instructor.
    instructor = models.ForeignKey(Instructor, related_name='cursos', on_delete=models.SET_NULL, null=True)

    imagen_portada = models.ImageField(upload_to='cursos_portadas/', blank=True, null=True)
    publicado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"


# ... (El resto de los modelos Leccion, Pedido, etc. se mantienen igual) ...
# Nuevo modelo para las Lecciones dentro de cada curso.
class Leccion(models.Model):
    curso = models.ForeignKey(Curso, related_name='lecciones', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    contenido_texto = models.TextField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True) # Para videos de YouTube, Vimeo, etc.
    material_adjunto = models.FileField(upload_to='lecciones_materiales/', blank=True, null=True) # Para PDFs, ZIPs, etc.
    orden = models.PositiveIntegerField() # Para ordenar las lecciones (1, 2, 3...)

    def __str__(self):
        return f"{self.curso.titulo} - Lección {self.orden}: {self.titulo}"

    class Meta:
        verbose_name = "Lección"
        verbose_name_plural = "Lecciones"
        ordering = ['orden'] # Ordena las lecciones por su número de orden por defecto


# El Pedido ahora se asocia directamente a un usuario registrado.
class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} de {self.usuario.username}"

    @property
    def total(self):
        # Usamos self.items.all() gracias al related_name del ForeignKey en ItemPedido
        return sum(item.precio_compra for item in self.items.all())


# El ItemPedido ahora vincula un Pedido con un Curso. Ya no hay 'cantidad'.
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2) # Guardamos el precio al momento de la compra

    def __str__(self):
        return f"{self.curso.titulo} en Pedido #{self.pedido.id}"


# Nuevo modelo para gestionar el acceso de los usuarios a los cursos que compraron.
# Esto representa el "área personal" o la "biblioteca" del usuario.
class Inscripcion(models.Model):
    usuario = models.ForeignKey(User, related_name='inscripciones', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, related_name='inscritos', on_delete=models.CASCADE)
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} inscrito en {self.curso.titulo}"

    class Meta:
        # Aseguramos que un usuario solo pueda inscribirse una vez por curso
        unique_together = ('usuario', 'curso')