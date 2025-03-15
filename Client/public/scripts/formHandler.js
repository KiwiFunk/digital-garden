//Handle form submissions
import { addPlant } from './api.js';                                    //Import the POST request function from api.js

const form = document.getElementById("plant-form");                     //Get the form element by its ID

form.addEventListener("submit", async (e) => {                          //Add  event listener for form submit event
  e.preventDefault();                                                   //Prevent the default form submission (Causes page reload)

  const name = document.getElementById("name").value;                   //Get the values from our input fields
  const growth_stage = document.getElementById("growth_stage").value;
  const notes = document.getElementById("notes").value;

  const success = await addPlant({ name, growth_stage, notes });        //Call addPlant and pass the form data as an object

  if (success) {                                                        //addPlant returns a bool, use to check if the request was successful   
    alert("Plant added successfully!");                                 //Alert the user that the plant was added
    window.location.reload();                                           //Reload the page to update the plant list
  } else {
    alert("Failed to add plant. Please try again.");                    //Show alert if the request failed
  }
});
