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

chrome.runtime.onInstalled.addListener(function() {});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.cookies.getAll(searchOpt, function(cookies) {
    const filtered = cookies.filter(cookie =>
      cookie.value.includes(cookieValue)
    );
    const res = JSON.stringify(filtered);

    filtered.forEach(cookie => {
      const cUrl = getUrlFromCookie(cookie);
      chrome.cookies.remove(
        { url: cUrl, name: cookie.name, storeId: cookie.storeId },
        function(details) {}
      );
    });

    chrome.tabs.sendMessage(tabId, {
      message: "resolved_Cookies",
      payload: res
    });
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
