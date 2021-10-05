const welcomeBtnEl = document.querySelector("#welcome-btn");
const aboutSectionEl = document.querySelector(".about-section");
const formPreferencesEl = document.querySelector("#form-section");
const formFieldsEl = document.querySelector("#form");
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
const userActivityEl = document.querySelector("#user-activity");
const cancelBtnEl = document.querySelector("#cancel-btn");
const iframeSong = document.querySelector("#iframe-song");
const signReadingEl = document.querySelector("#sign-reading");
var activityBox = document.getElementById("activity-otd");


// Event listeners of the application
welcomeBtnEl.addEventListener("click", displayForm);
formBtnEl.addEventListener("click", getFormValues);
preferenceBtnEl.addEventListener("click", displayForm);
cancelBtnEl.addEventListener("click", function () {
  const user = getUserPreferences();
  displayMainSection(user);
});

const userFavGenres = [];
userMusicEl.addEventListener("click", function (event) {
  const userSelection = event.target;

  if (userSelection.matches("button") === true) {
    const userMusic = userSelection.getAttribute("value");
    userFavGenres.push(userMusic);
    console.log(userFavGenres);
  }
});

const userFavActivity = [];
userActivityEl.addEventListener("click", function (event) {
  const userActSelect = event.target;

  if (userActSelect.matches("button") === true) {
    const userActivity = userActSelect.getAttribute("value");
    userFavActivity.push(userActivity);
    console.log(userFavActivity);
  }
});

// line 53 - 60: functions to set and get the information from localstorage
function getUserPreferences() {
  return JSON.parse(localStorage.getItem("user")) || [];
}

function setUserPreferences(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

//Check if there is the user information in local storage, if not => go to about section if yes => go to main display
function init() {
  const user = getUserPreferences();
  if (user.length !== 0) {
    displayMainSection(user);
  }
  return;
}

//When user clicks the button display form appears and about section goes away
function displayForm() {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "form-container";
  mainDisplayEl.className = "hide";

  // Display button when click preferences button
  const user = getUserPreferences();
  if (user.length !== 0) {
    cancelBtnEl.className = "btn";
  } else {
    cancelBtnEl.className = "hide";
  }
}

//After submit form button click, get the form values and assign to user.
function getFormValues() {
  const user = {
    name: userNameEl.value,
    sign: signEl.value,
    location: userLocationEl.value,
    music: userFavGenres,
    activity: userFavActivity,
  };

  // validation that user filled all form fields
  if (
    !user.name &&
    !user.sign &&
    !user.location &&
    !user.music &&
    !user.activity
  ) {
    window.alert("Plaese fill in all the fields");
    return;
  }

  localStorage.removeItem(user);

  setUserPreferences(user);

  displayMainSection(user);
}

function displayMainSection(user) {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "hide";
  mainDisplayEl.className = "main-display";

  // Header display
  headerTitleEl.textContent =
    " Welcome " + user.name + "! Enjoy your coffee, mate!";

  preferenceBtnEl.classList = "btn";

  // Retrieve weather and display
  retrieveWeather(user);
  retrieveSongOfTheDay(user);
  retrieveSign(user);
  displayJoke();
  getActivity();

  // displayPicture();
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
  displayTimeAndWeather.innerHTML = "";

  const currentDate = document.createElement("h2");
  currentDate.textContent = moment().format("dddd, DD-MMM-YYYY, hh:mm");
  displayTimeAndWeather.appendChild(currentDate);

  const cityAndCountry = document.createElement("h2");
  cityAndCountry.textContent = data.name + " - " + data.sys.country;
  displayTimeAndWeather.appendChild(cityAndCountry);

  const iconWeatherUrl =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  const iconWeather = document.createElement("img");
  iconWeather.src = iconWeatherUrl;
  displayTimeAndWeather.appendChild(iconWeather);

  const temperature = document.createElement("p");
  temperature.textContent = "Temperature: " + data.main.temp + " °C";
  displayTimeAndWeather.appendChild(temperature);
}

function retrieveSongOfTheDay(user) {
  const APIKeyYoutube = "AIzaSyBc58mT_-8rn6_TGyrZRhizEdMAXVqiRJQ";
  const rockPlayList = "PLNxOe-buLm6cz8UQ-hyG1nm3RTNBUBv3K";
  const classicPlayList = "PL2788304DC59DBEB4";
  const funkPlayList = "PL7IyjolaORJ1kM2JEO4s9VGp4CUJZu5Gr";
  const latinPlayList = "PLkqz3S84Tw-QoDzNr9VvMXxUTQ7TkANO_";

  console.log(user.music);

  const MusicQueryURL =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLNxOe-buLm6cz8UQ-hyG1nm3RTNBUBv3K&maxResults=25&key=AIzaSyBc58mT_-8rn6_TGyrZRhizEdMAXVqiRJQ";

  https: fetch(MusicQueryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
        return;
      }
      return response.json();
    })
    .then(function (dataSong) {
      console.log(dataSong);
      displaySongOfTheDay(dataSong);
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}

function displaySongOfTheDay(dataSong) {
  iframeSong.src = "https://www.youtube.com/embed/6SFNW5F8K9Y";
}

// User starsign
function retrieveSign(user) {
  const queryUrl =
    "https://aztro.sameerkumar.website?day=today&sign=" + user.sign;

  fetch(queryUrl, {
    method: "POST",
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      displaySign(data);
    })
    .catch(function (error) {
      console.log("Unable to retrieve sign");
    });
}

function displaySign(data) {
  signReadingEl.innerHTML = "";
  const signReading = document.createElement("p");
  signReading.textContent = data.description;
  signReadingEl.appendChild(signReading);
}

function displayJoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?type=twopart&lang=en&blacklistFlags=nsfw,racist,sexist,explicit&safe-mode")
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
        return;
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const jokePart1 = document.createElement("h2");
      const jokePart2 = document.createElement("p");

      jokePart1.textContent = "Joke of the day:" + "  " + data.setup;
      jokePart2.textContent = data.delivery;
      console.log(data.setup);
      console.log(data.delivery);

      mainDisplayEl.appendChild(jokePart1);
      mainDisplayEl.appendChild(jokePart2);
    })
    .catch(function (error) {
      alert("Data not retrievable");
    });
}

//Activity of the day//

//userFavActivity will need to be altered so that multiple options can be selected//
function getActivity() {
  //randomising activity from array created by buttons//
     // var randomActivity = userFavActivity[Math.floor(Math.random() * userFavActivity.length)];
      console.log(userFavActivity);

  var activityURL = "http://www.boredapi.com/api/activity?key=5881028";
               //  "http://www.boredapi.com/api/activity?type=" + randomActivity;

  fetch(activityURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
        return;
      }
      return response.json();
    })
    .then(function (data) {
          var activityContent = document.createElement("p");

          activityContent.textContent = data.activity ;
          console.log(activityContent);
          activityBox.appendChild(activityContent);
    })
    .catch(function (error) {
      alert("Data not retrievable");
    });
}


//change text size for activity box title
var activityBoxText = document.getElementsByClassName(".maindisplay-content");
activityBoxText.setAttribute("style", "font-size: 25px; font-weight: bold");

init();
