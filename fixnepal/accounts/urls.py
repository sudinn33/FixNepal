from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, ProfileView, ChangePasswordView, NotificationViewSet, ActivateAccountView

router = DefaultRouter()
router.register('notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('activate/<str:uidb64>/<str:token>/', ActivateAccountView.as_view(), name='activate'),
] + router.urls