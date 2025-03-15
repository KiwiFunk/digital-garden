from rest_framework import serializers
from .models import Plant

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant                               # Specify the model to serialize
        fields = '__all__'                          # Include all the model fields in the API