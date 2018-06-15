console.log("background running");
var reminderArray=[];


//receive a message from the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js got a message");
        console.log(request);

        if (request.msg == "handshake") {
            //if the message is a handshake, then get all of the data and send it to the popup
            reminderArray=[];
            chrome.storage.local.get(null, function (items) {
                console.log(items.uniqKey);//items contains every single Key => value match
                for(var i=0;i<items.uniqKey.length;i++){//for each reminder push it into the reminder array

                    reminderArray.push(items.uniqKey[i]);
                }

                chrome.runtime.sendMessage({allReminders: items}, function () {
                    //send all of the reminders
                    console.log(reminderArray);
                });
            });
        } else {
            //if the message is just a new reminder, push it onto the array and sync the array with the key

            reminderArray.push(request);
            console.log("reminder Array Was:" + reminderArray);
            chrome.storage.local.set({uniqKey: reminderArray}, function () {
                console.log('ReminderArray is now: ' + reminderArray);
            });
        }
    }
);
