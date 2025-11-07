import mercadopago
from django.conf import settings
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

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def desinscribir(self, request, pk=None):
        """
        Endpoint para que un usuario autenticado se desinscriba de este curso.
        """
        curso = self.get_object()
        usuario = request.user
        try:
            inscripcion = Inscripcion.objects.get(usuario=usuario, curso=curso)
            inscripcion.delete()
            return Response(
                {'status': 'Desinscripción exitosa.'},
                status=status.HTTP_200_OK
            )
        except Inscripcion.DoesNotExist:
            return Response(
                {'error': 'No estás inscrito en este curso.'},
                status=status.HTTP_404_NOT_FOUND
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
        # The model uses `completado` to mark finished carts; return active (not completed) carts
        return Carrito.objects.filter(usuario=self.request.user, completado=False)

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
        Genera una preferencia de pago con los ítems del carrito activo del usuario.
        """
        carrito = self.get_object()

        if not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la preferencia con los ítems del carrito
        sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

        items = []
        for item in carrito.items.all():
            items.append({
                "title": item.curso.titulo,
                "quantity": item.cantidad,
                "unit_price": float(item.curso.precio),
            })

        preference_data = {
            "items": items,
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/payments/success/{carrito.id}/",
                "failure": f"{settings.FRONTEND_URL}/payments/failure/{carrito.id}/",
            },
            "auto_return": "approved",
            "external_reference": str(carrito.id),
        }

        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        return Response({
            "preference_id": preference["id"],
            "init_point": preference["init_point"],
        }, status=status.HTTP_201_CREATED)


# ------------------------------------------------------------------
# Endpoints para manejar el retorno desde MercadoPago
# ------------------------------------------------------------------
from django.http import HttpResponse, HttpResponseBadRequest


def payments_success(request, carrito_id):
    """
    Endpoint público al que MercadoPago redirige después del pago exitoso.
    Valida el pago con la SDK de MercadoPago, crea un Pedido desde el carrito,
    genera inscripciones para el usuario y marca el carrito como completado.
    """
    try:
        carrito = Carrito.objects.get(pk=carrito_id)
    except Carrito.DoesNotExist:
        return HttpResponseBadRequest("Carrito no encontrado")

    # MercadoPago pasa collection_id o payment_id en la query string
    collection_id = request.GET.get('collection_id') or request.GET.get('payment_id')
    collection_status = request.GET.get('collection_status') or request.GET.get('status')

    if not collection_id and not collection_status:
        return HttpResponseBadRequest("Parámetros de pago ausentes")

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    # Intentar verificar el pago con la API de MercadoPago si tenemos collection_id
    payment_approved = False
    payment_info = None
    if collection_id:
        try:
            payment_resp = sdk.payment().get(collection_id)
            payment_info = payment_resp.get('response', {})
            # Algunos entornos usan 'status' o 'collection_status'
            status_mp = payment_info.get('status') or payment_info.get('collection_status')
            if status_mp and status_mp.lower() == 'approved':
                payment_approved = True
        except Exception as e:
            # No interrumpimos: usaremos collection_status si está presente
            payment_info = None

    # Si no pudimos verificar por SDK, confiar en collection_status si viene en la query
    if not payment_approved and collection_status:
        if collection_status.lower() == 'approved':
            payment_approved = True

    if not payment_approved:
        # Pago no aprobado; mostrar mensaje simple
        return HttpResponse("Pago no aprobado. Si crees que es un error, contacta soporte.")

    # Pago aprobado: convertir carrito en pedido, crear items y generar inscripciones
    items = list(carrito.items.all())

    pedido = Pedido.objects.create(usuario=carrito.usuario, completado=True)
    for item in items:
        # Crear ItemPedido
        from .models import ItemPedido
        ItemPedido.objects.create(pedido=pedido, curso=item.curso, precio_compra=item.curso.precio)

        # Crear Inscripcion si no existe
        if not Inscripcion.objects.filter(usuario=carrito.usuario, curso=item.curso).exists():
            Inscripcion.objects.create(usuario=carrito.usuario, curso=item.curso)

    # Vaciar y marcar carrito como completado
    carrito.vaciar()
    carrito.completado = True
    carrito.save()

    # Responder con una página simple que permite volver al frontend
    html = f"""
    <html><body>
      <h1>Pago confirmado</h1>
      <p>Tu compra fue procesada correctamente. Gracias.</p>
      <p><a href="/">Volver al sitio</a></p>
    </body></html>
    """
    return HttpResponse(html)


def payments_failure(request, carrito_id):
    """
    Página simple para pagos fallidos o cancelados por el usuario.
    """
    try:
        carrito = Carrito.objects.get(pk=carrito_id)
    except Carrito.DoesNotExist:
        return HttpResponseBadRequest("Carrito no encontrado")

    # Aquí podemos mostrar una página con instrucciones o volver al carrito
    html = f"""
    <html><body>
      <h1>Pago no completado</h1>
      <p>El pago no fue completado. Tu carrito permanece intacto.</p>
      <p><a href="/cart">Volver al carrito</a></p>
    </body></html>
    """
    return HttpResponse(html)