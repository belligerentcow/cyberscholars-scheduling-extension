var responseObject = window.respondents;

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

function combinations(alist) {
  var names = alist;
  var combi = [];
  var temp= "";
  var letLen = Math.pow(2, names.length);

  for (var i = 0; i < letLen ; i++){
    temp = [];
    for (var j=0 ; j < names.length; j++) {
      if ((i & Math.pow(2,j))){ 
        temp.push(names[j])
      }
    }
    if (temp !== []) {
      combi.push(temp);
    }
  }
  return combi;
}

function find_diff(arr1, arr2) {
  diff = [];
  joined = arr1.concat(arr2);
  for( i = 0; i <= joined.length; i++ ) {
    current = joined[i];
    if( joined.indexOf(current) == joined.lastIndexOf(current) ) {
      diff.push(current);
    }
  }
  diff = diff.filter(el => typeof el !== 'undefined');
  return diff;
}

function areArraysEqualSets(_arr1, _arr2) {
  if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
    return false;
  var arr1 = _arr1.concat().sort();
  var arr2 = _arr2.concat().sort();
  for (var i = 0; i < arr1.length; i++) {
  if (arr1[i] !== arr2[i])
    return false;
  }
  return true;
}

const responses = Object.entries(responseObject);

var allTimes = [];
for (var workingArray in responses) {
  for (var elt in responses[workingArray][1].myCanDos) {
    allTimes.push(responses[workingArray][1].myCanDos[elt]);
  }
}

allTimes = uniq(allTimes);

name_manifest = []

wholeObject = new Object;

for (var elt in allTimes) {
  for (var workingArray in responses) {
    if (responses[workingArray][1].myCanDos.includes(allTimes[elt])) {
      if (allTimes[elt] in wholeObject) {
        wholeObject[allTimes[elt]].push(responses[workingArray][1].name);
      } else {
        wholeObject[allTimes[elt]] = [responses[workingArray][1].name];
      }
      name_manifest.push(responses[workingArray][1].name);
    }
  }
}

console.log(wholeObject);

name_manifest = uniq(name_manifest);

console.log(name_manifest);

const entries = Object.entries(wholeObject);

refactored_name_array = [];
temp_list = []

for (var elt in entries) {
  for (var particular_name in entries[elt][1]) {
    temp_list.push([entries[elt][1][particular_name], entries[elt][0]]);
  }
  refactored_name_array.push(temp_list);
  temp_list = [];
}

all_combinations = [];

for (var elt in refactored_name_array) {
  all_combinations.push(combinations(refactored_name_array[elt]));
}

var remove_extraneous_options = all_combinations.map(subarray => subarray.filter(el => el.length > 1 && el.length <= 3));
remove_extraneous_options = remove_extraneous_options.filter(el => el.length != 0);
console.log(remove_extraneous_options);

var test_name_manifest = [];

for (elt in remove_extraneous_options) {
  for (subelt in remove_extraneous_options[elt]) {
    for (subsubelt in remove_extraneous_options[elt][subelt]) {
      test_name_manifest.push(remove_extraneous_options[elt][subelt][subsubelt][0]);
    }
  }
}

test_name_manifest = uniq(test_name_manifest);
var name_diff = find_diff(test_name_manifest, name_manifest);

var name_key;

for (aname in name_diff) {
  name_key = Object.keys(wholeObject).filter(function(key) {return wholeObject[key] == name_diff[aname]})[0];
  remove_extraneous_options.push([[[name_diff[aname], name_key]]]);
}

raised_array = []

for (elt in remove_extraneous_options) {
  for (subelt in remove_extraneous_options[elt]) {
    raised_array.push(remove_extraneous_options[elt][subelt]);
  }
}

console.log(remove_extraneous_options);
console.log(raised_array);

final_combinations = combinations(raised_array);

console.log(final_combinations);

final_test_name_manifest = [];
possibilities = [];

for (combo_of_combos in final_combinations) {
  for (sub_combo in final_combinations[combo_of_combos]) {
    for (specific_elt in final_combinations[combo_of_combos][sub_combo]) {
      final_test_name_manifest.push(final_combinations[combo_of_combos][sub_combo][specific_elt][0]);
    }
  }
  if (areArraysEqualSets(name_manifest, final_test_name_manifest)) {
    possibilities.push(final_combinations[combo_of_combos]);
  }
  final_test_name_manifest = [];
}

console.log(possibilities);

/*
1. Generate all combinations of names (only 2s and 3s) for each timestamp in the format
        
    [[[name, timestamp], [name, timestamp]], [[name, timestamp], [name, timestamp]]]
  
2. Compare generated list to manifest of names and if any names are missing. If so,
  add them as a single element combination to the master list
3. Generate all the combinations of the sublists of combinations, and check to see if
  every name appears exactly once. Greenlight and save all of those sets. Discard 
  the rest.
*/