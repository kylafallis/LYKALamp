document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Tabs Logic ---
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // 1. Update Active Nav Button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Switch Tab Content
            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove('hidden');
                    content.classList.add('active');
                } else {
                    content.classList.add('hidden');
                    content.classList.remove('active');
                }
            });
        });
    });

    // --- Research Tab Interaction Logic ---
    const variableButtons = document.querySelectorAll('.variable-button');
    const researchPanel = document.getElementById('research');
    const researchImage = document.getElementById('research-image');
    const researchText = document.getElementById('research-text');

    // Data for the interactive Research section
    const researchData = {
        age: {
            text: "Optimal MFC performance was achieved with compost aged **12–18 months** (peaking at **1.73 W**). This sustained output, unlike the rapid decline of fresh compost, informed our material selection for long-term viability. ",
            image: ""
        },
        electrode: {
            text: "Comparative testing validated **Carbon Cloth** (0.94 W output) as the most effective electrode material due to superior conductivity and surface area for microbial electron transfer, proving critical to efficiency.",
            image: "PXL_20251019_170046139.MP.jpg" // Close-up of carbon cloth
        },
        spacing: {
            text: "The final **1 cm electrode spacing** was selected to optimize proton transfer and minimize internal resistance. This distance, integrated into the 3D-printed structure, significantly boosts power density.",
            image: "PXL_20251019_170041054.MP.jpg" // Pink 3D-printed MFC/Electrode structures 
        },
        volume: {
            text: "Testing multiple designs confirmed the **1-Liter container** provided the optimal material volume to maximize average power output (0.84 W) while maintaining a compact, household-friendly size.",
            image: "PXL_20251019_170104754.MP.jpg" // Lamp body separated, showing interior volume 
        }
    };

    // Initial state setup for the Research tab
    // We start by displaying the 'age' data on load
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

    // --- Impact Calculator Logic (V2) ---
    const calculateButton = document.getElementById('calculate-button');
    const compostInput = document.getElementById('compost-input');
    const savingsOutput = document.getElementById('savings-output');
    
    // Ratios based on Avg US Family (4.52 lbs weekly compost = $128.76 savings / 3.11 lamps)
    const ANNUAL_SAVINGS_PER_LB_COMPOST = 128.76 / 4.52; // ~$28.48/lb
    const LAMPS_PER_LB_COMPOST = 3.11 / 4.52; // ~0.688 lamps/lb

    const calculateImpact = function() {
        const compostLbs = parseFloat(compostInput.value);

        if (isNaN(compostLbs) || compostLbs <= 0) {
            savingsOutput.innerHTML = '<span style="color: #ffb86c;">Please enter a valid weight.</span>';
            return;
        }

        const annualSavings = (compostLbs * ANNUAL_SAVINGS_PER_LB_COMPOST).toFixed(2);
        const lampsSupported = (compostLbs * LAMPS_PER_LB_COMPOST).toFixed(2);

        savingsOutput.innerHTML = `
            <span class="calc-result">Savings: **$${annualSavings}**/year</span> | 
            <span class="calc-result">Lamps Supported: **${lampsSupported}**</span>
        `;
    }

    calculateButton.addEventListener('click', calculateImpact);
    
    // Run calculation on load for default value
    calculateImpact();
});
