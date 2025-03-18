//Handle form submissions
import { addPlant } from './api.js';                                    //Import the POST request function from api.js

const form = document.getElementById("plant-form");                     //Get the form element by its ID

form.addEventListener("submit", async (e) => {                          //Add  event listener for form submit event
  e.preventDefault();                                                   //Prevent the default form submission (Causes page reload)

  const name = document.getElementById("name").value;                   //Get the values from our input fields
  const botanical_name = document.getElementById("botanical_name").value;                  
  const watering_frequency = document.getElementById("watering_frequency").value;
  const notes = document.getElementById("notes").value;

  // Get selected months
  const selectedMonths = Array.from(document.querySelectorAll('.month-checkbox:checked'))
  .map(checkbox => checkbox.value)
  .join(',');

  const success = await addPlant({                                      //Call the addPlant function with the form data    
    name, 
    botanical_name, 
    notes,
    harvest_months: selectedMonths, 
    watering_frequency 
  });        

  console.log('Final form data:', plantData);                          //Log the form data to the console

  if (success) {                                                        //addPlant returns a bool, use to check if the request was successful   
    alert("Plant added successfully!");                                 //Alert the user that the plant was added
    window.location.reload();                                           //Reload the page to update the plant list
  } else {
    alert("Failed to add plant. Please try again.");                    //Show alert if the request failed
  }
});
