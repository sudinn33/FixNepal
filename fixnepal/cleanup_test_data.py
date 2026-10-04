from accounts.models import User, UserProfile
from services.models import ServiceCategory, ServiceProvider, Service

electrical, _ = ServiceCategory.objects.get_or_create(
    slug="electrical",
    defaults={"name": "Electrical", "description": "Wiring and electrical repair"},
)

ramelectric, created = User.objects.get_or_create(
    username="ramelectric",
    defaults={"email": "ramelectric@example.com", "role": "provider"},
)
if created:
    ramelectric.set_password("testpass123")
    ramelectric.save()
UserProfile.objects.get_or_create(user=ramelectric)

# Provider 2 is the electric business, provider 1 is the plumbing business.
# The electric business moves first so ramplumber is free before the plumbing business claims it.
electric_business = ServiceProvider.objects.get(pk=2)
electric_business.user = ramelectric
electric_business.primary_category = electrical
electric_business.save()

plumbing_business = ServiceProvider.objects.get(pk=1)
plumbing_business.user = User.objects.get(username="ramplumber")
plumbing_business.save()

Service.objects.filter(title="Wiring Repair").update(category=electrical)

admin_user = User.objects.get(username="admin")
admin_user.role = "admin"
admin_user.save()

for p in ServiceProvider.objects.all():
    print(p.business_name, "| owner:", p.user.username, "| category:", p.primary_category)
for s in Service.objects.all():
    print(s.title, "| provider:", s.provider.business_name, "| category:", s.category)
print("admin role:", User.objects.get(username="admin").role)