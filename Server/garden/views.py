from django.shortcuts import render
from rest_framework.views import APIView                            #DRF class for creating API views
from rest_framework.response import Response                        #DRF utility for returning API responses
from rest_framework import status                                   #DRF utility for returning HTTP status codes
from .models import Plant                                           #Import the Plant model
from .serializers import PlantSerializer                            #Translate objects to JSON and vice versa

class PlantList(APIView):
    def get(self, request):
        plants = Plant.objects.all()                                #Fetch all the plants from the database
        serializer = PlantSerializer(plants, many=True)             #Serialize the plants to JSON
        return Response(serializer.data)                            #Return the serialized data

    def post(self, request):
        serializer = PlantSerializer(data=request.data)             #Check if the incoming data matches the Plant model
        if serializer.is_valid():                                   #If the data is valid
            serializer.save()                                       #Save the data to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlantDetail(APIView):
    def get(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)                        #Fetch the plant with the given primary key
            serializer = PlantSerializer(plant)                     #Serialize the plant to JSON
            return Response(serializer.data)                        #Return the requested object as JSON
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)                        #Fetch the plant with the given primary key
            serializer = PlantSerializer(plant, data=request.data)  #Combine incoming data with the existing plant
            if serializer.is_valid():                               #If the data is valid
                serializer.save()                                   #Save the updated data
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)       #Return a 404 if the plant does not exist

    def delete(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)                        #Fetch the plant with the given primary key
            plant.delete()                                          #Delete the plant
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)