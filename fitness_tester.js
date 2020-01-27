//import _ from "./lodash-core.js";

// Utility Functions

/**
 * Calculates a score for the passed in group based on the defined "fitness" function
 * 
 * @param {array} group The array of all the people assigned to this group
 * @returns {number} The score for this particular group
 */
function calculateScore(group) {
    return Math.abs(4 - (group.length ** 2))
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

// In VS code you can run this file with Node.JS, change this data to test different scenarios 

let slots2 = {
    1579010400000: [["Taco", "Fluff"], []],
    1578906000000: [["Puff", "Rufus"], []],
    1578920400000: [["Tuff"], []]
}

let slots1 = {
    1579010400000: [["Taco"], []],
    1578924000000: [["Fluff"], []],
    1578906000000: [["Puff"], []],
    1579003200000: [["Rufus"], []],
    1578920400000: [["Tuff"], []]
}

let score1 = checkFitness(slots1, 10)
let score2 = checkFitness(slots2, 10)

console.log(score1)
console.log(score2)