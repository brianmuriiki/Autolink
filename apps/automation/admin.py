from django.contrib import admin

from .models import Automation, MessageTemplate


@admin.register(Automation)
class AutomationAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "is_active", "schedule_time", "last_run_at")
    list_filter = ("type", "is_active")
    search_fields = ("user__email", "message", "trigger")


@admin.register(MessageTemplate)
class MessageTemplateAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "created_at")
    search_fields = ("user__email", "name", "body")

