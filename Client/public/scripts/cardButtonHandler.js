import { deletePlant } from "./api.js";

// Use querySelectorAll to get all buttons of each type
const deleteButtons = document.querySelectorAll(".delete-button");
const waterButtons = document.querySelectorAll(".water-button");

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