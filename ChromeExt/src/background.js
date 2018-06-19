var reminderArray = [];
var expiredArray = [];

//run a refresh every minute to check if a reminder has expired
setInterval(function() {
    reminderArray=[];
    expiredArray=[];
    chrome.storage.local.get(null, function (items) {

        for(var i=0;i<items.uniqKey.length;i++){//for each reminder push it into the reminder array
            reminderArray.push(items.uniqKey[i]);
        }

        if(items.uniqKey2 != undefined){
            for (var i = 0; i < items.uniqKey2.length; i++) {//for each expired reminder push it into the expired array
                expiredArray.push(items.uniqKey2[i]);
            }
        }

        //now sort the array
        var min;
        var tDiff;

        for(var i=0; i<reminderArray.length; i++){
            min=i;
            for(var j=i+1;j<reminderArray.length;j++){
                tDiff = (Date.parse(reminderArray[min].expireDate)-Date.parse(reminderArray[j].expireDate));
                if(tDiff>0){
                    //find the minimum value in each cycle through the array
                    min=j;
                }
            }
            //swap the minimum value with the starting indexed value
            var tmp = reminderArray[min];
            reminderArray[min] = reminderArray[i];
            reminderArray[i] = tmp;
        }

        //If a reminder's expireTime passes by, send it to the expired Array
        for(var i=0; i<reminderArray.length;i++){
            if((Date.parse(Date())-Date.parse(reminderArray[i].expireDate)) >= 0){
                //cut it out of the reminderArray and put in expiredArray and re-adjust counter
                var removedVal = reminderArray.splice(i,1);
                expiredArray.push(removedVal[0]);
                //if a reminder has expired, alert the content tab with the reminder's message
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {expiredReminder: removedVal[0].msg}, function(response) {});
                });
                i--;
            }
        }

        //and update the storage for both
        chrome.storage.local.set({uniqKey2: expiredArray}, function () {
        });
        chrome.storage.local.set({uniqKey: reminderArray}, function () {
        });

        //send all of the reminders to the popup
        chrome.runtime.sendMessage({allReminders: reminderArray, expiredReminders: expiredArray, cmd: "sendAll"}, function () {
            //send all of the reminders
        });
    });
}, 60000);

//receive a message from the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.cmd == "handshake" && request.msg == "handshake") {
            //if the message is a handshake, then get all of the data and send it to the popup
            reminderArray=[];
            expiredArray=[];
            chrome.storage.local.get(null, function (items) {

                for(var i=0;i<items.uniqKey.length;i++){//for each reminder push it into the reminder array
                    reminderArray.push(items.uniqKey[i]);
                }

                if(items.uniqKey2 != undefined){
                    for (var i = 0; i < items.uniqKey2.length; i++) {//for each expired reminder push it into the expired array
                        expiredArray.push(items.uniqKey2[i]);
                    }
                }

                //now sort the array
                var min;
                var tDiff;

                for(var i=0; i<reminderArray.length; i++){
                    min=i;
                    for(var j=i+1;j<reminderArray.length;j++){
                        tDiff = (Date.parse(reminderArray[min].expireDate)-Date.parse(reminderArray[j].expireDate));
                        if(tDiff>0){
                            //find the minimum value in each cycle through the array
                            min=j;
                        }
                    }
                    //swap the minimum value with the starting indexed value
                    var tmp = reminderArray[min];
                    reminderArray[min] = reminderArray[i];
                    reminderArray[i] = tmp;
                }

                //If a reminder's expireTime passes by, send it to the expired Array
                for(var i=0; i<reminderArray.length;i++){
                    if((Date.parse(Date())-Date.parse(reminderArray[i].expireDate)) >= 0){
                        //cut it out of the reminderArray and put in expiredArray and re-adjust counter
                        var removedVal = reminderArray.splice(i,1);
                        expiredArray.push(removedVal[0]);
                        i--;
                    }
                }

                //and update the storage for both
                chrome.storage.local.set({uniqKey2: expiredArray}, function () {

                });
                chrome.storage.local.set({uniqKey: reminderArray}, function () {

                });

                //send all of the reminders to the popup
                chrome.runtime.sendMessage({allReminders: reminderArray, expiredReminders: expiredArray, cmd: "sendAll"}, function () {
                    //send all of the reminders
                });
            });
        }
        if(request.cmd == "delete"){
            //if the message is a delete, take the newList from the message and replace the old array with the new one
            reminderArray = request.newList;
            //replace the array in storage with the new one
            chrome.storage.local.set({uniqKey: reminderArray}, function () {
            });
        }
        if(request.cmd == "deleteExp"){
            //if the message is a delete, take the newList from the message and replace the old array with the new one
            expiredArray = request.newExpiredList;
            //replace the array in storage with the new one
            chrome.storage.local.set({uniqKey2: expiredArray}, function () {

            });
        }
        if(request.cmd == "dismissAll"){
            //if the message is a delete, take the newList from the message and replace the old array with the new one
            expiredArray = [];
            //replace the array in storage with the new one
            chrome.storage.local.set({uniqKey2: expiredArray}, function () {

            });
        }
        if(request.cmd == "normal"){
            //if the message is just a new reminder, push it onto the array and sync the array with the key
            reminderArray.push(request);

            //sort the array based on expireddates
            var min;
            var tDiff;
            for(var i=0; i<reminderArray.length; i++){
                min=i;
                for(var j=i+1;j<reminderArray.length;j++){
                    tDiff = (Date.parse(reminderArray[min].expireDate)-Date.parse(reminderArray[j].expireDate));
                    if(tDiff>0){
                        //find the minimum value in each cycle through the array
                        min=j;
                    }
                }
                //swap the minimum value with the starting indexed value
                var tmp = reminderArray[min];
                reminderArray[min] = reminderArray[i];
                reminderArray[i] = tmp;
            }

            chrome.storage.local.set({uniqKey: reminderArray}, function () {
            });

            reminderArray=[];
            chrome.storage.local.get(null, function (items) {
                for(var i=0;i<items.uniqKey.length;i++){//for each reminder push it into the reminder array
                    reminderArray.push(items.uniqKey[i]);
                }

                chrome.runtime.sendMessage({allReminders: items,cmd: "refresh"}, function () {
                    //send all of the reminders and tell the popup to refresh
                });
            });
        }
    }
);

