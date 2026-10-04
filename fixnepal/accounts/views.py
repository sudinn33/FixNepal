from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import RegisterSerializer, NotificationSerializer
from .models import Notification, UserProfile, User
from .utils import build_activation_link
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if settings.DEBUG:
            user = User.objects.get(username=response.data['username'])
            response.data['activation_link'] = build_activation_link(user)
        return response


class ActivateAccountView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({'detail': 'Invalid activation link.'}, status=400)

        if user.is_active:
            return Response({'detail': 'Account already activated.'})

        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'This link is invalid or has expired.'}, status=400)

        user.is_active = True
        user.save()
        return Response({'detail': 'Account activated.'})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'username': request.user.username,
            'role': request.user.role,
        })


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return self._payload(request.user, profile)

    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.phone_number = request.data.get('phone_number', user.phone_number)
        user.save()

        profile.address = request.data.get('address', profile.address)
        profile.city = request.data.get('city', profile.city)
        profile.save()

        return self._payload(user, profile)

    def _payload(self, user, profile):
        return Response({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'role': user.role,
            'date_joined': user.date_joined,
            'is_active': user.is_active,
            'address': profile.address,
            'city': profile.city,
        })


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current = request.data.get('current_password', '')
        new = request.data.get('new_password', '')

        if not request.user.check_password(current):
            return Response({'detail': 'Current password is incorrect.'}, status=400)
        try:
            validate_password(new, request.user)
        except ValidationError as e:
            return Response({'detail': ' '.join(e.messages)}, status=400)

        request.user.set_password(new)
        request.user.save()
        return Response({'detail': 'Password changed.'})


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['patch'])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'status': 'ok'})