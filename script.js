document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.cycle-step');
    const activeColor = '#4caf50'; // Green

    steps.forEach(step => {
        // Highlight on Mouse Enter
        step.addEventListener('mouseenter', () => {
            step.style.backgroundColor = activeColor;
            step.style.color = 'white';
            step.style.borderColor = activeColor;
        });

        // Reset on Mouse Leave
        step.addEventListener('mouseleave', () => {
            step.style.backgroundColor = '#fff';
            step.style.color = '#1a431a';
            step.style.borderColor = '#ccc';
        });
    });
});
