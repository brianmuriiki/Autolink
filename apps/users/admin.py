from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class AutoLinkUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("AutoLink Profile", {"fields": ("full_name", "phone_number", "is_suspended")}),
    )
    list_display = ("email", "username", "full_name", "is_staff", "is_suspended")
    search_fields = ("email", "username", "full_name")

