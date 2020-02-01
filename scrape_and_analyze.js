// MAIN FUNCTION
function main() {
  const RANDOMNESS = 100; // the larger this is, the higher likelyhood of a great answer, but the longer it will take

  let best_solution = [{},{},0];
  for (i=0; i < RANDOMNESS; i++) {
    let temp_solution = rerunRefine();
    if (temp_solution[2] > best_solution[2]) {
      best_solution = temp_solution.slice(0);
    }
  }
  return best_solution;
}

// UTILITY FUNCTIONS

/**
 * Creates an array of unique values
 * 
 * @param {array} a The base array from which final array is produced
 * @returns {array} `a` but without any duplicates
 */
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

/**
 * Randomly shuffle an array
 * 
 * @param  {Array} array The array to shuffle
 * @return {Array} The shuffled array 
 */
function shuffle(array) {
	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

/**
 * Checks recursively if a multidimensional array is empty
 * 
 * @param {*} arr The array to be checked
 * @returns {boolean}
 */
function isEmpty(arr) {
  return Array.isArray(arr) && (arr.length == 0 || arr.every(isEmpty));
}

/**
 * Determines if a value exists in a multidimensional array.
 * 
 * @param {array} arr The multidimensional array.
 * @param {string} elt The value to search for.
 * @returns {boolean} 
 */
function exists(arr, elt) {
  return arr.some(row => row.includes(elt));
}

/**
 * Converts an object into a nested array
 * 
 * @param {{}} obj The object to be passed in
 * @returns {array} An array in the form [[key, value] ...]
 */
function objToArray(obj) {
  var return_array = [];
  for (var a_prop in obj) {
    return_array.push([a_prop, obj[a_prop]]);
  }
  return return_array;
}

/**
 * Flatten and stringify a multidimensional array, and replace all commas with semicolons (for CSV interpretation)
 * 
 * @param {array} arr The array to be processed
 * @returns A flattened and stringified array
 */
function flattenAndStringify(arr) {
  let merged = [].concat.apply([], arr);
  let stringified = merged.toString();
  return stringified.split(",").join(";");
}

// SCORING MECHANICS

// Utility Functions
/**
 * Calculates the "bonus" score points to be added if the group is slotted in the afternoon
 * 
 * @param {Date} timestamp The Date object representing the timestamp for this slot
 * @returns {number} The additional "bonus" points this group gets because of it's time slot 
 */
function calcuateTimeScore(timestamp) {
  const MORE_AFTERNOON = 3; // bonus for time being the afternoon

  let score = 0;
  
  if (timestamp.getUTCHours() >= 11) {
    score += MORE_AFTERNOON;
  }

  return score;
}

/**
* Calculates a score for the passed in group based on the defined "fitness" function
* 
* @param {string[]} slot The timeslot with two groups, one for each week
* @param {Date} timestamp The Date object that represents the time slot for this group
* @returns {number} The score for this particular group
*/
function calculateScore(slot, timestamp) {
  const MORE_IN_WEEK1 = 4; // weight toward having someone in the week 1 slot
  const MORE_IN_WEEK2 = 6; // weight toward having someone in the week 2 slot
  const BOTH_WEEKS_EQUAL = 6; // bonus for both weeks having the same amount of people  

  let score = 0

  // Score the first group
  if (slot[0].length > 0) {
      score += MORE_IN_WEEK1 - (slot.length ** 2)
      score += calcuateTimeScore(timestamp)
  }

  // Score the second group, and reward those groups with this second week utilized
  if (slot[1].length > 0) {
      score += MORE_IN_WEEK2 - (slot.length ** 2)
      score += calcuateTimeScore(timestamp)
  }

  if (slot[0].length == slot[1].length) {
    score += BOTH_WEEKS_EQUAL;
  }

  return score
}

/**
* Processes a list of time slots and returns the "fitness" score based on if it is "optimized".
* 
* @param {Object} weekObject The object containing each "slot" with all the groups inside.
* @param {Number} weekObject.possibleNumSlot The total number of slots possible.
* @returns {number} The total "fitness" score for this particular schedule combination.
*/
function checkFitness(weekObject) {
  const FEWER_WEEKS = 20; // weight toward fewer timeslots overall

  // Each slot corresponds to the same index in the timestamps (makes for a bit cleaner code)
  let slots = []
  let timestamps = []

  let possibleNumSlot = weekObject.possNumSlots;
  delete weekObject.possNumSlots;

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

  score += FEWER_WEEKS*(possibleNumSlot - slots.length)

  return score
}

// MAIN FUNCTIONS

/**
 * Generates the first solution possible based on step 2 of the algorithm
 * 
 * @returns {array} A rough solution object, the person:timestamp array, and the timestamp:person array
 */
function generateRoughSolution() {
  // Grab the data from the webpage
  const responses = Object.entries(window.respondents);

  // Generate person:timestamp and timestamp:person objects
  var all_times = [];
  var person_to_timestamp = new Object;
  for (var itm in responses) {
    let current_name = responses[itm][1].name;
    person_to_timestamp[current_name] = responses[itm][1].myCanDos;
    all_times.push.apply(all_times, responses[itm][1].myCanDos);
  }

  all_times = uniq(all_times);

  var timestamp_to_person = new Object;

  for (var time in all_times) {
    for (var itm in responses) {
      let current_time = all_times[time];
      let current_availability = responses[itm][1].myCanDos;
      let current_name = responses[itm][1].name;

      if (current_availability.includes(current_time)) {
        if (timestamp_to_person.hasOwnProperty(current_time)){
          timestamp_to_person[current_time].push(current_name);
        } else {
          timestamp_to_person[current_time] = [current_name];
        }
      }
    }
  }
  // End object generation

  // Convert objects to arrays and sort them based on step 1 of the algorithm
  sortable_person_to_timestamp = objToArray(person_to_timestamp);
  sortable_person_to_timestamp = shuffle(sortable_person_to_timestamp);
  sortable_timestamp_to_person = objToArray(timestamp_to_person);
  sortable_timestamp_to_person = shuffle(sortable_timestamp_to_person);

  // Generate rough solution
  var solution = new Object;
  solution.possNumSlots = all_times.length;
  for (var a_name in sortable_person_to_timestamp) {
    for (var a_time in sortable_timestamp_to_person) {
      let current_time = sortable_timestamp_to_person[a_time][0];
      let current_name = sortable_person_to_timestamp[a_name][0];
      if (sortable_person_to_timestamp[a_name][1].includes(current_time)) {
        if (solution.hasOwnProperty(current_time)){
          solution[current_time][0].push(current_name);
        } else {
          solution[current_time] = [[current_name], []];
        }
        break;
      }
    }
  }
  return [solution, person_to_timestamp];
}

/**
 * Using the fitness checker, swaps elements into better positions
 * 
 * @param {array} solution_and_other_info An array of the form [solution, person_to_timestamp object]
 * @returns {array} An array that includes [refined solution, person_to_timestamp, score]
 */
function refineSolution(solution_and_other_info) {
  var solution = solution_and_other_info[0];
  var person_to_timestamp = solution_and_other_info[1];
  var num_poss_slots = solution.possNumSlots;
  var best_fitness = checkFitness(solution);

  for (var a_person in person_to_timestamp) {
    var time_list = person_to_timestamp[a_person].slice(0);
    for (var a_time in time_list) {
      new_slot = time_list.shift();
      for (week = 0; week < 2; week++) {
        let new_temp_solution = swapSlot(solution, a_person, [new_slot, week]);
        new_temp_solution.possNumSlots = num_poss_slots;
        var score = checkFitness(new_temp_solution);
        if (score > best_fitness) {
          best_fitness = score;
          solution = new_temp_solution;
        }
      }
    }
  }
  solution.possNumSlots = num_poss_slots;
  return [solution, person_to_timestamp, score];
}

/**
 * Loops through refineSolution until max score is reached based on heuristic
 * 
 * @returns The final solution object
 */
function rerunRefine() {
  let final_solution = generateRoughSolution();
  let counter = 0;
  while (true) {
    temp_final = final_solution.slice(0);
    final_solution = refineSolution(final_solution);
    if ((temp_final[2]/final_solution[2]) > .95) {
      counter++;
      if (counter == 10) {
        break;
      }
    } else {
      counter = 0;
    }
  }
  return final_solution
}

// SWAPPING FUNCTIONS

/**
* Swaps an element to a different slot in the solution
* 
* @param {{}} solution The current solution to be altered.
* @param {string} element The element that needs to change position
* @param {array} new_slot An array of the form [timestamp, |0 or 1 depending on which subweek|] that specifies the new position
* @returns {{}} The altered solution.
*/
function swapSlot(solution, element, new_slot) {
  let temp_solution = removeEltFromSolution(solution, element);

  if (!temp_solution.hasOwnProperty(new_slot[0])) {
    temp_solution[new_slot[0]] = [[],[]];
  }

  temp_solution[new_slot[0]][new_slot[1]].push(element);

  for (elt in temp_solution) {
    if (isEmpty(temp_solution[elt])) {
      delete temp_solution[elt];
    }
  }

  return temp_solution;
}

/**
* Removes a specific element from the solution
* 
* @param {{}} solution The current solution to be altered.
* @param {string} element The element that needs to be removed.
* @returns {{}} The altered solution.
*/
function removeEltFromSolution(solution, element) {
  let elt_pos = findElt(solution, element);
  let temp_solution = JSON.parse(JSON.stringify(solution));
  temp_solution[elt_pos[0]][elt_pos[1]].splice(elt_pos[2], 1);
  return temp_solution;
}

/**
* Finds the coordinates for a specific element in the solution
* 
* @param {{}} solution The current solution to be altered.
* @param {string} element The element that needs to be found.
* @returns {array} An array of the form [timestamp, |0 or 1 depending on which subweek|, subindex of elt] that specifies location
*/
function findElt(solution, element) {
  let key = Object.keys(solution).filter(function(key) {
    if (solution[key] instanceof Array) {
      return exists(solution[key], element);
    }
  })[0];

  let week = 0;

  for (var a_week in solution[key]) {
    if (solution[key][a_week].includes(element)) {
      week = a_week;
      elt_index = solution[key][week].indexOf(element);
    }
  }

  return [key, week, elt_index];
}

// CSV FUNCTION

/**
 * Converts the final solution to a CSV and prompts the user to download it
 * 
 * @param {{}} solution A final solution object.
 */
function convertToCSV(solution) {
  let rows = [
    ["Day/Time", "Week 1", "Week 2"]
  ];
  delete solution.possNumSlots;
  solution = objToArray(solution);
  solution = solution.sort((a, b) => a[0] - b[0]);

  var last_day_of_week = "";

  for (var slot in solution) {
    let date_time = new Date(Number(solution[slot][0]));
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let day_of_week = days[date_time.getDay()];
    let hour = date_time.getUTCHours();
    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    let minutes = date_time.getUTCMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;

    if (day_of_week == last_day_of_week) {
      rows.push([hour + ":" + minutes + ampm, flattenAndStringify(solution[slot][1][0]), flattenAndStringify(solution[slot][1][1])]);
    } else {
      rows.push([day_of_week + " " + hour + ":" + minutes + ampm, flattenAndStringify(solution[slot][1][0]), flattenAndStringify(solution[slot][1][1])]);
    }
    last_day_of_week = day_of_week;
  }

  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  return encodedUri;
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "meeting_schedule.csv");
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file
}

// MAIN:
window.postMessage({ type: "FROM_PAGE", text: main() }, "*");

// test_obj1 = {
//   possNumSlots: 10,
//   1579010400000: [["person1", "person2", "person3", "person4", "person5"], []]
// };
// test_obj2 = {
//   possNumSlots: 10,
//   1579010400000: [["person1"], []],
//   1578924000000: [["person2"], []],
//   1578906000000: [["person3"], []],
//   1579003200000: [["person4"], []],
//   1578920400000: [["person5"], []]
// };
// test_obj3 = {
//   possNumSlots: 10,
//   1579010400000: [["person1", "person2"], []],
//   1578906000000: [["person3", "person4"], []],
//   1578920400000: [["person5"], []]
// };
// test_obj4 = {
//   possNumSlots: 10,
//   1579010400000: [["person1", "person2"], ["person3"]],
//   1578906000000: [["person4"], ["person5"]]
// };
// test_obj5 = {
//   possNumSlots: 10,
//   1579010400000: [["person1", "person2"], ["person3"]],
//   1579003200000: [["person4"], ["person5"]]
// };