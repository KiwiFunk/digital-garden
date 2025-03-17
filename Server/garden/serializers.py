from rest_framework import serializers
from .models import Plant

class PlantSerializer(serializers.ModelSerializer):
    needs_watering = serializers.BooleanField(read_only=True)       # Add the boolean field needs_watering to the serializer
    water_level = serializers.IntegerField(source='get_water_level', read_only=True)

    class Meta:
        model = Plant                                               # Specify the model to serialize
        fields = '__all__'                                          # Include all the model fields in the API