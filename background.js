// background.js
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
  document.getElementById("combo").innerHTML = JSON.stringify(response[0]);
  sendResponse({farewell: "goodbye"});
});

let generate_button = document.getElementById('generateButton');
generate_button.onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
}