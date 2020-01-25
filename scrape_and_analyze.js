// Utility Functions

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
 * Converts an object into a nested array
 * 
 * @param {object} obj The object to be passed in
 * @returns {array} An array in the form [[key, value] ...]
 */
function objToArray(obj) {
  var return_array = [];
  for (var a_prop in obj) {
    return_array.push([a_prop, obj[a_prop]]);
  }
  return return_array;
}

// Main functions
/**
 * Generates the first solution possible based on step 2 of the algorithm
 * 
 * @returns {object} A rough solution
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
  sortable_person_to_timestamp.sort((a, b) => a[1].length - b[1].length);
  sortable_timestamp_to_person = objToArray(timestamp_to_person);
  sortable_timestamp_to_person.sort((a, b) => b[1].length - a[1].length);

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
  return solution;
}