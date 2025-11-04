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

    // --- Research Tab Image/Text Data (Used by the variable buttons) ---
    const variableButtons = document.querySelectorAll('.variable-button');
    const researchImage = document.getElementById('research-image');
    const researchText = document.getElementById('research-text');

    const researchData = {
        age: {
            [cite_start]text: "Optimal MFC performance was achieved with compost aged **12–18 months** (peaking at **1.73 W**). This sustained output, unlike the rapid decline of fresh compost, informed our material selection for long-term viability. (Figure 3 below shows the performance over time) [cite: 122, 718]",
            // Placeholder: Use URL of the Compost Age chart
            image: "" 
        },
        electrode: {
            [cite_start]text: "Comparative testing validated **Carbon Cloth** (0.94 W output) as the most effective electrode material due to superior conductivity and surface area for microbial electron transfer, proving critical to efficiency. [cite: 122, 718]",
            // Image: Close-up of carbon cloth
            image: "PXL_20251019_170046139.MP.jpg" 
        },
        spacing: {
            text: "The final **1 cm electrode spacing** was selected to optimize proton transfer and minimize internal resistance. [cite_start]This distance, integrated into the 3D-printed structure, significantly boosts power density. [cite: 122, 718]",
            // Image: Pink 3D-printed MFC/Electrode structures 
            image: "PXL_20251019_170041054.MP.jpg" 
        },
        volume: {
            [cite_start]text: "Testing multiple designs confirmed the **1-Liter container** provided the optimal material volume to maximize average power output (0.84 W) while maintaining a compact, household-friendly size. [cite: 122, 718]",
            // Image: Lamp body separated, showing interior volume 
            image: "PXL_20251019_170104754.MP.jpg" 
        }
    };

    // Initial state setup for the Research tab
    const initialKey = 'age';
    if (researchData[initialKey]) {
        researchImage.src = researchData[initialKey].image;
        researchText.innerHTML = researchData[initialKey].text;
        document.querySelector(`.variable-button[data-key="${initialKey}"]`).classList.add('active-var');
    }

    variableButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');
            const data = researchData[key];

            // Update active button state
            variableButtons.forEach(btn => btn.classList.remove('active-var'));
            button.classList.add('active-var');

            // Update display panel
            researchImage.src = data.image;
            researchText.innerHTML = data.text;
        });
    });
    
    // --- 4. Interactive "Optimal MFC" Configuration Builder ---
    const configSelects = document.querySelectorAll('.builder-controls select');
    const powerOutputSpan = document.getElementById('sim-power-output');
    
    // Default weights for initialization (Optimization: 12-18 Months, Carbon Cloth, 1 cm)
    let currentCompostWeight = 1.730618; 
    let currentElectrodeWeight = 0.94055;
    let currentSpacingWeight = 0.837227;
    
    // Optimal factors multiplied together for the scaling factor
    const OPTIMAL_PRODUCT = 1.730618 * 0.94055 * 0.837227; 
    const MAX_BASE_OUTPUT = 1.73; // Target W for optimal build

    const calculateSimulatedOutput = () => {
        
        // Final output calculation based on current variable selections
        const finalOutput = (currentCompostWeight * currentElectrodeWeight * currentSpacingWeight) / 
                            OPTIMAL_PRODUCT * MAX_BASE_OUTPUT;

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
        
        // Scale visuals (Animate when the impact tab is viewed and scrolled to)
        if (document.getElementById('impact').classList.contains('active')) {
             if (window.scrollY > document.getElementById('co2-offset').offsetTop) {
                scaleStats.forEach(stat => animateNumber(stat));
             }
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
            let currentValue;
            if (finalValue > 1000) {
                 currentValue = Math.floor(progress * finalValue);
            } else if (finalValue < 100) {
                currentValue = (progress * finalValue).toFixed(2);
            } else {
                 currentValue = Math.floor(progress * finalValue);
            }
            
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
    
    // --- Impact Calculator Logic ---
    const calculateButton = document.getElementById('calculate-button');
    const compostInput = document.getElementById('compost-input');
    const savingsOutput = document.getElementById('savings-output');
    
    const ANNUAL_SAVINGS_PER_LB_COMPOST = 128.76 / 4.52; 
    const LAMPS_PER_LB_COMPOST = 3.11 / 4.52; 

    const calculateImpact = function() {
        const compostLbs = parseFloat(compostInput.value);

        if (isNaN(compostLbs) || compostLbs <= 0) {
            savingsOutput.innerHTML = '<span class="calc-result" style="color: #ffb86c;">Please enter a valid weight.</span>';
            return;
        }

        const annualSavings = (compostLbs * ANNUAL_SAVINGS_PER_LB_COMPOST).toFixed(2);
        const lampsSupported = (compostLbs * LAMPS_PER_LB_COMPOST).toFixed(2);

        savingsOutput.innerHTML = `
            <span class="calc-result">Savings: $${annualSavings} / year</span> | 
            <span class="calc-result">Lamps Supported: ${lampsSupported}</span>
        `;
    }

    calculateButton.addEventListener('click', calculateImpact);
    
    // Run calculation on load for default value
    calculateImpact();
});
