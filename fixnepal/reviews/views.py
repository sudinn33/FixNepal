from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer
from accounts.permissions import IsCustomerRole

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsCustomerRole()]
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']

        if booking.customer != self.request.user:
            raise ValidationError("You can only review your own bookings.")
        if booking.status != 'completed':
            raise ValidationError("You can only review completed bookings.")
        if Review.objects.filter(booking=booking).exists():
            raise ValidationError("This booking has already been reviewed.")

        serializer.save(customer=self.request.user, provider=booking.provider)
        self.update_provider_rating(booking.provider)

    def update_provider_rating(self, provider):
        avg = Review.objects.filter(provider=provider).aggregate(Avg('rating'))['rating__avg']
        provider.average_rating = round(avg, 2) if avg is not None else 0.00
        provider.save()