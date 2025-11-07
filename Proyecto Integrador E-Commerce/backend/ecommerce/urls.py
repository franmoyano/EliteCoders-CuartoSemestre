# ecommerce/urls.py

from django.contrib import admin
from django.urls import path, include
from core import views as core_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('core.urls')),

    # Endpoints públicos para retorno de MercadoPago
    path('payments/success/<int:carrito_id>/', core_views.payments_success, name='payments-success'),
    path('payments/failure/<int:carrito_id>/', core_views.payments_failure, name='payments-failure'),

    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.jwt')),
    path('api-auth/', include('rest_framework.urls')),
]