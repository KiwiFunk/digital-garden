import { deletePlant } from "./api.js";
import { waterPlant } from "./api.js";
import { getWaterLevel } from './api.js';

// Use querySelectorAll to get all buttons of each type
const deleteButtons = document.querySelectorAll(".delete-button");
const waterButtons = document.querySelectorAll(".water-button");
const editButtons = document.querySelectorAll(".edit-button");
const backButtons = document.querySelectorAll(".back-button");

document.addEventListener("DOMContentLoaded", () => {
    updateWaterLevels();

    // Update water levels every minute (60000ms)
    setInterval(updateWaterLevels, 60000);
}
);

// Add event listener to each edit button to open card settings pane
editButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const id = e.target.closest('.edit-button').dataset.id;
        const cardContainer = e.target.closest('.plant-card');
        const cardFront = cardContainer.querySelector('#card-front');
        const cardBack = cardContainer.querySelector('#card-back');

        cardFront.classList.toggle('hidden');
        cardBack.classList.toggle('hidden');
        cardContainer.classList.toggle('settings-background');
    });
});

// Add event listener to each back button
backButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const id = e.target.closest('.back-button').dataset.id;
        const cardContainer = e.target.closest('.plant-card');
        const cardFront = cardContainer.querySelector('#card-front');
        const cardBack = cardContainer.querySelector('#card-back');

        cardFront.classList.toggle('hidden');
        cardBack.classList.toggle('hidden');
        cardContainer.classList.toggle('settings-background');
    });
});

// Add event listener to each delete button
deleteButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;                                     //Get the ID of the plant to delete
        const card = e.target.closest('.plant-card');                       //Get the card element to remove       
        
        const result = await deletePlant(id);                               //Call the deletePlant function from api.js with the plant ID
        
        if (result.success) {                                               //If the request was successful remove the card from the DOM
            // Add transition styles temporarily
            card.style.transition = 'opacity 0.1s, transform 0.1s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            
            // Remove card after animation
            setTimeout(() => {
                card.remove();
            }, 100);
        } else {
            alert(result.error);
        }
    });
});

//Add event listener to each water button
waterButtons.forEach(button => {
    button.addEventListener("click", async (e) => {

        const id = e.target.dataset.id;
        const card = e.target.closest('.plant-card');                           // Get the card element to update the last watered date
        const result = await waterPlant(id);

        if (result.success) {
            updateWaterLevels();                                                //Update the water levels after watering the plant
            const wateringInfo = card.querySelector('.watering-info');          //Get the watering info element and update the DOM content with new last watered date
            wateringInfo.innerHTML = `                                              
                <i class="fas fa-clock"></i>
                Last watered: ${new Date(result.last_watered).toLocaleDateString()}
            `;
        } else {
            alert(result.error || "Failed to water plant. Please try again.");
        }

    });
});

async function updateWaterLevels() {
    const waterLevels = document.querySelectorAll('.water-level');
    
    for (const waterLevel of waterLevels) {
        const id = waterLevel.dataset.id;
        const level = await getWaterLevel(id);
        
        if (level !== null) {
            // Update the data attribute
            waterLevel.dataset.waterlevel = level;
            
            // Update the visual height
            waterLevel.style.height = `${level}%`;
            
            // Update color based on level
            if (level < 25) {
                waterLevel.style.backgroundColor = '#ff4444';
            } else if (level < 50) {
                waterLevel.style.backgroundColor = '#ffaa44';
            } else {
                waterLevel.style.backgroundColor = '#27b0ffc2';
            }
        }
    }
}