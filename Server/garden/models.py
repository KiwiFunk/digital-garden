from django.db import models                                    # Import the Django database module
from django.utils import timezone
from datetime import timedelta

class Plant(models.Model):                                      # Define our model class named 'Plant'
    name = models.CharField(max_length=50)                      # Name of the plant. CharField is used to store strings
    botanical_name = models.CharField(                          # Botanical name of the plant (Optional)
        max_length=100, 
        default=""
    )     
    date_added = models.DateField(auto_now_add=True)            # Date the plant was added
    notes = models.TextField(blank=True, null=True)             # Optional notes about the plant

    harvest_months = models.CharField(                          # Months when the plant is harvested
        max_length=200,                                          # Set a max length to accommodate multiple choices
        default="",
    )

    """
    FUNCTIONS AND FIELDS TO HANDLE WATERING
    """

    watering_frequency = models.IntegerField(                   # How often the plant should be watered
        choices=[
            (1, 'DEBUG (1 hr)'),                                
            (24, 'Daily'),                                      # The first tuple value is the value stored in the database
            (48, 'Every 2 days'),                               # The second tuple value is the human-readable value seen in forms etc
            (168, 'Weekly'),
            (336, 'Bi-weekly'),
            (672, 'Monthly'),
        ],
        default=168,                                            # Default watering frequency is weekly
        help_text="How often the plant should be watered"       # Help text for Django admin
    )

    last_watered = models.DateTimeField(                        # Date the plant was last watered
        blank=True, 
        null=True, 
        help_text="When the plant was last watered"
    )  

    def water_plant(self):                                      # Method to update the last watered timestamp
        self.last_watered = timezone.now()                      # Set the last watered date to the current date
        self.save()                                             # Save the updated plant object

    def get_water_level(self):
        """Returns water level as a percentage (0-100)"""
        if not self.last_watered:                                                                   # If the plant has never been watered, return 0
            return 0

        time_since_watering = timezone.now() - self.last_watered
        elapsed_percent = time_since_watering.total_seconds() / (self.watering_frequency * 3600)    # Convert hours to seconds
        water_level = 100 * max(0, 1 - elapsed_percent)                                             # Calculate remaining water level as a percentage

        return round(water_level)                                                                   # Round the water level to the nearest integer                                     

    @property                                                                       # Decorator to define a property
    def needs_watering(self):                                                       # Check if the plant needs watering
        if self.last_watered is None:                                               # If the plant has never been watered return True
            return True                                                             
        frequency_in_minutes = self.watering_frequency * 60                         # Convert the watering frequency to minutes
        next_watering = self.last_watered + timedelta(minutes=frequency_in_minutes) # Calculate the next watering date
        return timezone.now() >= next_watering                                      # Return True if needs watering


    def __str__(self):                                      # Defines a human-readable string representation of the object        
        return self.name                                    # Return the name of the plant as the string representation