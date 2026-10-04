from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from accounts.permissions import IsCustomerRole
from accounts.models import Notification

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'customer':
            return Booking.objects.filter(customer=user).order_by('-created_at')
        if user.role == 'provider':
            return Booking.objects.filter(provider__user=user).order_by('-created_at')
        return Booking.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [IsCustomerRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        booking = serializer.save(customer=self.request.user)
        Notification.objects.create(
            recipient=booking.provider.user,
            title='New booking request',
            message=f'{booking.customer.username} requested {booking.service.title}.',
        )

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        user = request.user

        valid_transitions = {
            'pending': ['accepted', 'rejected', 'cancelled'],
            'accepted': ['in_progress', 'cancelled'],
            'in_progress': ['completed'],
        }
        provider_actions = ['accepted', 'rejected', 'in_progress', 'completed']
        customer_actions = ['cancelled']

        is_provider = user.role == 'provider' and booking.provider.user == user
        is_customer = user.role == 'customer' and booking.customer == user

        if new_status in provider_actions and not is_provider:
            return Response({'error': 'Only the assigned provider can do that.'}, status=status.HTTP_403_FORBIDDEN)
        if new_status in customer_actions and not is_customer:
            return Response({'error': 'Only the customer can cancel a booking.'}, status=status.HTTP_403_FORBIDDEN)

        if booking.status not in valid_transitions or new_status not in valid_transitions.get(booking.status, []):
            return Response(
                {'error': f'Cannot change status from {booking.status} to {new_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status
        booking.save()

        recipient = booking.customer if new_status in provider_actions else booking.provider.user
        Notification.objects.create(
            recipient=recipient,
            title=f'Booking {new_status.replace("_", " ")}',
            message=f'{booking.service.title} is now {new_status.replace("_", " ")}.',
        )

        return Response(BookingSerializer(booking).data)