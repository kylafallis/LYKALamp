document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Tabs Logic ---
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove('hidden');
                    content.classList.add('active');
                } else {
                    content.classList.add('hidden');
                    content.classList.remove('active');
                }
            });
            // Re-run scroll check if we switch to the impact tab
            if (targetId === 'impact') {
                checkScrollVisibility();
            }
        });
    });

    // --- 1. Interactive 3D Model Exploded View Toggler ---
    const toggleButton = document.getElementById('toggle-view');
    const videoElement = document.getElementById('exploded-view-video');
    const staticImage = document.getElementById('static-product-image');

    toggleButton.addEventListener('click', () => {
        if (videoElement.classList.contains('hidden')) {
            // Switch to Video (Exploded View)
            videoElement.classList.remove('hidden');
            staticImage.classList.add('hidden');
            videoElement.play();
            toggleButton.textContent = 'View Static Prototype';
        } else {
            // Switch to Static Image
            videoElement.classList.add('hidden');
            staticImage.classList.remove('hidden');
            videoElement.pause();
            toggleButton.textContent = 'View Exploded Render';
        }
    });


    // --- 4. Interactive "Optimal MFC" Configuration Builder ---
    const configSelects = document.querySelectorAll('.builder-controls select');
    const powerOutputSpan = document.getElementById('sim-power-output');
    const variableButtons = document.querySelectorAll('.variable-button');
    const researchImage = document.getElementById('research-image');
    const researchText = document.getElementById('research-text');

    // Data mapped to the final W average from Test 2 optimization.
    const variableValues = {
        compost: {
            '1.730618': 1.730618, // 12-18 Months
            '1.060496': 1.060496, // < 12 Months
            '0.252738': 0.252738, // > 18 Months
        },
        electrode: {
            '0.94055': 0.94055, // Carbon Cloth
            '0.78492': 0.78492, // Graphite
            '0.664991': 0.664991, // Aluminum Mesh
        },
        spacing: {
            '0.837227': 0.837227, // 1 cm
            '0.756177': 0.756177, // 3 cm
            '0.846004': 0.846004, // 5 cm
        }
    };
    
    // Default weights for initialization (Optimization: 12-18 Months, Carbon Cloth, 1 cm)
    let currentCompostWeight = 1.730618; 
    let currentElectrodeWeight = 0.94055;
    let currentSpacingWeight = 0.837227;

    const calculateSimulatedOutput = () => {
        // Simple multiplication of the relative weights, scaled to show max potential at optimal settings.
        const baseOutput = 1.73; // Target W for optimal build
        
        // This is a simplified scaling based on the individual test results
        const finalOutput = (currentCompostWeight * currentElectrodeWeight * currentSpacingWeight) / 
                            (1.730618 * 0.94055 * 0.837227) * baseOutput;

        powerOutputSpan.textContent = `Estimated Max Output: ${finalOutput.toFixed(2)} Watts`;
    };

    configSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const key = e.target.getAttribute('data-key');
            const value = parseFloat(e.target.value);

            if (key === 'compost') {
                currentCompostWeight = value;
            } else if (key === 'electrode') {
                currentElectrodeWeight = value;
            } else if (key === 'spacing') {
                currentSpacingWeight = value;
            }
            calculateSimulatedOutput();
        });
    });

    // Initialize simulation output
    calculateSimulatedOutput(); 
    
    // (Keep the existing researchData and variable button click logic for image/text updates)

    // --- 3 & 5. Dynamic Scroll-Driven Narrative & Scale Visuals ---
    const scrollSections = document.querySelectorAll('.scroll-trigger-section');
    const scaleStats = document.querySelectorAll('.scale-stat');

    const checkScrollVisibility = () => {
        const viewportHeight = window.innerHeight;
        scrollSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Show section if 30% of it is visible
            if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
                section.classList.add('visible');
                // Start number animation on visibility
                animateNumber(section.querySelector('.stat-large'));
            }
        });
        
        // Scale visuals (Always animate when impact tab is viewed)
        if (document.getElementById('impact').classList.contains('active')) {
            scaleStats.forEach(stat => animateNumber(stat));
        }
    };
    
    const animateNumber = (element) => {
        if (!element || element.hasAttribute('data-animated')) return;
        
        const finalValue = parseFloat(element.getAttribute('data-final-value'));
        const unit = element.getAttribute('data-unit') || '';
        const duration = 2000;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // For large values like 45000, use Math.floor
            const currentValue = finalValue > 1000 ? Math.floor(progress * finalValue) : (progress * finalValue).toFixed(2);
            element.textContent = unit + currentValue.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.setAttribute('data-animated', 'true');
            }
        };
        window.requestAnimationFrame(step);
    };

    // Attach scroll and tab check listeners
    window.addEventListener('scroll', checkScrollVisibility);
    checkScrollVisibility(); // Initial check on load
    
    // (Keep the existing impact calculator logic at the bottom)
    
});
