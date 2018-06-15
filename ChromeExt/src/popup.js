// function makeOL() {

// }

window.onload = function() {

    //onloading send a handshake to the background script
    chrome.runtime.sendMessage({msg: "handshake"},
        function (response) {
            console.log("sent handshake");
        });

    //now listen for the handshake to be received, should return all data stored
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request.allReminders.uniqKey);

            //now populate the list with all of the reminders
            var reminderList = request.allReminders.uniqKey;

            //for each reminder, create a new text node in the list
            for(var i = 0; i < reminderList.length; i++){
                var newElement = document.createElement("LI");
                newElement.appendChild(document.createTextNode(reminderList[i].msg));
                document.getElementById("reminders").appendChild(newElement);
            }

        }
    );

    //on loading populate with all the existing reminders
}


document.addEventListener('DOMContentLoaded', function() {
    //create an event listener after the DOM content has loaded to listen for when the submit button is pressed
    document.getElementById('submit').addEventListener('click', function() {

        //once the submit button is pressed, grab the value from the text field
        var newReminder = document.getElementById("reminder").value;
        var reminderText = document.getElementById("reminder");
        reminderText.innerHTML = "";
        console.log(newReminder);

        //if the newReminder is not empty add it to the list of reminders
        if(newReminder!=""){
            console.log("sending message");
            var timeStamp = Date();
            chrome.runtime.sendMessage({msg: newReminder, date: timeStamp},
                function (response) {
                    console.log("sent new reminder");
                });


            //add a new reminder to the list
            var newElement = document.createElement("LI");
            newElement.appendChild(document.createTextNode(newReminder));
            document.getElementById("reminders").appendChild(newElement);
        }
    });
});
