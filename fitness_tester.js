//import _ from "./lodash-core.js";

// Utility Functions
/**
 * Calculates the "bonus" score points to be added if the group is slotted in the afternoon
 * 
 * @param {Date} timestamp The Date object representing the timestamp for this slot
 * @returns {number} The additional "bonus" points this group gets because of it's time slot 
 */
function calcuateTimeScore(timestamp) {
    let score = 0

    if (timestamp.getHours() >= 13) {
        score += 2
    }

    return score
}

/**
 * Calculates a score for the passed in group based on the defined "fitness" function
 * 
 * @param {string[]} slot The timeslot with two groups, one for each week
 * @param {Date} timestamp The Date object that represents the time slot for this group
 * @returns {number} The score for this particular group
 */
function calculateScore(slot, timestamp) {
    let score = 0

    // Score the first group
    if (slot[0].length > 0) {
        score += Math.abs(4 - (slot.length ** 2))
        score += calcuateTimeScore(timestamp)
    }

    // Score the second group, and reward those groups with this second week utilized
    if (slot[1].length > 0) {
        score += Math.abs(4 - (slot.length ** 2))
        score += calcuateTimeScore(timestamp)
        
        // Extra points for using this second week slot
        score += 2
    }

    return score
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

        // Convert to Date object (allows us to properly handle timezones without funky math)
        let date = new Date(Number(key))

        timestamps.push(date)
    })

    let score = 0

    for(let i = 0; i < slots.length; i++) {
        // Week one's groups for this slot
        score += calculateScore(slots[i], timestamps[i])
    }

    score += Math.abs(possibleNumSlot - slots.length)

    return score
}

export default checkFitness = checkFitness

// In VS code you can run this file with Node.JS, change this data to test different scenarios 

let slots1 = {
    1580147531000: [["Taco", "Fluff"], ["Puff"]],
    1580143931000: [["Rufus"], ["Tuff"]]
}

let slots2 = {
    1579010400000: [["Taco", "Fluff"], []],
    1578906000000: [["Puff", "Rufus"], []],
    1578920400000: [["Tuff"], []]
}

let score1 = checkFitness(slots1, 10)
let score2 = checkFitness(slots2, 10)

console.log(score1)
console.log(score2)