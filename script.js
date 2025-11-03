document.addEventListener('DOMContentLoaded', () => {
    const optCards = document.querySelectorAll('.opt-card');
    const detailBox = document.getElementById('detail-box');
    const detailText = document.getElementById('detail-text');
    const detailImage = document.getElementById('detail-image');

    // Data for the interactive Research section
    const researchData = {
        age: {
            [cite_start]text: "Optimal MFC performance was achieved with compost aged **12–18 months** (yielding 1.73 W)[cite: 21, 617]. [cite_start]While fresh compost gives a fast initial spike, aged compost supports a more sustained, long-term power generation[cite: 192].",
            image: "[Image: Compost Age Graph URL]" 
        },
        electrode: {
            [cite_start]text: "Testing showed **Carbon Cloth** was the most efficient material (0.94 W output)[cite: 617]. [cite_start]Carbon-based electrodes are chosen for their high conductivity and large surface area, maximizing electron transfer[cite: 203].",
            image: "[Image: Electrode Materials Graph URL]"
        },
        spacing: {
            [cite_start]text: "A **1 cm electrode spacing** was selected to optimize proton transfer and minimize internal resistance, significantly boosting power density[cite: 21, 617, 211].",
            image: "[Image: Electrode Spacing Graph URL]"
        },
        volume: {
            [cite_start]text: "A **1-Liter container** provided the optimal balance of material volume and surface area, resulting in the most efficient power output compared to 500mL and 2L options[cite: 21, 617].",
            image: "[Image: Container Volume Graph URL]"
        }
    };

    // Function to handle card hover/click interaction
    optCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const key = card.getAttribute('data-key');
            const data = researchData[key];

            // Update card active state
            optCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Update detail box content
            detailBox.classList.remove('initial-prompt');
            detailText.innerHTML = data.text;
            
            // Show and set image
            detailImage.src = data.image;
            detailImage.style.display = 'block';
            
            // Remove initial prompt text if present
            const prompt = detailBox.querySelector('.initial-prompt');
            if (prompt) prompt.style.display = 'none';
        });
    });

    // --- Impact Calculator Function ---
    // Average weekly compost for an average US family from the data: 4.52 lbs
    // Annual savings calculation: (Compost_Weight / 8.38) * 8 * 225.67 * 52 / 1000 * 0.1288
    // Simplified average savings rate: $128.76 / 4.52 = $28.48/lb 
    // Simplified lamps supported rate: 3.11 / 4.52 = 0.688 lamps/lb
    
    // Key Variables from the paper:
    const AVG_COMPOST_IN_MFC = 8.38; [cite_start]// Weight of compost within 1L MFC [cite: 648]
    const COMPOUNDED_WEEKS = 8; [cite_start]// Weeks before compost replacement [cite: 630]
    const WH_PER_WEEK = 225.67; [cite_start]// Wh/week per 1 person [cite: 673]
    const WEEKS_IN_YEAR = 52;
    const KWH_COST = 0.1288; [cite_start]// Cost of 1 kWh [cite: 663]
    const LW_PER_WEEK_AVG = 0.54; [cite_start]// MFCs powered / 1 week for avg US fam [cite: 678]
    const FW_PER_WEEK_AVG = 701.85; [cite_start]// Watts produced per week for avg US fam [cite: 678]
    const AVERAGE_FAMILY_COMPOST = 4.52; [cite_start]// Average weekly compost in lbs [cite: 678]

    // Calculate watts produced over 1 week (WW) for 1 LYKA lamp
    // Max Watts * seconds in a week: 1.730618 * 604800 = 1046777 Joules/week (1.04 MJ)
    
    // We will use the ratio established by the average US family data:
    const ANNUAL_SAVINGS_PER_LB_COMPOST = 28.48; // Ratio: $128.76 / 4.52 lbs
    const LAMPS_PER_LB_COMPOST = 0.688; // Ratio: 3.11 lamps / 4.52 lbs

    window.calculateImpact = function() {
        const inputElement = document.getElementById('compost-input');
        const compostLbs = parseFloat(inputElement.value);
        const outputElement = document.getElementById('savings-output');

        if (isNaN(compostLbs) || compostLbs <= 0) {
            outputElement.innerHTML = '<p style="color: red;">Please enter a valid weight in pounds.</p>';
            return;
        }

        // Calculate based on the project's derived ratios
        const annualSavings = (compostLbs * ANNUAL_SAVINGS_PER_LB_COMPOST).toFixed(2);
        const lampsSupported = (compostLbs * LAMPS_PER_LB_COMPOST).toFixed(2);

        outputElement.innerHTML = `
            <p>Estimated Annual Savings: **$${annualSavings}**</p>
            <p>LYKA Lamps Supported (Sustained at peak): **${lampsSupported}**</p>
        `;
    }

    // Set initial values on load
    document.getElementById('compost-input').value = AVERAGE_FAMILY_COMPOST;
});
