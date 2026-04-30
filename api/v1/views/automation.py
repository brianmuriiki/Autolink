from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from api.v1.serializers import AutomationSerializer, MessageTemplateSerializer
from apps.automation.models import Automation, MessageTemplate


class AutomationCreateView(generics.CreateAPIView):
    serializer_class = AutomationSerializer


class AutomationListView(generics.ListAPIView):
    serializer_class = AutomationSerializer

    def get_queryset(self):
        return Automation.objects.filter(user=self.request.user)


class AutomationUpdateView(generics.UpdateAPIView):
    serializer_class = AutomationSerializer

    def get_queryset(self):
        return Automation.objects.filter(user=self.request.user)


class AutomationDeleteView(generics.DestroyAPIView):
    serializer_class = AutomationSerializer

    def get_queryset(self):
        return Automation.objects.filter(user=self.request.user)


class AutomationToggleView(APIView):
    def post(self, request, pk):
        automation = Automation.objects.get(pk=pk, user=request.user)
        automation.is_active = not automation.is_active
        automation.save(update_fields=["is_active", "updated_at"])
        return Response(AutomationSerializer(automation).data)


class TemplateListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageTemplateSerializer

    def get_queryset(self):
        return MessageTemplate.objects.filter(user=self.request.user)

