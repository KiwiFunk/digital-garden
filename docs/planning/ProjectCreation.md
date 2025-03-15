Once we have a venv set up, and a basic structure for the server and frontend, inside ther server folder we can run: (Assuming we have installed the prerequisites like Django/Astro)
```
django-admin startproject DigitalGarden .
```
`DigitalGarden` is the name of our project, and `.` ensures that the project is created in the current terminal directory, which we can navigate to the server folder with `cd server`. Remember, we can check that our venv is running by using `pip freeze` to list the currently installed python libraries. If we are in the venv, we should only see the Django libs.

We can verify this worked by running the dev server using the following command:  
```
python manage.py runserver
```
### Creating the new Django app
Now that we have a Django project initialized, we can create a new Django app where we'll handle the CRUD logic for this full-stack project We can create the app with the following command (Assuming we have the terminal pointing at our server folder):  
```
python manage.py startapp garden
```
And then we need to register this new app inside of `INSTALLED_APPS`. This section can be found inside of our `settings.py` file. We add it like so:  
```
INSTALLED_APPS = [
    ...,
    'garden',
]
```
### Creating the first database model!
Once we have our app created, we can define the structure of our data. Here is an example model for the plant which contains fields for its name, the date it was planted, it's growth stage, and any notes. We could also expand on this by adding foreign key fields for the User that created it, or fields to track when it was last watered etc.
``` python
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
```
### Applying migrations
After defining/updating a model, we need to create, and then apply the database migrations in order to update it with the new fields. Since we haven't linked an external database yet, these will be inside of the `db.sqlite3` file. The following commands will create a migration, and then apply it:  
```
python manage.py makemigrations
python manage.py migrate
```
### Adding admin functionality
Django's admin panel is a great way to visualize and manage data, ESPECIALLY during development when we dont have it hooked up to a flashy frontend yet! Let's register the model we just created inside of our `admin.py`. Now is also a great time to make a git commit with our new model! Inside our `admin.py` we can first import the model we created, and then register it:  
```
from .models import Plant

admin.site.register(Plant)
```
we will also need to create a superuser to access the admin panel! Afterall, we dont want just anyone to be able to access these features. To create a `superuser`, we can use our terminal and the following command `python manage.py createsuperuser`. Follow the on screen instructions to set a username and password, and make sure you dont add these credentials to a file that will be pushed to git!! We can then log in to our admin panel (providing the development server is still running) with the following url: `http://127.0.0.1:8000/admin/`. Have a go adding some plant data!

### Creating API Endpoints using the Django REST Framework
Now that we have a (very basic) backend set up, it's time to make our data accessible! To do this we will create an API. This allows our Astro based Frontend to communicate with the Django based Backend. Remember our waiter analogy! In brief, The frontend is our menu where the customer/user can see what is on offer, the waiter (our API) then brings this request to our kitchen(the Django backend) which prepares the request to be sent back to the customer!

First, make sure our venv is activated (We can check using `pip freeze` to see which libraries are active), then install DRF.  
```
pip install djangorestframework
```
We then need to add it to our `INSTALLED_APPS` list inside of `settings.py` just like we did with our garden app. It can be added with the name `rest_framework`.

#### Creating a serializer for the Plant Model
A serializer converts the data inside the `Plant` model we created into JSON data (and vice versa). This allows it to be handled by our Frontend.
Let's create a new file called `serializers.py` inside of our `garden` app. The following is how we can create a basic serializer in Django:  
``` py
from rest_framework import serializers
from .models import Plant

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = '__all__'  # Include all model fields in the API
```
### Creating API endpoints in views.py
We now need to define API views to handle each of our CRUD functions. POST(create), GET(Read), PUT(Update), and DELETE(Delete).

First we import our dependencies for the view. `APIView` is a base class from the Django Rest Framework that allows us to easily create views. 
`Response` is a DRF utility that sends back JSON responses to the frontend. `Status` is another DRF utility that provides predefined HTML status codes such as 200(OK), 201(Created) or 404(Not Found). We also need to import our Model, and the Serializer(translator) we created earlier to handle converting data between Python objects and JSON.  
```
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Plant
from .serializers import PlantSerializer
```
#### Defining the PlantList view
We now need to create a view to handle requests for **ALL** plants, and creating NEW plants. For this we will only need POST(Create) and GET(Read).
```
class PlantList(APIView):
    def get(self, request):
        plants = Plant.objects.all()
        serializer = PlantSerializer(plants, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PlantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```
In our `GET` request, `Plant.objects.all()` fetches all the plants from the database. `PlantSerializer(plants, many=True)` then serializes all the plant objects into JSON format. (Our Astro frontend uses Javascript, not Python). `many=True` tells DRF that we will be working with multiple objects. `return Response(serializer.data)` then returns this serialized (translated) data to our frontend.

In our POST request (Creating a new plant) `PlantSerializer(data=request.data)` Takes the incoming data from the frontend, and checks to see if it equals/matches the `Plant` models structure. We then use an if statement to perform different operations depending on if the value is truthy or falsy. If it DOES match, we use `serializer.save()` to save the new object to our database and then we return the new data and a HTTP status (201 Created).

If it did NOT match, we return a validation error, and a (400 Bad Request) HTTP status.

#### Defining the PlantDetail View
This view will handle requests for a SPECIFIC plant. For this we will need GET(Retrieval/Read), PUT(Update), and DELETE(Deletion) from our CRUD functions.
```
class PlantDetail(APIView):
    def get(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)
            serializer = PlantSerializer(plant)
            return Response(serializer.data)
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)
            serializer = PlantSerializer(plant, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            plant = Plant.objects.get(pk=pk)
            plant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Plant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
```
Let's break each HTTP request down!
1. GET request (Retrieving a specific plant):
    - Use try/except to handle exceptions
    - `Plant.objects.get(pk=pk)` Looks up an object in the databse using its primary key (pk)
    - If successful, It is Serialized (translated) to JSON and returned.
    - If the pk doesnt match any entries, a 404 status is returned.

2. PUT request (Updating a specific plant):
    - `Plant.objects.get(pk=pk)` Retrieves the plant to update
    - `PlantSerializer(plant, data=request.data)` Combines the exisiting data with the new data from the PUT request
    - if `serializer.is_valid()` is truthy, then the data is valid for the model structure, and we can save it.
    - if it is not valid, we return a 400 Bad Request status.
    - if the pk value did not match any entries, we return a 404.

3. DELETE request (Deleting a specific plant):
    - First we get the plant we want to delete
    - We then use `.delete()` to remove it from the database.
    - We then return a (204 No Content) status to indicate it has successfully been removed.
    - If there was no pk match, we return a 404.

### Creating routes for the API
Wow! that was a lot! with the HTTP Requests sorted in our views.py, we now need to tell Django which URLs should connect to which API endpoint. If we dont already have one, create a `urls.py` file INSIDE of our garden app. We can then define routes for each view. Inside `garden/urls.py` we can add the following:
```
from django.urls import path
from .views import PlantList, PlantDetail

urlpatterns = [
    path('plants/', PlantList.as_view(), name='plant-list'),      
    path('plants/<int:pk>/', PlantDetail.as_view(), name='plant-detail'),
]
```
Here we create an array containing each of our view classes. First we provide a URL Endpoint, then we use the `.as_view()` Django method to convert the class into a callable view function when the URL pattern is matched. Lastly we assign an optional name which makes it easier to call, and we can avoid hardcoding URLS in our templates. With the second one, we also provide the primary key as an integer on the end of the URL endpoint, as our HTML Responses inside of PlantDetail require it to select specific plants.  

The last thing to do is add our API routes to the main urls.py in our Django project. (All API routes should be prefaced with /api/) It should now look like this:  
```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('garden.urls')),
]
```
### Testing our API Endpoints
Congrats! That was a lot of work, but we've set up our API now! We should now be able to perform HTTP Requests between out Frontend (Web App) and our Backend (Server)! We can now run our server if it isnt already by using `python manage.py runserver` and then using a program like Postman to test each of our endpoints:  
- **GET** /api/plants/: Retrieve all plants.
- **POST** /api/plants/: Create a new plant (send JSON data).
- **GET** /api/plants/<id>/: Retrieve a specific plant.
- **PUT** /api/plants/<id>/: Update a specific plant.
- **DELETE** /api/plants/<id>/: Delete a specific plant.  

Once we have made sure each of them work, we can move on!

## Overview of creating an API
So, that was a lot huh? Let's break down what we just did to create our APIs. In Django this requires **views** and **routes**. As we are using a Javascript based frontend in this project, we also need a **serializer**. Lets go through each one in the order they use.

1. Serializers - Translators  
Serializers convert data between Python objects (Such as the `Plant` model) and JSON. As Django runs on Python, and Astro/React uses Javascript, we need the data to be 'translated' so that the frontend and backend can understand it. If our webapp was pure Django, or if we used a JavaScript based backend like Node.js, this would not be required.

2. Views.py - The Logic center.  
Views define the logic for handling HTTP Requests (CRUD Functions). They decide what do do when the frontend sends a request.
    - If the frontend sends a GET request to view the plants, the view uses the GET function to fetch the data from the database, then sends it to the serializer to translate it, before returning it to the frontend as a response.  
    - If the frontend sends a POST request to add new data, our view logic validates it, then uses the serializer to convert it to a Python Object, before saving it to the database.  

A view is like the chef in a kitchen. They take ingredients (requests, models, serializers) and turn them into a finished dish (a response).

3. Urls.py - Routes (The API Entry points)   
Django, unlike `node.js` handles routing seperately from the HTTP Request logic in `views.py`. These map specific URLs to their corresponding views. In our project so far, the URL `/api/plants/` is assigned to the logic inside our `PlantList` class in our `views.py`. Similarly, `/api/plants/<id>/` would trigger our `PlantDetail` class to handle the HTTP Request logic, where `<id>' represents the plants unique identifier/primary key.

In summary, The Front end sends a request. The route is then matched inside of `urls.py` and forwarded to the correct logic for handling the request inside `views.py`. The selected class inside `views.py` then performs the requested HTTP Response (POST/GET etc) and executes the logic inside that function. The serializer then translates the data between the languages used by the frontend and backend (JavaScript and Python).

## Working on the Frontend
with our backend created and a basic model and API made, we can start on the Frontend. First, make sure we have the Astro extension from the VSC Marketplace to make sure we can properly see the code. Then inside of `Client/src/pages/index.astro` add the following code to give us a very basic page for testing:  
``` html
---
console.log("Frontend is running!");
---
<html>
  <head>
    <title>Digital Garden</title>
    <style>
      /* Add some basic styles */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #333;
      }
      h1 {
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Your Digital Garden 🌱</h1>
    <div id="garden"></div>
  </body>
</html>
```
With a new terminal pointing to our client folder `cd client` we can then use the following command to run the astro development server: `npm run dev`

### Fetching data from the backend
This is cool and all, but how do we push past a boring old static website? We didn't go though all that work with Django for nothing! We can update our `index.astro` to look like this:  
```jsx
---
const response = await fetch("http://127.0.0.1:8000/api/plants/");
const plants = await response.json();
---
<html>
  <head>
    <title>Digital Garden</title>
    <style>
      /* Add some basic styles */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
        color: #333;
      }
      h1 {
        text-align: center;
        margin-bottom: 20px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        background: #e0ffe0;
        border: 1px solid #c0c0c0;
        border-radius: 5px;
        margin: 10px 0;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Your Digital Garden 🌱</h1>
    <ul>
      {plants.map((plant) => (
        <li>
          <strong>{plant.name}</strong> - {plant.growth_stage}
        </li>
      ))}
    </ul>
  </body>
</html>
```
So! What is going on here? We haven't used astro before so there are some things we need to wrap our head around! Astro has a section that allows us to mix server-side logic with HTML, and also uses a JSX like syntax to access model data - Something you might be familiar with from working in React.

#### The --- section
Lets start with the `---` section at the top of our file! What is this? Astro files allow you to mix **server-side** logic (JavaScript/TypeScript) with HTML. The section between the `---` marking is where you write the code you want to be run before the HTML is rendered.

This code is execured **on the server** NOT in the browser. We use this section to handle taskts like: Fetching data from APIs or databases, Defining variables or functions we might want to use in the HTML, Importing other components, styles or libraries.

#### Our server side code
`const response = await fetch("http://127.0.0.1:8000/api/plants/");`  
This line sends an HTTP GET request to our Django API endpoint (/api/plants/). 
`fetch` is a browser AND server-side function that can be used to request data from a URL. This constant will then hold the contents of our GET request.  

`const plants = await response.json();`  
we then use the `.json()` helper on our response to convert the raw HTTP response into a usable Javascript object/array. The contents of `plants` could look like this:  
```
[
  { "id": 1, "name": "Rose", "growth_stage": "Blooming" },
  { "id": 2, "name": "Tulip", "growth_stage": "Sapling" }
]
```
#### Accessing Model Data with JSX-Like syntax
Astro adopts a JSX style syntax (similar to React) for embedding dynamic content within the HTML. Lets explore how this works in a snipped from our code!  
```
<ul>
  {plants.map((plant) => (
    <li>
      <strong>{plant.name}</strong> - {plant.growth_stage}
    </li>
  ))}
</ul>
```
`{}` Curly braces allow you to inject JavaScript expressions into HTML. We could loop though an array, perform calculations, or reference variables.  
`plants.map(...)` uses the `map` function to iterate over the `plants` array (from our Django API). For each object, a `<li>` element will be created containing the `name` and `growth_stage` which are accessed using dot notation.