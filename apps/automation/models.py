from django.conf import settings
from django.db import models


class MessageTemplate(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="message_templates")
    name = models.CharField(max_length=120)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Automation(models.Model):
    class AutomationType(models.TextChoices):
        AUTO_REPLY = "auto_reply", "Auto Reply"
        SCHEDULED_MESSAGE = "scheduled_message", "Scheduled Message"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="automations")
    connected_account = models.ForeignKey(
        "platforms.ConnectedAccount",
        on_delete=models.CASCADE,
        related_name="automations",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=40, choices=AutomationType.choices)
    trigger = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    schedule_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.type}"

