from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)
    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'customer', 'customer_username', 'provider', 'provider_name', 'service', 'service_title', 'scheduled_date', 'scheduled_time', 'address', 'contact_phone', 'notes', 'status', 'total_cost', 'created_at', 'has_review']
        read_only_fields = ['status', 'customer']

    def get_has_review(self, obj):
        return hasattr(obj, 'review')