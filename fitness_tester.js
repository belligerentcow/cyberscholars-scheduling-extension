//import _ from "./lodash-core.js";

// Utility Functions

/**
 * Calculates a score for the passed in group based on the defined "fitness" function
 * 
 * @param {array} group The array of all the people assigned to this group
 * @returns {number} The score for this particular group
 */
function calculateScore(group) {
    return Math.abs(3 - group.length)
}

// Exports

/**
 * Processes a list of time slots and returns the "fitness" score based on if it is "optimized".
 * 
 * @param {{}} weekObject The object containing each "slot" with all the groups inside.
 * @param {number} possibleNumSlot The total number of slots possible.
 * @returns {number} The total "fitness" score for this particular schedule combination.
 */
function checkFitness(weekObject, possibleNumSlot) {
    // Each slot corresponds to the same index in the timestamps (makes for a bit cleaner code)
    let slots = []
    let timestamps = []

    Object.keys(weekObject).forEach(key => {
        slots.push(weekObject[key])
        timestamps.push(new Date(key))
    })

    let score = 0

    for(let i = 0; i < slots.length; i++) {
        // Week one's groups for this slot
        score += calculateScore(slots[i][0])

        // Week two's groups for this slot
        score += calculateScore(slots[i][1])
    }

    score += Math.abs(possibleNumSlot - slots.length)

    return score
}

export default checkFitness