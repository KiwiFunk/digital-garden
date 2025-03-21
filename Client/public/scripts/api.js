const API_URL = "http://127.0.0.1:8000/api/plants/";        //Set the API URL

//Perform a GET request to retrieve all plants from the database
export async function getPlants() {                         
  const response = await fetch(API_URL);                    //Use fetch to recieve data from the API URL (default is GET)
  return response.json();                                   //Return the response as JSON
}

//Perform a POST request to add a plant to the database
export async function addPlant(data) {                      
  const response = await fetch(API_URL, {                   //Use fetch to send data to the API URL
    method: "POST",                                         //Set the method to POST (default is GET)
    headers: {                                              //Set the headers (metadata that describes the data)
      "Content-Type": "application/json",                   //Tell the server the data is in JSON format
    },
    body: JSON.stringify(data),                             //Convert the data object to JSON and send it in the body
  });
  return response.ok;                                       //Return a boolean indicating if the request was successful
}

export async function deletePlant(id) {
  try {
      const response = await fetch(`${API_URL}${id}/`, {          //Use fetch to send a DELETE request to the API URL with the plant ID
          method: "DELETE",                                       //Set the method to DELETE
      });
      return { 
          success: response.ok,       
          error: response.ok ? null : 'Failed to delete plant'  
      };
  } catch (error) {
      return { 
          success: false, 
          error: 'Network error while deleting plant'
      };
  }
}

//Send a POST request to water a plant using the water_plant() function
export async function waterPlant(id) {
  try {
      const response = await fetch(`${API_URL}${id}/`, {          //Use fetch to send a POST request to the API URL with the plant ID
          method: "POST",
          headers: {                                              //Set the headers (metadata that describes the data)              
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ "action": "water" }),            //Add the data to specify the action as "water" then convert it to JSON
      });

      if (response.ok) {                                          //If the request was successful, return the last watered date
          const data = await response.json();
          return {
              success: true,
              last_watered: data.last_watered
          };
      }
      return {
          success: false,
          error: 'Failed to water plant'
      };
  } catch (error) {
      return {
          success: false,
          error: 'Network error while watering plant'
      };
  }
}
export async function getWaterLevel(id) {
  const response = await fetch(`${API_URL}${id}/water-level/`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.water_level;
}

export async function updatePlant(id, data) {
  try {
      const response = await fetch(`${API_URL}${id}/`, {        //Use fetch to send a PUT request to the API URL with the plant ID
          method: 'PUT',                                        //Set the method to PUT
          headers: {
              'Content-Type': 'application/json',               //Set the headers (metadata that describes the data)     
          },
          body: JSON.stringify(data)                            //Convert the data object to JSON and send it in the body          
      });

      if (response.ok) {
          const updatedPlant = await response.json();           //If the request was successful, return the updated plant
          return {                                              //Return a boolean indicating if the request was successful and the updated plant
              success: true,
              plant: updatedPlant
          };
      }
      return {                                                  //If the request was not successful, return an error message and a boolean indicating the request was not successful                 
          success: false,
          error: 'Failed to update plant'
      };
  } catch (error) {                                             //If there was a network error, return an error message and a boolean indicating the request was not successful
      return {
          success: false,
          error: 'Network error while updating plant'
      };
  }
}