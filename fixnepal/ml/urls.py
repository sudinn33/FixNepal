from django.urls import path
from .views import SuggestCategoryView

urlpatterns = [
    path("suggest-category/", SuggestCategoryView.as_view(), name="suggest-category"),
]
