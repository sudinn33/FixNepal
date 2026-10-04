from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ServiceCategory, ServiceProvider, Service
from .serializers import ServiceCategorySerializer, ServiceProviderSerializer, ServiceSerializer
from accounts.permissions import IsAdminRole, IsProviderRole, IsOwnerProviderOrReadOnly

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.AllowAny()]


class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsProviderRole()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerProviderOrReadOnly()]
        if self.action == 'me':
            return [IsProviderRole()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            provider = ServiceProvider.objects.get(user=request.user)
        except ServiceProvider.DoesNotExist:
            return Response(None, status=200)
        return Response(ServiceProviderSerializer(provider).data)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_available=True)
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'provider', 'provider__service_area']
    search_fields = ['title', 'description']

    def get_queryset(self):
        if self.action in ['update', 'partial_update', 'destroy', 'retrieve']:
            return Service.objects.all()
        return Service.objects.filter(is_available=True)

    def get_permissions(self):
        if self.action == 'create':
            return [IsProviderRole()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerProviderOrReadOnly()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        provider = ServiceProvider.objects.get(user=self.request.user)
        serializer.save(provider=provider)