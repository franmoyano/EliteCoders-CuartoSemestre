# orders/admin.py
from django.contrib import admin

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at', 'status')
    search_fields = ('user__username', 'status')
