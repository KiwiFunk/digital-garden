from django.db import models                                # Import the Django database module

class Plant(models.Model):                                  # Define our model class named 'Plant'
    name = models.CharField(max_length=100)                 # Name of the plant. CharField is used to store strings
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

    def __str__(self):                                      # Defines a human-readable string representation of the object        
        return self.name                                    # Return the name of the plant as the string representation