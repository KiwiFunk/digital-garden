from django.db import models                                # Import the Django database module
from django.utils import timezone
from datetime import timedelta

class Plant(models.Model):                                  # Define our model class named 'Plant'
    name = models.CharField(max_length=50)                  # Name of the plant. CharField is used to store strings
    botanical_name = models.CharField(                      # Botanical name of the plant (Optional)
        max_length=100, 
        default=""
    )     
    date_added = models.DateField(auto_now_add=True)        # Date the plant was added
    notes = models.TextField(blank=True, null=True)         # Optional notes about the plant

    watering_frequency = models.FloatField(                 # How often the plant should be watered
        choices=[
            (0.000694, 'Debug (1 min)'),                    # 1/1440 (minutes in a day) Remove for production, change to IntegerField
            (1, 'Daily'),                                   # The first tuple value is the value stored in the database
            (2, 'Every 2 days'),                            # The second tuple value is the human-readable value seen in forms etc
            (7, 'Weekly'),
            (14, 'Bi-weekly'),
            (30, 'Monthly'),
        ],
        default=7,                                          # Default watering frequency is weekly
        help_text="How often the plant should be watered"   # Help text for Django admin
    )

    last_watered = models.DateTimeField(                    # Date the plant was last watered
        blank=True, 
        null=True, 
        help_text="When the plant was last watered"
    )  

    def water_plant(self):                                  # Method to update the last watered timestamp
        self.last_watered = timezone.now()                  # Set the last watered date to the current date
        self.save()                                         # Save the updated plant object

    def get_water_level(self):
        """Returns water level as a percentage (0-100)"""
        if self.last_watered is None:
            return 0
            
        # Calculate time elapsed since last watering
        time_since_watering = timezone.now() - self.last_watered
        # Convert watering frequency to minutes
        frequency_in_minutes = self.watering_frequency * 1440
        # Calculate how much time has passed as a percentage of the watering frequency
        elapsed_percentage = (time_since_watering.total_seconds() / 60) / frequency_in_minutes
        # Convert to remaining water percentage (100% - elapsed%)
        water_level = max(0, 100 - (elapsed_percentage * 100))
        return int(round(water_level, 1))

    @property                                               # Decorator to define a property
    def needs_watering(self):                               # Check if the plant needs watering
        if self.last_watered is None:                       # If the plant has never been watered
            return True                                     # Return True
        frequency_in_minutes = self.watering_frequency * 1440                       # 1440 minutes in a day
        next_watering = self.last_watered + timedelta(minutes=frequency_in_minutes) # Calculate the next watering date
        return timezone.now() >= next_watering                                      # Return True if needs watering


    def __str__(self):                                      # Defines a human-readable string representation of the object        
        return self.name                                    # Return the name of the plant as the string representation