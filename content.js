// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      function injectScript(file, node) {
        var th = document.getElementsByTagName(node)[0];
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        th.appendChild(s);
      }
      // Run `scrape_and_analyze.js` which is the meat and potatoes of this operation
      injectScript(chrome.extension.getURL('scrape_and_analyze.js'), 'body');
    }
  }
);

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window) return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
  }

  chrome.runtime.sendMessage(event.data.text, function(response) {
    console.log(response.farewell);
  });  
});