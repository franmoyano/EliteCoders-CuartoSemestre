# core/models.py

from django.db import models
from django.contrib.auth.models import User


# =====================================================
# CATEGORÍAS E INSTRUCTORES
# =====================================================

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


# =====================================================
# CURSOS Y LECCIONES
# =====================================================

class Curso(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, related_name='cursos', on_delete=models.SET_NULL, null=True)
    instructor = models.ForeignKey(Instructor, related_name='cursos', on_delete=models.SET_NULL, null=True)
    imagen_portada = models.ImageField(upload_to='cursos_portadas/', blank=True, null=True)
    publicado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"


class Leccion(models.Model):
    curso = models.ForeignKey(Curso, related_name='lecciones', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    contenido_texto = models.TextField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    material_adjunto = models.FileField(upload_to='lecciones_materiales/', blank=True, null=True)
    orden = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.curso.titulo} - Lección {self.orden}: {self.titulo}"

    class Meta:
        verbose_name = "Lección"
        verbose_name_plural = "Lecciones"
        ordering = ['orden']


# =====================================================
# CARRITO DE COMPRAS
# =====================================================

class Carrito(models.Model):
    usuario = models.ForeignKey(User, related_name='carritos', on_delete=models.CASCADE)
    completado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'completado')

    def __str__(self):
        if self.usuario:
            return f"Carrito #{self.id} de {self.usuario.username}"
        return f"Carrito anónimo #{self.id}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

    def vaciar(self):
        self.items.all().delete()


class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('carrito', 'curso')

    @property
    def subtotal(self):
        return self.curso.precio * self.cantidad

    def __str__(self):
        return f"{self.curso.titulo} (x{self.cantidad}) en Carrito #{self.carrito.id}"


# =====================================================
# PEDIDOS Y ITEMS DE PEDIDO
# =====================================================

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} de {self.usuario.username}"

    @property
    def total(self):
        return sum(item.precio_compra for item in self.items.all())

    def generar_desde_carrito(self, carrito):
        """
        Convierte los items del carrito en items del pedido.
        """
        for item in carrito.items.all():
            ItemPedido.objects.create(
                pedido=self,
                curso=item.curso,
                precio_compra=item.curso.precio
            )
        carrito.vaciar()
        carrito.completado = True
        carrito.save()


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.curso.titulo} en Pedido #{self.pedido.id}"


# =====================================================
# INSCRIPCIONES
# =====================================================

class Inscripcion(models.Model):
    usuario = models.ForeignKey(User, related_name='inscripciones', on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, related_name='inscritos', on_delete=models.CASCADE)
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} inscrito en {self.curso.titulo}"

    class Meta:
        unique_together = ('usuario', 'curso')
        verbose_name = "Inscripción"
        verbose_name_plural = "Inscripciones"
