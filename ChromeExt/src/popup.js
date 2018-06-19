var reminderList = [];
var expiredList = [];

window.onload = function() {
    var loadedTime = Date();

    //onloading send a handshake to the background script
    chrome.runtime.sendMessage({msg: "handshake",cmd:"handshake", date: loadedTime},
        function (response) {
        });

    //now listen for the handshake to be received, should return all data stored
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.cmd == "sendAll"){
                //clear both lists first
                while (document.getElementById("reminders").firstChild) {
                    document.getElementById("reminders").removeChild(document.getElementById("reminders").firstChild);
                }
                while (document.getElementById("expRems").firstChild) {
                    document.getElementById("expRems").removeChild(document.getElementById("expRems").firstChild);
                }

                //now populate the list with all of the reminders
                reminderList = request.allReminders;
                expiredList = request.expiredReminders;

                var btn;
                //for each reminder, create a new text node in the list
                for (var i = 0; i < reminderList.length; i++) {
                    var newElement = document.createElement("LI");

                    //also create a new delete button, one for each reminder
                    btn = document.createElement("BUTTON");
                    btn.appendChild(document.createTextNode('X'));

                    //set the new button id = to the reminder's unique timestamp
                    btn.id = reminderList[i].date;

                    //let the button be a child of the new reminder
                    newElement.appendChild(btn);
                    var newString = reminderList[i].expireDate.split("GMT");//add part of the timestamp to the reminder
                    newElement.appendChild(document.createTextNode(" " + reminderList[i].msg + " [Expires @]: " + newString[0]));
                    document.getElementById("reminders").appendChild(newElement);
                }

                var btn2;
                //for each reminder, create a new text node in the list
                if(expiredList.length>0) {
                    for (var i = 0; i < expiredList.length; i++) {
                        var newElement = document.createElement("LI");

                        //also create a new delete button, one for each reminder
                        btn2 = document.createElement("BUTTON");
                        btn2.appendChild(document.createTextNode('X'));

                        //set the new button id = to the reminder's unique timestamp
                        btn2.id = expiredList[i].date;

                        //let the button be a child of the new expired reminder
                        newElement.appendChild(btn2);
                        var newString = expiredList[i].expireDate.split("GMT");//add part of the timestamp to the reminder
                        newElement.appendChild(document.createTextNode(" " + expiredList[i].msg + " [Expired @]: " + newString[0]));
                        document.getElementById("expRems").appendChild(newElement);
                    }
                }

                //set a click event listener for the reminder List
                document.getElementById("reminders").addEventListener("click", function (e) {
                    //if the target is one of the buttons, delete that child of the reminder List
                    if (e.target && (e.target.nodeName == "BUTTON" || e.target.nodeName == "I")) {
                        for(var i = 0; i < reminderList.length; i++){
                            if(reminderList[i].date == e.target.id){
                                //remove the selected reminder from the reminderList and update the storage and list
                                reminderList.splice(i,1);
                                document.getElementById("reminders").removeChild(document.getElementById("reminders").childNodes[i]);

                                //tell the background script to update the storage with the modified list
                                chrome.runtime.sendMessage({newList: reminderList, cmd:"delete"},
                                    function (response) {
                                    });

                            }
                        }
                    }
                });

                //set a click event listener for the expired list
                document.getElementById("expRems").addEventListener("click", function (e) {
                    //if the target is one of the buttons, delete that child of the reminder List
                    if (e.target && (e.target.nodeName == "BUTTON" || e.target.nodeName == "I")) {
                        for(var i = 0; i < expiredList.length; i++){
                            if(expiredList[i].date == e.target.id){
                                //remove the selected reminder from the reminderList and update the storage and list
                                expiredList.splice(i,1);
                                document.getElementById("expRems").removeChild(document.getElementById("expRems").childNodes[i]);

                                //tell the background script to update the storage with the modified list
                                chrome.runtime.sendMessage({newExpiredList: expiredList, cmd:"deleteExp"},
                                    function (response) {
                                    });

                            }
                        }
                    }
                });
            }
        }
    );
}

document.addEventListener('DOMContentLoaded', function() {
    //create an event listener after the DOM content has loaded to listen for when the submit button is pressed
    document.getElementById('submit').addEventListener('click', function() {

        //once the submit button is pressed, grab the value from the text field and reset the value
        var newReminder = document.getElementById("reminder").value;
        var expirationTime = document.getElementById("expireTime").value;
        var expDateStr = String(new Date(expirationTime));
        var timeStamp = Date();
        var timeDifference = Date.parse(timeStamp)-Date.parse(expDateStr);
        //get the time that the user wants the reminder to be set for an find out if it is in the future

        //ensure no fields are left invalid
        if(newReminder == "" && expirationTime == ""){
            alert("Enter a Note and a DateTime!");
        }else{
            if(newReminder == ""){
                alert("Enter a Note!");
            }
            if(expirationTime == ""){
                alert("Enter a DateTime!");
            }
            if(timeDifference >= 0){
                alert("Plan a Reminder for the Future!");
            }
        }
        //if the newReminder is not empty add it to the list of reminders
        if(newReminder != "" && expirationTime != "" && timeDifference < 0){
            document.getElementById("reminder").value = "";
            document.getElementById("expireTime").value = "";

            //send the reminder to the background
            chrome.runtime.sendMessage({msg: newReminder, date: timeStamp, expireDate: expDateStr, cmd: "normal"},
                function (response) {
                });

            //once the new reminder has been sent, refresh the popup's reminderList
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    if (request.cmd == "refresh") {
                        //now populate the list with all of the reminders
                        reminderList = request.allReminders.uniqKey;
                        while (document.getElementById("reminders").firstChild) {
                            document.getElementById("reminders").removeChild(document.getElementById("reminders").firstChild);
                        }
                        var btn;
                        //for each reminder, create a new text node in the list

                        for (var i = 0; i < reminderList.length; i++) {
                            var newElement = document.createElement("LI");

                            //also create a new delete button, one for each reminder
                            btn = document.createElement("BUTTON");
                            btn.appendChild(document.createTextNode('X'));

                            //set the new button id = to the reminder's unique timestamp
                            btn.id = reminderList[i].date;

                            //let the button be a child of the new reminder
                            newElement.appendChild(btn);
                            var newString = reminderList[i].expireDate.split("GMT");//add part of the timestamp to the reminder
                            newElement.appendChild(document.createTextNode(" " + reminderList[i].msg + " [Expires @]: " + newString[0]));
                            document.getElementById("reminders").appendChild(newElement);
                        }
                    }
                });


        }
    });

    //event for clicking the dismiss all expired reminders button
    document.getElementById('dismiss').addEventListener('click', function() {
        chrome.runtime.sendMessage({cmd: "dismissAll"},
            function (response) {
                //clear the expired list
                while (document.getElementById("expRems").firstChild) {
                    document.getElementById("expRems").removeChild(document.getElementById("expRems").firstChild);
                }
            });
    });
});
