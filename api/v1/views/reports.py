from rest_framework.response import Response
from rest_framework.views import APIView

from api.v1.serializers import ReportSerializer
from apps.automation.models import Automation
from apps.reports.models import Report


class ReportSummaryView(APIView):
    def get(self, request):
        return Response(
            {
                "automations": Automation.objects.filter(user=request.user).count(),
                "active_automations": Automation.objects.filter(user=request.user, is_active=True).count(),
                "activity_logs": Report.objects.filter(user=request.user).count(),
            }
        )


class ReportActivityView(APIView):
    def get(self, request):
        reports = Report.objects.filter(user=request.user)[:100]
        return Response(ReportSerializer(reports, many=True).data)

