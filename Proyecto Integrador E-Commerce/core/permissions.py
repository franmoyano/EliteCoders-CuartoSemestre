# core/permissions.py

from rest_framework import permissions

from core.models import Inscripcion


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir que solo los administradores (staff)
    puedan editar objetos. Los demás usuarios solo pueden leer.
    """
    def has_permission(self, request, view):
        # Los permisos de lectura (GET, HEAD, OPTIONS) se permiten a cualquier petición,
        # sea anónima o autenticada.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Los permisos de escritura (POST, PUT, DELETE) solo se permiten
        # si el usuario está autenticado y es personal de staff.
        return request.user and request.user.is_staff

class CanViewLessons(permissions.BasePermission):
    """
    Permiso que verifica si un usuario está inscrito en un curso para ver sus lecciones.
    Los administradores siempre tienen acceso.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_staff:
            return True

        if request.method not in permissions.SAFE_METHODS:
            return False

        if not request.user.is_authenticated:
            return False

        curso_pk = view.kwargs.get('curso_pk')
        if not curso_pk:
            return False

        is_enrolled = Inscripcion.objects.filter(
            usuario=request.user,
            curso_id=curso_pk
        ).exists()

        return is_enrolled