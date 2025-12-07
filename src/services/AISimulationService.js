// src/services/AISimulationService.js

const CORE_SPECS = {
    "Turbocharger": { maxLife: 5, warrantyBase: 24 },
    "Alternator": { maxLife: 7, warrantyBase: 36 },
    "ECU Module": { maxLife: 10, warrantyBase: 48 },
    "Starter Motor": { maxLife: 6, warrantyBase: 24 },
    "Transmission": { maxLife: 12, warrantyBase: 60 },
};

// These steps run in the dashboard "console" to mimic real-time processing
export const generateAnalysisSteps = () => [
    "Initializing Neural Network (v4.2)...",
    "Segmenting Image Regions...",
    "Analyzing Surface Texture...",
    "Detecting Structural Anomalies...",
    "Comparing against OEM Tolerance...",
    "Calculating Fatigue & Stress...",
    "Finalizing Predictive Score..."
];

export const analyzeCore = async (imageSrc, coreType) => {
    return new Promise((resolve) => {
        // SIMULATED COMPUTER VISION DELAY
        setTimeout(() => {
            let detectedDefects = [];
            let isCritical = false;

            // --- DETERMINISTIC LOGIC (Simulating CV Recognition) ---
            // We check the filename/source to simulate "seeing" the defect.

            const srcString = String(imageSrc).toLowerCase();

            if (srcString.includes('startermotor')) {
                // SCENARIO: Broken Starter -> Critical Fail
                detectedDefects.push({ name: "Housing Crack (Critical)", severity: "High", lifePenalty: 6.0 });
                detectedDefects.push({ name: "Mounting Flange Damage", severity: "High", lifePenalty: 2.0 });
                isCritical = true;
            }
            else if (srcString.includes('transmission')) {
                // SCENARIO: Worn Transmission -> Critical Fail
                detectedDefects.push({ name: "Gear Teeth Shear", severity: "High", lifePenalty: 8.0 });
                detectedDefects.push({ name: "Metal Contamination", severity: "Medium", lifePenalty: 3.0 });
                isCritical = true;
            }
            else if (srcString.includes('heavyduty') || srcString.includes('alternator')) {
                // SCENARIO: Used Alternator -> Pass but Worn
                detectedDefects.push({ name: "Carbon Brush Wear", severity: "Medium", lifePenalty: 2.5 });
                detectedDefects.push({ name: "Surface Oxidation", severity: "Low", lifePenalty: 0.5 });
            }
            else if (srcString.includes('turbo')) {
                // SCENARIO: Clean Turbo -> Pass
                detectedDefects.push({ name: "None", severity: "None", lifePenalty: 0 });
            }
            else if (srcString.includes('ecu')) {
                // SCENARIO: Clean ECU -> Pass
                detectedDefects.push({ name: "None", severity: "None", lifePenalty: 0 });
            }
            else {
                // FALLBACK (For Camera/Unknown uploads) -> Random weighting
                const randomDefect = Math.random() > 0.5; // 50/50 chance for unknown images
                if (randomDefect) {
                    detectedDefects.push({ name: "Unknown Surface Wear", severity: "Medium", lifePenalty: 2.0 });
                } else {
                    detectedDefects.push({ name: "None", severity: "None", lifePenalty: 0 });
                }
            }

            // --- CALCULATION LOGIC ---
            const specs = CORE_SPECS[coreType] || CORE_SPECS["Turbocharger"];
            const totalPenalty = detectedDefects.reduce((acc, d) => acc + d.lifePenalty, 0);

            let predictedLife = Math.max(0, specs.maxLife - totalPenalty);
            predictedLife = Math.round(predictedLife * 10) / 10;

            // Logic: If critical defect or life < 30% of max -> SALVAGE
            let status = "Pass";
            let warrantyMonths = specs.warrantyBase;

            if (isCritical || predictedLife < (specs.maxLife * 0.3)) {
                status = "Salvage"; // FAULT
                warrantyMonths = 0; // No warranty for salvage
            } else if (predictedLife < (specs.maxLife * 0.7)) {
                warrantyMonths = 6; // Reduced warranty
            }

            // Return the Final Report
            resolve({
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                coreType,
                defects: detectedDefects,
                predictedLifeYears: predictedLife,
                warrantyMonths: warrantyMonths,
                confidence: isCritical ? "99.8%" : "96.5%", // Higher confidence on obvious cracks
                status: status
            });

        }, 1500); // 1.5 second "Processing" wait
    });
};