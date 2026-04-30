from rest_framework import generics

from api.v1.serializers import ConnectedAccountSerializer
from apps.platforms.models import ConnectedAccount
from core.services.platform import disconnect_platform


class PlatformConnectView(generics.CreateAPIView):
    serializer_class = ConnectedAccountSerializer


class PlatformListView(generics.ListAPIView):
    serializer_class = ConnectedAccountSerializer

    def get_queryset(self):
        return ConnectedAccount.objects.filter(user=self.request.user, is_active=True)


class PlatformDisconnectView(generics.DestroyAPIView):
    serializer_class = ConnectedAccountSerializer

    def get_queryset(self):
        return ConnectedAccount.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        disconnect_platform(instance)

