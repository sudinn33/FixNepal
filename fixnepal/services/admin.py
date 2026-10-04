from django.contrib import admin
from .models import ServiceCategory, ServiceProvider, Service

admin.site.register(ServiceCategory)
admin.site.register(ServiceProvider)
admin.site.register(Service)