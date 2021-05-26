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
var thisroom = "test"
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
        chat: "Good Luck, Have Fun! :)"
    }
    $(".jButtons").prop("disabled", false)

    $(".joinName").text(joinName)
    db.ref(`Rooms/`).once("value", function(snapshot){
        if(snapshot.hasChild(joinRoom)){
            db.ref(`Rooms/${joinRoom}/player2`).set(
                userGuess2
            )
            thisroom = joinRoom
            $(".welcoming").hide()
            $(".createName").text(snapshot.child(thisroom).val().player1.Name)
            $(".second").show()
        }else{
            alert("there is no room like that")
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
    $(".second").show()

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
    callFB(thisroom)
})

function callFB(room){
db.ref(`Rooms/${room}`).once("value",function(snapshot){

    $("#cw").text(snapshot.child("player1").val().W)
    $("#cl").text(snapshot.child("player1").val().L)
    $("#ct").text(snapshot.child("player1").val().T)

    $("#jw").text(snapshot.child("player2").val().W)
    $("#jl").text(snapshot.child("player2").val().L)
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
