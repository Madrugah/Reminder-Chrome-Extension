//listen for a message if a reminder expires
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        alert("REMINDER: " + msg.expiredReminder);
});