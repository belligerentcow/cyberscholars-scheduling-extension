function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

const responseObject = window.respondents;
const responses = Object.entries(responseObject);

console.log(responses);

var all_times = [];
var person_to_timestamp = new Object;
for (var itm in responses) {
  let current_name = responses[itm][1].name;
  person_to_timestamp[current_name] = responses[itm][1].myCanDos;
  all_times.push.apply(all_times, responses[itm][1].myCanDos);
}

all_times = uniq(all_times);

console.log(person_to_timestamp);

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

console.log(timestamp_to_person);

function objToArray(obj) {
  var return_array = [];
  for (var a_prop in obj) {
    return_array.push([a_prop, obj[a_prop]]);
  }
  return return_array;
}

sortable_person_to_timestamp = objToArray(person_to_timestamp);
sortable_person_to_timestamp.sort((a, b) => a[1].length - b[1].length);

sortable_timestamp_to_person = objToArray(timestamp_to_person);
sortable_timestamp_to_person.sort((a, b) => b[1].length - a[1].length);

console.log(sortable_person_to_timestamp);
console.log(sortable_timestamp_to_person);

var solution = new Object;
for (var a_name in sortable_person_to_timestamp) {
  for (var a_time in sortable_timestamp_to_person) {
    let current_time = sortable_timestamp_to_person[a_time][0];
    let current_name = sortable_person_to_timestamp[a_name][0];
    if (sortable_person_to_timestamp[a_name][1].includes(current_time)) {
      if (solution.hasOwnProperty(current_time)){
        solution[current_time].push(current_name);
      } else {
        solution[current_time] = [current_name];
      }
      break;
    }
  }
}

console.log(solution);