from rest_framework.routers import DefaultRouter
from .views import ServiceCategoryViewSet, ServiceProviderViewSet, ServiceViewSet

router = DefaultRouter()
router.register('categories', ServiceCategoryViewSet)
router.register('providers', ServiceProviderViewSet)
router.register('services', ServiceViewSet)

urlpatterns = router.urls