from accounts.models import User, UserProfile
from services.models import ServiceCategory, ServiceProvider, Service

cleaning, _ = ServiceCategory.objects.get_or_create(
    slug="cleaning",
    defaults={"name": "Cleaning", "description": "Home and office cleaning"},
)

cleanraj, created = User.objects.get_or_create(
    username="cleanraj",
    defaults={"email": "cleanraj@example.com", "role": "provider", "phone_number": "9801234567"},
)
if created:
    cleanraj.set_password("testpass123")
    cleanraj.save()
profile, _ = UserProfile.objects.get_or_create(user=cleanraj)
profile.address = "Baneshwor-10"
profile.city = "Kathmandu"
profile.save()

cleaning_provider, _ = ServiceProvider.objects.get_or_create(
    user=cleanraj,
    defaults={
        "business_name": "Raj Cleaning Co",
        "primary_category": cleaning,
        "experience_years": 4,
        "service_area": "Kathmandu",
    },
)

Service.objects.get_or_create(
    provider=cleaning_provider,
    title="Deep Home Cleaning",
    defaults={
        "category": cleaning,
        "description": "Full home deep cleaning, kitchen and bathrooms included",
        "base_price": "1200.00",
        "price_type": "fixed",
    },
)

ramplumber = User.objects.get(username="ramplumber")
ramplumber.phone_number = "9812345678"
ramplumber.save()
plumber_provider = ServiceProvider.objects.get(user=ramplumber)
Service.objects.get_or_create(
    provider=plumber_provider,
    title="Toilet Installation",
    defaults={
        "category": plumber_provider.primary_category,
        "description": "Installing new toilets and fittings",
        "base_price": "1500.00",
        "price_type": "fixed",
    },
)

ramelectric = User.objects.get(username="ramelectric")
ramelectric.phone_number = "9845612378"
ramelectric.save()
electric_provider = ServiceProvider.objects.get(user=ramelectric)
Service.objects.get_or_create(
    provider=electric_provider,
    title="Switchboard Installation",
    defaults={
        "category": electric_provider.primary_category,
        "description": "Installing and replacing switchboards",
        "base_price": "900.00",
        "price_type": "fixed",
    },
)

for s in Service.objects.all():
    print(s.title, "-", s.provider.business_name, "-", s.provider.user.phone_number)