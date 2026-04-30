from django.contrib import admin

from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "is_active", "expiry_date")
    list_filter = ("plan", "is_active")
    search_fields = ("user__email",)

