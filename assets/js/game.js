var firebaseConfig = {
    apiKey: "AIzaSyCGVaa529xszf5ed8Kcto9l7lZen22XiyI",
    authDomain: "project-1-b2088.firebaseapp.com",
    databaseURL: "https://project-1-b2088-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "project-1-b2088",
    storageBucket: "project-1-b2088.appspot.com",
    messagingSenderId: "239478406556",
    appId: "1:239478406556:web:c5b5dad00ee7115b535c59"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.database();

var joinName;
var userGuess2 = {
    Name: "Waiting...",
    W: 0,
    L: 0,
    T: 0,
    guess: null,
    chat: "Good Luck, Have Fun! :)"
}
var joinRoom;
var createName;
var createRoom;
var thisroom;
var player1choice;
var player2choice;


function checkJoinValues(){
    if($(".joinInput1").val().trim() && $(".joinInput2").val().trim()){
        $(".join").prop("disabled", false) 
    }else{
        $(".join").prop("disabled", true) 
    }
}

function checkCreateValues(){
    if($(".createInput1").val().trim() && $(".createInput2").val().trim()){
        $(".create").prop("disabled", false) 
    }else{
        $(".create").prop("disabled", true) 
    }
}


$(".join").on("click", function(){
    joinName = $("#joinNameVal").val()
    joinRoom = $("#joinRoomVal").val()
    console.log(joinName, joinRoom);
    userGuess2 = {
        Name: joinName,
        W: 0,
        L: 0,
        T: 0,
        guess: null,
        chat: "Player 2 connected:)"
    }
    $(".jButtons").prop("disabled", false)

    $(".joinName").text(joinName)
    db.ref(`Rooms/`).once("value")
    .then(function(snapshot){
        if(snapshot.hasChild(joinRoom) && snapshot.child(joinRoom + "/player2/Name").val() == "Waiting..."){
            db.ref(`Rooms/${joinRoom}/player2`).set(
                userGuess2
            )
            thisroom = joinRoom
            $(".welcoming").hide()
            $(".createName").text(snapshot.child(thisroom).val().player1.Name)
            $("#msgSendBtn").addClass("jSendBtn");
            runMsgRead(thisroom)
            $("#msg").html("")
            $(".second").show()
        }else{
            alert("there is no room like that or room is full")
        }
    })


})

$(".create").on("click", function(){
    createName = $("#createNameVal").val();
    createRoom = $("#createRoomVal").val();
    console.log(createName, createRoom);
    userGuess1 = {
        Name: createName,
        W: 0,
        L: 0,
        T: 0,
        guess: null,
        chat: "Good Luck, Have Fun! :)"
    }

    $(".cButtons").prop("disabled", false)

    db.ref(`Rooms/`).once("value")
    .then(function(snapshot){
        if(snapshot.child(createRoom).exists()){
            alert('Room with this name already exists ,please use another name')
        }else{

            db.ref(`Rooms/${createRoom}/player1`).set(
                userGuess1
            )
            db.ref(`Rooms/${createRoom}/player2`).set(
                userGuess2
            )

            thisroom = createRoom
            $(".welcoming").hide()
            db.ref(`Rooms/${thisroom}`).on("value",function(snapshot){
                $(".joinName").text(snapshot.val().player2.Name)
                $(".createName").text(snapshot.val().player1.Name)
            })
            $("#msgSendBtn").addClass("cSendBtn");
            runMsgRead(thisroom)
            $("#msg").html("")
            $(".second").show()
        }

})
})


$(".jButtons").on("click", function(){
    var player2Guess = $(this).attr("value")
    console.log(player2Guess);
    db.ref("Rooms/" + thisroom + "/player2").update({
        guess: player2Guess
    })
    gameBegin()

})

$(".cButtons").on("click", function(){
    var player1Guess = $(this).attr("value")
    console.log(player1Guess);
    db.ref("Rooms/" + thisroom + "/player1").update({
        guess: player1Guess
    })
    gameBegin()

})

db.ref(`Rooms/`).on("value",function(snapshot){
    if(thisroom){
    callFB(thisroom)
    }
})

function callFB(room){
    db.ref(`Rooms/${room}`).once("value", function(snapshot){

        if(snapshot.child("player1").val().W > $("#cw").text()){
            $("#msg").append(`<p class="chat">${snapshot.child("player1").val().Name} Wins</p>`)
        }

        $("#cw").text(snapshot.child("player1").val().W)
        $("#cl").text(snapshot.child("player1").val().L)
        $("#ct").text(snapshot.child("player1").val().T)
       
        if(snapshot.child("player2").val().W > $("#jw").text()){
            $("#msg").append(`<p style="color:red" class="chat">${snapshot.child("player2").val().Name} Wins</p>`)
        }
        $("#jw").text(snapshot.child("player2").val().W)
        $("#jl").text(snapshot.child("player2").val().L)
        if(snapshot.child("player2").val().T > $("#jt").text()){
            $("#msg").append(`<p class="chat">That's a tie!</p>`)
        }
        $("#jt").text(snapshot.child("player2").val().T)

        player1choice = snapshot.child("player1").val().guess
        player2choice = snapshot.child("player2").val().guess
    })
}



function tie(){
    db.ref("Rooms/"+ thisroom + "/player1").update({
        T: firebase.database.ServerValue.increment(1),
    })
    db.ref("Rooms/"+ thisroom + "/player2").update({
        T: firebase.database.ServerValue.increment(1),
    })

    db.ref("Rooms/"+ thisroom + "/player1").update({
        guess: "null"
    })
    db.ref("Rooms/"+ thisroom + "/player2").update({
      guess: "null"
    })
}

function playerOneWon(){
    db.ref("Rooms/"+ thisroom + "/player1").update({
        W: firebase.database.ServerValue.increment(1),
    })
    db.ref("Rooms/"+ thisroom + "/player2").update({
        L: firebase.database.ServerValue.increment(1),
    })

    db.ref("Rooms/"+ thisroom + "/player1").update({
        guess: "null"
    })
    db.ref("Rooms/"+ thisroom + "/player2").update({
        guess: "null"
    })
}

function playerTwoWon(){
    db.ref("Rooms/"+ thisroom + "/player2").update({
        W: firebase.database.ServerValue.increment(1),
    })
    db.ref("Rooms/"+ thisroom + "/player1").update({
        L: firebase.database.ServerValue.increment(1),
    })

    db.ref("Rooms/"+ thisroom + "/player1").update({
        guess: "null"
    })
    db.ref("Rooms/"+ thisroom + "/player2").update({
        guess: "null"
    })
}

function gameBegin(){
if (player1choice === "Rock" && player2choice === "Rock") {
    tie();
  }
  else if (player1choice === "Paper" && player2choice === "Paper") {
    tie();
  }
  else if (player1choice === "Scissors" && player2choice === "Scissors") {
    tie();
  }
  else if (player1choice === "Rock" && player2choice === "Paper") {
    playerTwoWon();
  }
  else if (player1choice === "Rock" && player2choice === "Scissors") {
    playerOneWon();
  }
  else if (player1choice === "Paper" && player2choice === "Rock") {
    playerOneWon();
  }
  else if (player1choice === "Paper" && player2choice === "Scissors") {
    playerTwoWon();
  }
  else if (player1choice === "Scissors" && player2choice === "Rock") {
    playerTwoWon();
  }
  else if (player1choice === "Scissors" && player2choice === "Paper") {
    playerOneWon();
  }
}

function runMsgRead(room){
db.ref(`Rooms/${room}/player1/chat`).on("value", function(snapshot){
    $("#msg").append(`<p class="chat">Player-1: ${snapshot.val()}</p>`)
    updateScroll()
})

db.ref(`Rooms/${room}/player2/chat`).on("value", function(snapshot){
    $("#msg").append(`<p style="color:red" class="chat">Player-2: ${snapshot.val()}</p>`)
    updateScroll()
})
}

$(document).on("click", ".jSendBtn", function(){
    var msg = $("#msgValue").val()
    db.ref("Rooms/"+ thisroom + "/player2").update({
        chat: msg
    })
    $("#msgValue").val("")
})

$(document).on("click", ".cSendBtn", function(){
    var msg = $("#msgValue").val()
    db.ref("Rooms/"+ thisroom + "/player1").update({
        chat: msg
    })
    $("#msgValue").val("")
})

function updateScroll(){
    var element = document.getElementById("msg");
    element.scrollTop = element.scrollHeight;
}


// function player1typed(room){
//     db.ref(`Rooms/${room}/player1`).once("value", function(snapshot){
//         var n = snapshot.val().Name
//         var m = snapshot.val().chat
//         $("#msg").append(`<p style="background-color:#ffffff">${n}: ${m}</p>`)
//     })
// }

// function player2typed(room){
//     db.ref(`Rooms/${room}/player2`).once("value", function(snapshot){
//         var n = snapshot.val().Name
//         var m = snapshot.val().chat
//         $("#msg").append(`<p>${n}: ${m}</p>`)
//     })
// }


