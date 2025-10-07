# core/urls.py
from django.urls import path, include
# Importamos el router anidado
from rest_framework_nested import routers
from .views import CategoriaViewSet, CursoViewSet, InstructorViewSet, LeccionViewSet

# El router principal es como el que ya tenías
router = routers.SimpleRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'instructores', InstructorViewSet, basename='instructores')
router.register(r'cursos', CursoViewSet, basename='cursos')

# --- AQUÍ OCURRE LA MAGIA DE LA ANIDACIÓN ---
# Creamos un nuevo router anidado dentro de 'cursos'
cursos_router = routers.NestedSimpleRouter(router, r'cursos', lookup='curso')
# Registramos el LeccionViewSet en este nuevo router.
# El 'basename' es importante para que DRF genere los nombres de las URLs correctamente.
cursos_router.register(r'lecciones', LeccionViewSet, basename='curso-lecciones')

# Las URLs de la API ahora incluyen las rutas del router principal y del anidado
urlpatterns = [
    path('', include(router.urls)),
    path('', include(cursos_router.urls)),
]