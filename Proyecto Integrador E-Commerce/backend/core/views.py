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

        # notification_url: MercadoPago will POST notifications here (webhook)
        notification_url = request.build_absolute_uri(f"/api/v1/webhook/mercadopago/")

        # For auto_return to work MercadoPago requires a valid back_urls.success
        # that points to a web page (frontend). We'll set back_urls to the
        # frontend success/failure pages so MP accepts auto_return, and rely on
        # the webhook (`notification_url`) to process the enrollment server-side.
        frontend_success = f"{settings.FRONTEND_URL_RAILWAY}/payments/success/{carrito.id}/"
        frontend_failure = f"{settings.FRONTEND_URL_RAILWAY}/payments/failure/{carrito.id}/"

        preference_data = {
            "items": items,
            "back_urls": {
                # Use frontend URLs so MercadoPago can auto-return the user
                "success": frontend_success,
                "failure": frontend_failure,
            },
            "notification_url": notification_url,
            "auto_return": "approved",
            "external_reference": str(carrito.id),
        }

        try:
            preference_response = sdk.preference().create(preference_data)
        except Exception as e:
            # Log and return a useful error so the frontend can show a message
            print('Error creating MercadoPago preference:', e)
            return Response({'error': 'preference_creation_failed', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        preference = preference_response.get('response') if isinstance(preference_response, dict) else None

        # Validate structure returned by SDK
        if not preference or 'id' not in preference or 'init_point' not in preference:
            print('Unexpected preference response from MercadoPago:', preference_response)
            return Response({'error': 'invalid_preference_response', 'details': preference_response}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            "preference_id": preference["id"],
            "init_point": preference["init_point"],
        }, status=status.HTTP_201_CREATED)


# ------------------------------------------------------------------
# Endpoints para manejar el retorno desde MercadoPago
# ------------------------------------------------------------------
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import json


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

    # Una vez procesado en el servidor, redirigimos al frontend (la UI en Vue)
    # pasando los parámetros relevantes en la query para que la página
    # `PaymentsSuccess` pueda mostrarlos.
    query_parts = []
    if collection_id:
        query_parts.append(f"collection_id={collection_id}")
    if collection_status:
        query_parts.append(f"collection_status={collection_status}")
    if collection_id is None and collection_status is None:
        # No hay información adicional, pero igual redirigimos
        redirect_url = f"{settings.FRONTEND_URL_RAILWAY}/payments/success/{carrito.id}/"
    else:
        qs = "&".join(query_parts)
        redirect_url = f"{settings.FRONTEND_URL_RAILWAY}/payments/success/{carrito.id}/?{qs}"

    return redirect(redirect_url)


def payments_failure(request, carrito_id):
    """
    Página simple para pagos fallidos o cancelados por el usuario.
    """
    try:
        carrito = Carrito.objects.get(pk=carrito_id)
    except Carrito.DoesNotExist:
        return HttpResponseBadRequest("Carrito no encontrado")

    # Aquí podemos mostrar una página con instrucciones o volver al carrito
    # Redirigir al frontend (la página Vue) para que muestre el mensaje.
    redirect_url = f"{settings.FRONTEND_URL_RAILWAY}/payments/failure/{carrito.id}/"
    return redirect(redirect_url)


@csrf_exempt
def mercadopago_webhook(request):
    """
    Endpoint para recibir notificaciones (IPN) de MercadoPago.
    Se espera un JSON con la forma {"action": "payment.created", "data": {"id": <payment_id>}}
    Aquí verificamos el pago con la SDK y si está aprobado creamos el Pedido
    y las Inscripciones asociadas al carrito (usando external_reference).
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return HttpResponseBadRequest('Invalid JSON')

    # Extraer payment id de la notificación
    payment_id = None
    if isinstance(payload, dict):
        data = payload.get('data') or {}
        if isinstance(data, dict):
            payment_id = data.get('id')
        # Algunos webhooks usan payload['type'] y payload['id']
        if not payment_id:
            payment_id = payload.get('id')

    if not payment_id:
        return HttpResponseBadRequest('No payment id in payload')

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    try:
        payment_resp = sdk.payment().get(payment_id)
        payment_info = payment_resp.get('response', {})
    except Exception as e:
        # Loguear y devolver 200 para que MP no reintente infinitamente
        print('Error fetching MP payment:', e)
        return JsonResponse({'ok': False, 'error': 'payment fetch failed'}, status=200)

    # Buscar external_reference que contiene el carrito id según el checkout
    external_reference = payment_info.get('external_reference')
    try:
        carrito_id = int(external_reference) if external_reference else None
    except Exception:
        carrito_id = None

    # Determinar si pago aprobado
    status_mp = (payment_info.get('status') or payment_info.get('collection_status') or '').lower()
    if not carrito_id:
        # No podemos procesar sin referencia al carrito
        return JsonResponse({'ok': False, 'reason': 'missing external_reference'}, status=200)

    if status_mp != 'approved':
        # No aprobado: devolver 200 para confirmar recepción
        return JsonResponse({'ok': True, 'processed': False, 'status': status_mp}, status=200)

    # Procesar: crear Pedido, ItemPedido e Inscripciones (idéntico a payments_success)
    try:
        carrito = Carrito.objects.get(pk=carrito_id)
    except Carrito.DoesNotExist:
        return JsonResponse({'ok': False, 'reason': 'carrito not found'}, status=200)

    # Evitar procesar dos veces: si carrito ya está completado, devolvemos ok
    if carrito.completado:
        return JsonResponse({'ok': True, 'processed': False, 'reason': 'already completed'}, status=200)

    items = list(carrito.items.all())
    pedido = Pedido.objects.create(usuario=carrito.usuario, completado=True)
    for item in items:
        from .models import ItemPedido
        ItemPedido.objects.create(pedido=pedido, curso=item.curso, precio_compra=item.curso.precio)
        if not Inscripcion.objects.filter(usuario=carrito.usuario, curso=item.curso).exists():
            Inscripcion.objects.create(usuario=carrito.usuario, curso=item.curso)

    carrito.vaciar()
    carrito.completado = True
    carrito.save()

    return JsonResponse({'ok': True, 'processed': True}, status=200)