from django.conf import settings
from django.core.mail import send_mail
from rest_framework import serializers
from .models import User, UserProfile, Notification
from .utils import build_activation_link

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('customer', 'Customer'), ('provider', 'Service Provider')], default='customer')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone_number']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'customer'),
            phone_number=validated_data.get('phone_number', ''),
            is_active=False,
        )
        UserProfile.objects.create(user=user)

        activation_link = build_activation_link(user)
        send_mail(
            subject="Activate your FixNepal account",
            message=f"Hi {user.username}, activate your account here: {activation_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return user


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at']