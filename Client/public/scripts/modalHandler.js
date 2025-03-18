document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('addPlantModal');
    const addButton = document.querySelector('.add-plant-button');
    const closeButton = modal.querySelector('.close-button');

    // Open modal when add button is clicked
    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});