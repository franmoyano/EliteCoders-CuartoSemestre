from django.urls import path, include
from rest_framework_nested import routers
from .views import CategoriaViewSet, CursoViewSet, InstructorViewSet, LeccionViewSet, MisCursosView

router = routers.SimpleRouter()
router.register(r'categorias', CategoriaViewSet, basename='categorias')
router.register(r'instructores', InstructorViewSet, basename='instructores')
router.register(r'cursos', CursoViewSet, basename='cursos')

cursos_router = routers.NestedSimpleRouter(router, r'cursos', lookup='curso')
cursos_router.register(r'lecciones', LeccionViewSet, basename='curso-lecciones')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(cursos_router.urls)),
    path('mis-cursos/', MisCursosView.as_view(), name='mis-cursos'),
]