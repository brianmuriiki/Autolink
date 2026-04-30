from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.automation.models import Automation, MessageTemplate
from apps.payments.models import Payment
from apps.platforms.models import ConnectedAccount
from apps.reports.models import Report
from apps.subscriptions.models import Subscription

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "username", "full_name", "phone_number", "password")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        Subscription.objects.create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "full_name", "phone_number", "is_suspended")
        read_only_fields = ("id", "email", "is_suspended")


class ConnectedAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = (
            "id",
            "platform",
            "account_name",
            "external_account_id",
            "token",
            "refresh_token",
            "token_expires_at",
            "is_active",
            "created_at",
        )
        read_only_fields = ("id", "is_active", "created_at")
        extra_kwargs = {"token": {"write_only": True}, "refresh_token": {"write_only": True}}

    def create(self, validated_data):
        return ConnectedAccount.objects.create(user=self.context["request"].user, **validated_data)


class MessageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTemplate
        fields = ("id", "name", "body", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        return MessageTemplate.objects.create(user=self.context["request"].user, **validated_data)


class AutomationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automation
        fields = (
            "id",
            "connected_account",
            "type",
            "trigger",
            "message",
            "schedule_time",
            "is_active",
            "last_run_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "last_run_at", "created_at", "updated_at")

    def create(self, validated_data):
        return Automation.objects.create(user=self.context["request"].user, **validated_data)


class SubscriptionSerializer(serializers.ModelSerializer):
    has_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Subscription
        fields = ("id", "plan", "expiry_date", "is_active", "has_expired")
        read_only_fields = ("id", "expiry_date", "is_active", "has_expired")


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "amount", "currency", "status", "provider", "provider_reference", "created_at")
        read_only_fields = ("id", "status", "created_at")

    def create(self, validated_data):
        return Payment.objects.create(user=self.context["request"].user, **validated_data)


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("id", "action", "details", "timestamp")
        read_only_fields = ("id", "timestamp")

