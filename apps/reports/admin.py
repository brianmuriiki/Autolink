from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "timestamp")
    search_fields = ("user__email", "action")
    list_filter = ("action",)

