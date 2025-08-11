// js/scenario.js

let gameScenarios = [];

/**
 * Loads the scenarios from the correct JSON file based on difficulty.
 * @param {string} difficulty - The selected difficulty ('easy' or 'hard').
 * @returns {Promise<void>}
 */
async function loadScenarios(difficulty) {
    // Determine which file to load
    const scenarioFile = difficulty === 'hard' ? 'data/scenarios-hard.json' : 'data/scenarios-easy.json';

    try {
        const response = await fetch(scenarioFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        gameScenarios = await response.json();
        console.log(`Scenarios loaded successfully from ${scenarioFile}`);
    } catch (error) {
        console.error("Could not load scenarios:", error);
    }
}

/**
 * Gets the scenario for a specific day.
 * @param {number} day - The current day of the game.
 * @returns {object|null} The scenario object for the day, or null if not found.
 */
function getScenarioForDay(day) {
    return gameScenarios.find(scenario => scenario.day === day) || null;
}

export { loadScenarios, getScenarioForDay };