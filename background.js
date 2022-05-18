/**
 * the medium cookies contains this properties
 */
const searchOpt = {
  name: "uid",
  storeId: "0",
  path: "/"
};
/**
 * the userId contains this value at the beginning
 */
const cookieValue = "lo_";
var status = false;

chrome.runtime.onInstalled.addListener(function() {
  // setup
  chrome.storage.local.set({ clear_cookies: true }, function() {});
  status = true;

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "query_status") {
    chrome.runtime.sendMessage({
      message: "status",
      payload: status
    });
  }
  if (request.message === "set_status") {
    chrome.storage.local.set({ clear_cookies: request.payload }, function() {});
    status = request.payload;
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.storage.local.get("clear_cookies", function(value) {
    if (value.clear_cookies) {
      status = true;
      chrome.cookies.getAll(searchOpt, function(cookies) {
        const filtered = cookies.filter(cookie =>
          cookie.value.includes(cookieValue)
        );

        filtered.forEach(cookie => {
          const cUrl = getUrlFromCookie(cookie);
          chrome.cookies.remove(
            { url: cUrl, name: cookie.name, storeId: cookie.storeId },
            function(details) {}
          );
        });
      });
    } else {
      status = false;
    }
  });
});

/**
 * transforms a domain to an url
 * @param {*} cookie
 */
function getUrlFromCookie(cookie) {
  var url = "";
  url += cookie.secure ? "https://" : "http://";
  url += cookie.domain.charAt(0) == "." ? "www" : "";
  url += cookie.domain;
  url += cookie.path;
  return url;
}
