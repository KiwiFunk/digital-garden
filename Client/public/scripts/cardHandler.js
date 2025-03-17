import { deletePlant } from "./api.js";
import { waterPlant } from "./api.js";

// Use querySelectorAll to get all buttons of each type
const deleteButtons = document.querySelectorAll(".delete-button");
const waterButtons = document.querySelectorAll(".water-button");

document.addEventListener("DOMContentLoaded", () => {
    updateWaterLevels();
}
);

// Add event listener to each delete button
deleteButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
        
        const id = e.target.dataset.id;                         // Get the ID of the plant to delete
        const success = await deletePlant(id);
        
        if (success) {
            alert("Plant deleted successfully!");
            window.location.reload();
        } else {
            alert("Failed to delete plant. Please try again.");
        }
    });
});

//Add event listener to each water button
waterButtons.forEach(button => {
    button.addEventListener("click", async (e) => {

        const id = e.target.dataset.id;
        const success = await waterPlant(id);

        if (success) {
            alert("Plant watered successfully!");
            updateWaterLevels();
            window.location.reload();
        } else {
            alert("Failed to water plant. Please try again.");
        }

    });
});

function updateWaterLevels() {
    const plantCards = document.querySelectorAll('.plant-card');
    
    plantCards.forEach(card => {
        const waterIndicator = card.nextElementSibling;
        const waterLevel = waterIndicator.querySelector('.water-level');
        const level = waterLevel.dataset.level;
        
        // Update the height based on water level percentage
        waterLevel.style.height = `${level}%`;
        
        // Update color based on level
        if (level < 25) {
            waterLevel.style.backgroundColor = '#ff4444';
        } else if (level < 50) {
            waterLevel.style.backgroundColor = '#ffaa44';
        } else {
            waterLevel.style.backgroundColor = '#27b0ffc2';
        }
    });
}