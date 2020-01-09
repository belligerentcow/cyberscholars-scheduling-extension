var responseObject = window.respondents;

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

const responses = Object.entries(responseObject);

var allTimes = [];
for (var workingArray in responses) {
  for (var elt in responses[workingArray][1].myCanDos) {
    allTimes.push(responses[workingArray][1].myCanDos[elt]);
  }
}

allTimes = uniq(allTimes);

var finalForm = new Object();

for (var elt in allTimes) {
  for (var workingArray in responses) {
    if (responses[workingArray][1].myCanDos.includes(allTimes[elt])) {
      if (allTimes[elt] in finalForm) {
        finalForm[allTimes[elt]].push(responses[workingArray][1].name);
      } else {
        finalForm[allTimes[elt]] = [responses[workingArray][1].name];
      }
    }
  }
}

console.log(finalForm);