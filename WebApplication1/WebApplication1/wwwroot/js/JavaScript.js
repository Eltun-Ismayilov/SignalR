"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

////Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});



var connection = new signalR.HubConnectionBuilder().withUrl("/ChatHub").build();



connection.on("ReceiveMessage", function (user, message) {

    let li = `<li class="list-group-item mt-3"><h3>${user}</h3><p>${message}</p></li>`
    document.getElementById("chatList").innerHTML += li;
});

connection.start().then(function () {

    if (localStorage.getItem("user") != null) {

        show()


        let selectedGroup = JSON.parse(localStorage.getItem("user")).group;
        connection.invoke("EnterGroup", selectedGroup);

    }

}).catch(function (err) {
    return console.error(err.toString());
});



let enterUserForm = document.getElementById("enterUserForm");
let leaveBtn = document.getElementById("leaveBtn");
let messageForm = document.getElementById("messageForm");


enterUserForm.addEventListener("submit", function (e) {

    e.preventDefault();


    let username = document.getElementById("UserName").value;
    let selectedGroup = document.getElementById("selectedGroup").value;

    //Eger formdan  gelen datalar bosh deyilse;

    if (username != "" && selectedGroup != "") {

        show();

        //Obyect yaradiriqki localstorage gonderek datani json formatinda
        let user = {
            username: username,
            groupname: selectedGroup
        }
        //Front
        localStorage.setItem("user", JSON.stringify(user));
        //Back
        connection.invoke("EnterGroup", selectedGroup);
    }


});

leaveBtn.addEventListener("click", function () {

    document.getElementById("enterRow").classList.remove("d-none");
    document.getElementById("chatRol").classList.add("d-none");
    leaveBtn.classList.add("d-none");

    let group = JSON.parse(localStorage.getItem("user")).group;

    connection.invoke("LeaveGroup", group);
    localStorage.removeItem("user");

    document.getElementById("chatList").innerHTML = "";
});


messageForm.addEventListener("submit", function (e) {

    e.preventDefault();


    let message = document.getElementById("messageText").value;

    let user = JSON.parse(localStorage.getItem("user"));

    connection.invoke("SendMessage", user.groupname, user.username, message);

    document.getElementById("messageText").value = "";

});

function show() {

    document.getElementById("enterRow").classList.add("d-none");
    document.getElementById("chatRol").classList.remove("d-none");
    leaveBtn.classList.remove("d-none");
}