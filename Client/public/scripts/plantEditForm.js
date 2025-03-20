import { updatePlant } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const cardContainer = e.target.closest('.plant-card');                                      // Get the card container
            const form = cardContainer.querySelector('#settings-form');                                 // Get the form                 
            const plantId = button.dataset.id;                                                          // Get the plant ID from the button's data-id attribute

            try {
                const formData = {                                                                      // Get the form data and store it in an object                                    
                    name: form.querySelector('[name="name"]').value,
                    botanical_name: form.querySelector('[name="botanical_name"]').value,
                    notes: form.querySelector('[name="notes"]').value,
                    watering_frequency: form.querySelector('[name="watering_frequency"]').value,
                    base_color: form.querySelector('[name="base_color"]:checked')?.value,
                    harvest_months: Array.from(form.querySelectorAll('[name="harvest_months"]:checked'))
                        .map(checkbox => checkbox.value)
                        .join(',')
                };

                //Perform validation on fields that cannot be empty
                if (!formData.name) {   
                    throw new Error('Plant name is required');
                }

                const result = await updatePlant(plantId, formData);                                // Send the pland id and form data to the updatePlant function (in api.js)          
                
                if (result.success) {                                                               //If API call success field is true
                    // Update card with new data
                    const plant = result.plant;                                                     // Get the updated plant data from the result object from our API call                     
                    
                    // Update card background color
                    cardContainer.style.backgroundColor = plant.base_color;
                    
                    // Update plant info. Get all the fields from the DOM and update them with the new data
                    const nameElement = cardContainer.querySelector('#card-front h3');
                    const botanicalNameElement = cardContainer.querySelector('#card-front h4');
                    
                    
                    nameElement.textContent = plant.name;
                    
                    if (botanicalNameElement) {
                        botanicalNameElement.textContent = plant.botanical_name || '';
                    }

                    //CONDITIONALLY RENDERED FIELDS
                    const lowerCard = cardContainer.querySelector('.lower-card');               //Get the lower card element where our conditional fields live

                    //Handle notes 
                    let notesElement = cardContainer.querySelector('#card-front .notes');
                    if (plant.notes) {
                        if (!notesElement) {                                                    //If the notes element does not exist, create it
                            notesElement = document.createElement('div');
                            notesElement.className = 'notes';
                            lowerCard.insertBefore(notesElement, lowerCard.firstChild);         //Insert the notes element at the beginning of the lower card
                        }
                        notesElement.textContent = plant.notes;                                 //Populate the new notes element with the plant notes   
                    } else if (notesElement) {
                        notesElement.remove();                                                  //If there is no notes content, but the notes element exists, remove it           
                    }
                    
                    // Handle harvest months
                    let harvestMonthsContainer = cardContainer.querySelector('#card-front .harvest-months');
                    if (plant.harvest_months && plant.harvest_months.split(',').some(month => month.trim().length > 0)) {
                        if (!harvestMonthsContainer) {
                            // Create harvest months container if it doesn't exist
                            harvestMonthsContainer = document.createElement('div');
                            harvestMonthsContainer.className = 'harvest-months';
                            harvestMonthsContainer.innerHTML = `
                                <p><i class="fas fa-seedling"></i> Harvest Months:</p>
                                <div class="month-bars"></div>
                            `;
                            
                            lowerCard.appendChild(harvestMonthsContainer);                      //Append the harvest months container to the lower card
                        }
        
                        const monthBars = plant.harvest_months
                            .split(',')
                            .filter(month => month.trim())
                            .map(month => `
                                <span class="month-bar" title="${month.trim()}">
                                    ${month.trim()}
                                </span>
                            `).join('');
            
                        harvestMonthsContainer.querySelector('.month-bars').innerHTML = monthBars;
                        harvestMonthsContainer.style.display = monthBars ? '' : 'none';
                    } else if (harvestMonthsContainer) {
                        harvestMonthsContainer.remove();
                    }

                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Failed to update plant. Please try again.');
            }
        });
    });
});