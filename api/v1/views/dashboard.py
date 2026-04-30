from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.automation.models import Automation
from apps.payments.models import Payment
from apps.reports.models import Report
from core.permissions.admin import IsAdminUserRole

User = get_user_model()


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        return Response(
            {
                "users": User.objects.count(),
                "automations": Automation.objects.count(),
                "payments": Payment.objects.count(),
                "reports": Report.objects.count(),
            }
        )


class AdminUsersView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        return Response(
            [
                {"id": user.id, "email": user.email, "full_name": user.full_name, "is_suspended": user.is_suspended}
                for user in User.objects.order_by("-date_joined")[:200]
            ]
        )

    def put(self, request):
        user = User.objects.get(pk=request.data["user_id"])
        user.is_suspended = bool(request.data.get("is_suspended", True))
        user.save(update_fields=["is_suspended"])
        return Response({"id": user.id, "is_suspended": user.is_suspended})

