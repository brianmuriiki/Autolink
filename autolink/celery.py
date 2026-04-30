import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "autolink.settings")

app = Celery("autolink")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

