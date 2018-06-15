console.log("runs after page loads");
var p = document.getElementsByTagName('p');


chrome.runtime.onMessage.addListener(function(req,send,resp){
    console.log(req.txt);
    // if(req.txt == "message"){
    //     for(var i = 0; i <p.length; i++){
    //         console.log("smokepurrpp");
    //         p[i].style['background-color'] = '#FF00FF';
    //     }
    // }
});