// Initialize Firebase
var config = {
    apiKey: "AIzaSyA6pfApULYr8jENPWONDT86P0HHsVpzoZ4",
    authDomain: "train-scheduler-37b3e.firebaseapp.com",
    databaseURL: "https://train-scheduler-37b3e.firebaseio.com",
    projectId: "train-scheduler-37b3e",
    storageBucket: "train-scheduler-37b3e.appspot.com",
    messagingSenderId: "1077060055553"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var frequency = 0;


// Capture Button Click
$(document).on("click", "#add-train", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    startTime = $("#startTime-input").val().trim();


    // Code for "Setting values in the database"
    database.ref("/trains").push({
        name: name,
        destination: destination,
        frequency: frequency,
        startTime: startTime
    });

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref("trains").on("child_added", function (snapshot) {

    var tFrequency = snapshot.val().frequency;

    // Time is 3:30 AM
    var firstTime = snapshot.val().startTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    // Change the HTML to reflect

    $(".table").append(`
      <tr>
      <th scope="row">${snapshot.val().name}</th>
      <td>${snapshot.val().destination}</td>
      <td>${snapshot.val().frequency}</td>
      <td>${firstTime}</td>
      <td>${moment(nextTrain).format("hh:mm")}</td>
      <td>${tMinutesTillTrain}</td>
  </tr>
`);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});