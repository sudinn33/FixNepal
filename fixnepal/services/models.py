from django.db import models
from accounts.models import User

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon_class = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class ServiceProvider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    primary_category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True)
    experience_years = models.PositiveIntegerField(default=0)
    service_area = models.CharField(max_length=150, blank=True)
    is_verified = models.BooleanField(default=False)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    def __str__(self):
        return self.business_name


class Service(models.Model):
    PRICE_TYPE_CHOICES = (
        ('fixed', 'Fixed'),
        ('hourly', 'Hourly'),
    )
    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='services')
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=10, choices=PRICE_TYPE_CHOICES, default='fixed')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title