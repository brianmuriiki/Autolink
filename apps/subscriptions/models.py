from django.conf import settings
from django.db import models
from django.utils import timezone


class Subscription(models.Model):
    class Plan(models.TextChoices):
        FREE = "free", "Free"
        PREMIUM = "premium", "Premium"
        BUSINESS = "business", "Business"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription")
    plan = models.CharField(max_length=30, choices=Plan.choices, default=Plan.FREE)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def has_expired(self):
        return bool(self.expiry_date and self.expiry_date <= timezone.now())

    def __str__(self):
        return f"{self.user.email} - {self.plan}"

