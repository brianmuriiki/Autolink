from datetime import timedelta

from django.utils import timezone

from apps.subscriptions.models import Subscription


def validate_subscription(user):
    subscription, _ = Subscription.objects.get_or_create(user=user)
    return subscription.is_active and not subscription.has_expired


def check_expiry(subscription):
    if subscription.has_expired:
        subscription.is_active = False
        subscription.plan = Subscription.Plan.FREE
        subscription.save(update_fields=["is_active", "plan", "updated_at"])
    return subscription


def upgrade_subscription(user, plan, days=30):
    subscription, _ = Subscription.objects.get_or_create(user=user)
    subscription.plan = plan
    subscription.is_active = True
    subscription.expiry_date = timezone.now() + timedelta(days=days)
    subscription.save()
    return subscription

