# core/urls.py
from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    CategoriaViewSet,
    InstructorViewSet,
    CursoViewSet,
    LeccionViewSet,
    MisCursosView,
    CarritoViewSet,
)
from . import views

router = routers.SimpleRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'instructores', InstructorViewSet, basename='instructores')
router.register(r'cursos', CursoViewSet, basename='cursos')
router.register(r'carrito', CarritoViewSet, basename='carrito')

cursos_router = routers.NestedSimpleRouter(router, r'cursos', lookup='curso')
cursos_router.register(r'lecciones', LeccionViewSet, basename='curso-lecciones')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(cursos_router.urls)),
    path('mis-cursos/', MisCursosView.as_view(), name='mis-cursos'),
    # Endpoints to handle MercadoPago redirects / webhooks
    # path('payments/success/<int:carrito_id>/', views.payments_success, name='payments-success-backend'),
    # path('payments/failure/<int:carrito_id>/', views.payments_failure, name='payments-failure-backend'),
    path('webhook/mercadopago/', views.mercadopago_webhook, name='mp-webhook'),
]
