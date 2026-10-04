from services.models import ServiceCategory

categories = [
    ("Basic Cleaning", "basic-cleaning"),
    ("Deep Cleaning", "deep-cleaning"),
    ("Bathroom Cleaning", "bathroom-cleaning"),
    ("Kitchen Cleaning", "kitchen-cleaning"),
    ("Sofa/Carpet Cleaning", "sofa-carpet-cleaning"),
    ("Plumbing", "plumbing"),
    ("Electrical", "electrical"),
    ("Carpentry", "carpentry"),
    ("Painting", "painting"),
    ("Appliance Repair", "appliance-repair"),
    ("Furniture Assembly", "furniture-assembly"),
    ("Wall Mounting", "wall-mounting"),
    ("Tile Repair", "tile-repair"),
    ("Waterproofing", "waterproofing"),
    ("Renovation", "renovation"),
    ("Gardening", "gardening"),
    ("Lawn Maintenance", "lawn-maintenance"),
    ("Tree Trimming", "tree-trimming"),
    ("Landscaping", "landscaping"),
    ("House Moving", "house-moving"),
    ("Packing", "packing"),
    ("Loading/Unloading", "loading-unloading"),
    ("Furniture Moving", "furniture-moving"),
    ("Wi-Fi Setup", "wifi-setup"),
    ("CCTV Installation", "cctv-installation"),
    ("Computer/Laptop Setup", "computer-laptop-setup"),
    ("TV Installation", "tv-installation"),
]

for name, slug in categories:
    ServiceCategory.objects.get_or_create(slug=slug, defaults={"name": name})

print(f"{ServiceCategory.objects.count()} categories total.")