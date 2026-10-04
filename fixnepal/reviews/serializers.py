from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'booking', 'customer', 'customer_username', 'provider', 'provider_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['customer', 'provider']