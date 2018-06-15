console.log("runs after page loads");
var p = document.getElementsByTagName('p');


chrome.runtime.onMessage.addListener(function(req,send,resp){
    console.log(req.txt);

});