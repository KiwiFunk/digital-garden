const API_URL = "http://127.0.0.1:8000/api/plants/";        //Set the API URL

//Perform a GET request to retrieve all plants from the database
export async function getPlants() {                         
  const response = await fetch(API_URL);                    //Use fetch to make a GET request to the API URL
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
