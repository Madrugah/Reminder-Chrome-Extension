var reminderList = [];

window.onload = function() {
var loadedTime = Date();
    //onloading send a handshake to the background script
    chrome.runtime.sendMessage({msg: "handshake",cmd:"handshake", date: loadedTime},
        function (response) {
            console.log("sent handshake");
        });

    //now listen for the handshake to be received, should return all data stored
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.cmd == "sendAll"){
                console.log(request.allReminders.uniqKey);

                //now populate the list with all of the reminders
                reminderList = request.allReminders.uniqKey;
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
                    var newString = reminderList[i].date.split("GMT");//add part of the timestamp to the reminder
                    newElement.appendChild(document.createTextNode(" " + reminderList[i].msg + " - " + newString[0]));
                    document.getElementById("reminders").appendChild(newElement);
                }
                // for(var j = 0; j<document.getElementById("reminders").childNodes.length;j++){
                //     document.getElementById("reminders").childNodes[j].style.padding = "4px";
                // }
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
                                        console.log("deleting ");
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
        var reminderText = document.getElementById("reminder");
        reminderText.value = "Enter a Reminder:";
        console.log(newReminder);

        //if the newReminder is not empty add it to the list of reminders
        if(newReminder != "" && newReminder != "Enter a Reminder:"){
            console.log("sending message");
            var timeStamp = Date();
            chrome.runtime.sendMessage({msg: newReminder, date: timeStamp, cmd: "normal"},
                function (response) {
                    console.log("sent new reminder");
                });

            //once the new reminder has been sent, refresh the popup's reminderList
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    if (request.cmd == "refresh") {
                        //now populate the list with all of the reminders
                        reminderList = request.allReminders.uniqKey;
                    }
                });


            //add a new reminder to the list, along with a corresponding delete button
            var newElement = document.createElement("LI");
            var btn = document.createElement("BUTTON");
            btn.appendChild(document.createTextNode('X'));
            btn.id = timeStamp;


            newElement.appendChild(btn);
            var newString = timeStamp.split("GMT");//add part of the timestamp to the reminder
            newElement.appendChild(document.createTextNode(" " + newReminder + " - " + newString[0]));
            document.getElementById("reminders").appendChild(newElement);
        }
    });

    document.getElementById('reminder').addEventListener('click', function() {
        var textBox = document.getElementById('reminder');
        if(textBox.value == "Enter a Reminder:"){
            textBox.value = "";
        }
    });
});
