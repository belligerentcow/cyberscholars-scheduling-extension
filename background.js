// background.js
function objToArray(obj) {
  var return_array = [];
  for (var a_prop in obj) {
    return_array.push([a_prop, obj[a_prop]]);
  }
  return return_array;
}

function generateTable(data) {
  let table = "<table><tr><th>Day/Time</th><th>Week 1</th><th>Week 2</th></tr>";
  delete data.possNumSlots;
  data = objToArray(data).sort((a, b) => a[0] - b[0]);
  for (a_time in data) {
    console.log(data[a_time][0]);
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
      console.log(data[a_time][1][a_week]);
      table += "<td>"+data[a_time][1][a_week].toString().split(',').join(', ')+"</td>";
    }
    table += "</tr>"; 
  }
  table += "</table>";
  return table;
}

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
  let data_grid = generateTable(response[0])
  console.log(data_grid);
  document.getElementById("combo").innerHTML = data_grid;
  sendResponse({farewell: "goodbye"});
});

let generate_button = document.getElementById('generateButton');
generate_button.onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
}