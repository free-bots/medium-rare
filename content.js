chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "set_status") {
    chrome.runtime.sendMessage({
      message: "set_status",
      payload: request.payload
    });
  }
  if (request.message === "query_status") {
    chrome.runtime.sendMessage({ message: "query_status" });
  }
});
