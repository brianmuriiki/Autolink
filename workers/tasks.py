from celery import shared_task
from django.utils import timezone

from apps.automation.models import Automation
from apps.reports.models import Report
from apps.subscriptions.models import Subscription
from core.services.automation import run_automation
from core.services.subscription import check_expiry


@shared_task
def send_scheduled_messages():
    due_automations = Automation.objects.filter(
        type=Automation.AutomationType.SCHEDULED_MESSAGE,
        is_active=True,
        schedule_time__lte=timezone.now(),
    )
    count = 0
    for automation in due_automations:
        run_automation(automation)
        automation.is_active = False
        automation.save(update_fields=["is_active", "updated_at"])
        count += 1
    return {"sent": count}


@shared_task
def auto_reply_listener():
    active_replies = Automation.objects.filter(type=Automation.AutomationType.AUTO_REPLY, is_active=True).count()
    return {"active_auto_replies": active_replies}


@shared_task
def log_activity(user_id, action, details=None):
    Report.objects.create(user_id=user_id, action=action, details=details or {})
    return {"logged": True}


@shared_task
def subscription_expiry_checker():
    checked = 0
    for subscription in Subscription.objects.filter(is_active=True):
        check_expiry(subscription)
        checked += 1
    return {"checked": checked}

