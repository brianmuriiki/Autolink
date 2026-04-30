from django.utils import timezone

from apps.automation.models import Automation
from apps.reports.models import Report
from core.services.subscription import validate_subscription


def create_automation(user, **data):
    if not validate_subscription(user):
        raise PermissionError("Subscription is inactive or expired.")
    return Automation.objects.create(user=user, **data)


def run_automation(automation):
    automation.last_run_at = timezone.now()
    automation.save(update_fields=["last_run_at", "updated_at"])
    Report.objects.create(
        user=automation.user,
        action="automation_run",
        details={"automation_id": automation.id, "type": automation.type},
    )
    return automation


def pause_automation(automation):
    automation.is_active = False
    automation.save(update_fields=["is_active", "updated_at"])
    return automation

