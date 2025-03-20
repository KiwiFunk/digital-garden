import { updatePlant } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get all back buttons that will now act as submit buttons
    const backButtons = document.querySelectorAll('.back-button');

    backButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent default button behavior
            
            // Find the associated form
            const cardContainer = e.target.closest('.plant-card');
            const form = cardContainer.querySelector('#settings-form');
            const plantId = button.dataset.id;

            try {
                // Gather form data
                const formData = {
                    name: form.querySelector('[name="name"]').value,
                    botanical_name: form.querySelector('[name="botanical_name"]').value,
                    notes: form.querySelector('[name="notes"]').value,
                    watering_frequency: form.querySelector('[name="watering_frequency"]').value,
                    base_color: form.querySelector('[name="base_color"]:checked')?.value,
                    harvest_months: Array.from(form.querySelectorAll('[name="harvest_months"]:checked'))
                        .map(checkbox => checkbox.value)
                        .join(',')
                };

                // Perform Validation on form data
                if (!formData.name) {
                    throw new Error('Plant name is required');
                }

                // Send PUT request
                const response = await updatePlant(plantId, formData);
                
                if (response.ok) {
                    // Toggle card back to front
                    const cardFront = cardContainer.querySelector('#card-front');
                    const cardBack = cardContainer.querySelector('#card-back');
                    cardFront.classList.toggle('hidden');
                    cardBack.classList.toggle('hidden');
                    cardContainer.classList.toggle('settings-background');

                    // Refresh page after successful update
                    window.location.reload();
                } else {
                    throw new Error('Failed to update plant');
                }

            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Failed to update plant. Please try again.');
            }
        });
    });
});