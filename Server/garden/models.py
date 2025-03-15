from django.db import models                                # Import the Django database module
from django.utils import timezone
from datetime import timedelta

class Plant(models.Model):                                  # Define our model class named 'Plant'
    name = models.CharField(max_length=50)                  # Name of the plant. CharField is used to store strings
    scientific_name = models.CharField(max_length=100)      # Scientific name of the plant
    date_planted = models.DateField(auto_now_add=True)      # Date the plant was planted set to current date
    growth_stage = models.CharField(
        max_length=50,
        choices=[                                           # The choices field is used to limit the possible values of the field                      
            ('Seed', 'Seed'),                               # The first tuple value is the value stored in the database               
            ('Sapling', 'Sapling'),                         # The second tuple value is the human-readable value seen in forms etc
            ('Blooming', 'Blooming'),
            ('Fully Grown', 'Fully Grown'),
        ],
        default='Seed'                                      # The default value of the field
    )
    notes = models.TextField(blank=True, null=True)         # Optional notes about the plant

    last_watered = models.DateField(                        # Date the plant was last watered
        blank=True, 
        null=True, 
        help_text="When the plant was last watered"
    )  

    FREQUENCY_CHOICES = [                                   # Define a list of choices for watering frequency
        (0.000694, 'Debug (1 min)'),  # 1/1440 (minutes in a day)
        (1, 'Daily'),
        (2, 'Every 2 days'),
        (7, 'Weekly'),
        (14, 'Bi-weekly'),
        (30, 'Monthly'),
    ]

    watering_frequency = models.FloatField(                 # How often the plant should be watered. (CHANGE TO INTEGERFIELD AFTER REMOVING DEBUG FREQUENCY_CHOICE)
        choices=FREQUENCY_CHOICES,                          # Set the choices for watering frequency
        default=7,                                          # Set the default watering frequency to weekly
        help_text="How often the plant should be watered"   # Help text for Django admin
    )

    def water_plant(self):                                  # Method to update the last watered timestamp
        self.last_watered = timezone.now()                  # Set the last watered date to the current date
        self.save()                                         # Save the updated plant object

    @property                                               # Decorator to define a property
    def needs_watering(self):                               # Check if the plant needs watering
        if self.last_watered is None:                       # If the plant has never been watered
            return True                                     # Return True
        frequency_in_minutes = self.watering_frequency * 1440                       # 1440 minutes in a day
        next_watering = self.last_watered + timedelta(minutes=frequency_in_minutes) # Calculate the next watering date
        return timezone.now() >= next_watering                                      # Return True if needs watering


    def __str__(self):                                      # Defines a human-readable string representation of the object        
        return self.name                                    # Return the name of the plant as the string representation