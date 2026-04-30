from django.conf import settings
from django.db import models


class ConnectedAccount(models.Model):
    class Platform(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp"
        FACEBOOK = "facebook", "Facebook"
        INSTAGRAM = "instagram", "Instagram"
        TELEGRAM = "telegram", "Telegram"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connected_accounts")
    platform = models.CharField(max_length=30, choices=Platform.choices)
    account_name = models.CharField(max_length=150, blank=True)
    external_account_id = models.CharField(max_length=150, blank=True)
    token = models.TextField()
    refresh_token = models.TextField(blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "platform", "external_account_id")

    def __str__(self):
        return f"{self.user.email} - {self.platform}"

