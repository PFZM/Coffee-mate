const welcomeBtnEl = document.querySelector("#welcome-btn");
const aboutSectionEl = document.querySelector(".about-section");
const formPreferencesEl = document.querySelector("#form-section");
const formBtnEl = document.querySelector("#form-btn");
const mainDisplayEl = document.querySelector("#main");
const userNameEl = document.querySelector("#username");
const signEl = document.querySelector("#sign");
const userLocationEl = document.querySelector("#location");
const userMusicEl = document.querySelector("#user-music");
const headerEl = document.querySelector("#header");
const headerTitleEl = document.querySelector("#header-h1");
const preferenceBtnEl = document.querySelector("#preferences");
const displayTimeAndWeather = document.querySelector("#display-weather-time");
const signReadingEl = document.querySelector("#sign-reading");

// User enters and see a welcome header and the about section

welcomeBtnEl.addEventListener("click", displayForm);
formBtnEl.addEventListener("click", getFormValues);

function getUserPreferences() {
  return JSON.parse(localStorage.getItem("user")) || [];
}

function setUserPreferences(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function init() {
  //Check if there is information in the localstorage if not display about section
  const user = getUserPreferences();
  if (user.length !== 0) {
    displayMainSection(user);
  }
  return;
}

//when user clicks the button display form appears and display section goes away
function displayForm() {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "form-container";
}

// function musicOptions() {
//   userMusicEl.addEventListener("click", function (event) {
//     event.preventDefault();
//     const userSelection = event.target;

//     if (userSelection.matches("button") === true) {
//       const userMusic = userSelection.getAttribute("value");
//       console.log(userMusic);
//       return userMusic;
//     }
//   });
// }

function getFormValues() {
  const user = {
    name: userNameEl.value,
    sign: signEl.value,
    location: userLocationEl.value,
    // music: musicOptions(),
  };

  setUserPreferences(user);

  displayMainSection(user);

  console.log(user);  
}

function displayMainSection(user) {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "hide";
  mainDisplayEl.className = "main-display";

  // Header display
  headerTitleEl.textContent =
    " Welcome " + user.name + ", enjoy your coffe mate!";

  preferenceBtnEl.classList = "btn";

  const currentDate = document.createElement("h2");
  currentDate.textContent = moment().format("dddd, DD-MMM-YYYY, hh:mm");
  displayTimeAndWeather.appendChild(currentDate);

  retrieveWeather(user);
  retrieveSign(user);

  // const weather = data.main.temp;
  console.log(user);
}

// User star sign
function retrieveSign(user) {
  const queryUrl = 
  "https://aztro.sameerkumar.website?day=today&sign=" + 
  user.sign;

  fetch(queryUrl, {
    method: "POST"
  })
  .then(function (response){
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } 
    return response.json();
  })
  .then (function (data){
    displaySign(data);
  })
  .catch(function (error) {
    console.log("Unable to retrieve sign");
  });
} 

function displaySign(data) {
  const signReading = document.createElement("p");
  signReading.textContent = data.description;
  signReadingEl.appendChild(signReading);
}


function retrieveWeather(user) {
  const APIKey = "fc1547c6c6eac0f4c70827baceb61b94";
  const queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    user.location +
    "&units=metric" +
    "&appid=" +
    APIKey;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
        return;
      }
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}

function displayWeather(data) {
  const temperature = document.createElement("p");
  temperature.textContent = "Temperature: " + data.main.temp + " °C";
  displayTimeAndWeather.appendChild(temperature);
}
//Form section: user fill the form and then information is storage in localstorage

//then main display is shown

/*fetch(
  "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=-37.0201&lon=144.9646",
  {
    method: "GET",
    headers: {
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
      "x-rapidapi-key": "18b41c1c7bmsheb630e6f2195bcfp1e66f6jsn0071376690aa",
    },
  }
)
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.error(err);
  });*/
init();
