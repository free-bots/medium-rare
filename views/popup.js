var statusToggle = document.getElementById("statusToggle");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "status") {
    //statusToggle.checked = request.payload;
    if (request.payload === "true") {
      statusToggle.checked = true;
    } else {
      statusToggle.checked = false;
    }
  }
});
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {
    message: "query_status"
  });
});
statusToggle.onchange = function(e) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: "set_status",
      payload: statusToggle.checked
    });
  });
};
