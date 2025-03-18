from django.urls import path
from .views import PlantList, PlantDetail

urlpatterns = [
    path('plants/', PlantList.as_view(), name='plant-list'),                # List and create plants
    path('plants/<int:pk>/', PlantDetail.as_view(), name='plant-detail'),   # Retrieve, update, delete a plant providing its primary key
    path('plants/<int:pk>/water-level/', PlantDetail.as_view({'get': 'get_water_level'})), #perform a GET request to get the water level of a plant
]
