// background.js
function objToArray(obj) {
  var return_array = [];
  for (var a_prop in obj) {
    return_array.push([a_prop, obj[a_prop]]);
  }
  return return_array;
}

function generateTable(orig_data) {
  let table = "<table><tr><th>Day/Time</th><th>Week 1</th><th>Week 2</th></tr>";
  let data = JSON.parse(JSON.stringify(orig_data));
  delete data.possNumSlots;
  data = objToArray(data).sort((a, b) => a[0] - b[0]);
  for (a_time in data) {
    let date_time = new Date(Number(data[a_time][0]));
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let day_of_week = days[date_time.getDay()];
    let hour = date_time.getUTCHours();
    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    let minutes = date_time.getUTCMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let readable_time = day_of_week + " " + hour + ":" + minutes + " " + ampm;
    table += "<tr><td>"+readable_time+"</td>";
    for (a_week in data[a_time]) {
      table += "<td>"+data[a_time][1][a_week].toString().split(',').join(', ')+"</td>";
    }
    table += "</tr>"; 
  }
  table += "</table>";
  return table;
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
  return stringified.split(",").join("; ");
}

function convertToCSV(solution) {
  let rows = [
    ["Day/Time", "Week 1", "Week 2"]
  ];
  delete solution.possNumSlots;
  solution = objToArray(solution);
  solution = solution.sort((a, b) => a[0] - b[0]);
  console.log(solution);
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
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "meeting_schedule.csv");
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file
}

var current_solution = null;

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
  current_solution = response[0];
  let tabled = generateTable(response[0])
  document.getElementById("combo").innerHTML = tabled;
  sendResponse({farewell: "goodbye"});
});

let generate_button = document.getElementById('generateButton');
generate_button.onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
}

let export_button = document.getElementById('exportButton');
export_button.onclick = function() {
  convertToCSV(current_solution);
}