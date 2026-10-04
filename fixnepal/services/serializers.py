from rest_framework import serializers
from .models import ServiceCategory, ServiceProvider, Service

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon_class']


class ServiceProviderSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = ServiceProvider
        fields = ['id', 'business_name', 'bio', 'primary_category', 'experience_years', 'service_area', 'is_verified', 'average_rating', 'phone_number']


class ServiceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)
    provider_phone = serializers.CharField(source='provider.user.phone_number', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'provider', 'provider_name', 'provider_phone', 'category', 'category_name', 'title', 'description', 'base_price', 'price_type', 'is_available']
        read_only_fields = ['provider']