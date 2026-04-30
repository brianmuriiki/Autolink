from rest_framework import generics

from api.v1.serializers import PaymentSerializer
from apps.payments.models import Payment


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

