from rest_framework.response import Response
from rest_framework.views import APIView

from api.v1.serializers import SubscriptionSerializer
from apps.subscriptions.models import Subscription
from core.services.subscription import upgrade_subscription


class SubscriptionStatusView(APIView):
    def get(self, request):
        subscription, _ = Subscription.objects.get_or_create(user=request.user)
        return Response(SubscriptionSerializer(subscription).data)


class SubscriptionUpgradeView(APIView):
    def post(self, request):
        plan = request.data.get("plan", "premium")
        days = int(request.data.get("days", 30))
        subscription = upgrade_subscription(request.user, plan=plan, days=days)
        return Response(SubscriptionSerializer(subscription).data)
