from django.contrib import admin

from .models import ConnectedAccount


@admin.register(ConnectedAccount)
class ConnectedAccountAdmin(admin.ModelAdmin):
    list_display = ("user", "platform", "account_name", "is_active", "created_at")
    list_filter = ("platform", "is_active")
    search_fields = ("user__email", "account_name", "external_account_id")

