
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        alert("REMINDER: " + msg.expiredReminder);
});