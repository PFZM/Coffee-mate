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
const resetBtnEl = document.querySelector("#reset-btn");
const iframeSong = document.querySelector("#iframe-song");
const signReadingEl = document.querySelector("#sign-reading");
const activityOfTheDatEl = document.querySelector("#activity");
const jokeOneEl = document.querySelector("#joke-1");
const jokeTwoEl = document.querySelector("#joke-2");

// Event listeners of the application
welcomeBtnEl.addEventListener("click", displayForm);
formBtnEl.addEventListener("click", getFormValues);
preferenceBtnEl.addEventListener("click", displayForm);
cancelBtnEl.addEventListener("click", function () {
  const user = getUserPreferences();
  displayMainSection(user);
});
resetBtnEl.addEventListener("click", function () {
  localStorage.removeItem("user");
  window.location.reload();
});

// Event delegation for music selection buttons
let userFavGenres;
userMusicEl.addEventListener("click", function (event) {
  const userSelection = event.target;
  removeClassOn("#user-music>button", "form-btn-selected");

  if (userSelection.matches("button") === true) {
    userFavGenres = userSelection.getAttribute("value");
    event.target.classList.add("form-btn-selected");
  }
});

// Event delegation for activities selection buttons
let userFavActivity;
userActivityEl.addEventListener("click", function (event) {
  const userActSelect = event.target;
  removeClassOn("#user-activity>button", "form-btn-selected");

  if (userActSelect.matches("button") === true) {
    userFavActivity = userActSelect.getAttribute("value");
    event.target.classList.add("form-btn-selected");
  }
});

// Generic function to remove classes on selected elements
function removeClassOn(cssSelector, cssClass) {
  const elements = document.querySelectorAll(cssSelector);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.classList.remove(cssClass);
  }
}

//Functions to set and get the information from localstorage
function getUserPreferences() {
  return JSON.parse(localStorage.getItem("user")) || {};
}

function setUserPreferences(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

//Check if there is the user information in local storage, if not => go to about section if yes => go to main display
function init() {
  const user = getUserPreferences();
  if (Object.keys(user).length !== 0) {
    displayMainSection(user);
  }
  return;
}

//When user clicks the button display form appears and about section goes away
function displayForm() {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "form-container";
  mainDisplayEl.className = "hide";

  // Display cxl button when click 'change - preferences' button
  const user = getUserPreferences();
  if (Object.keys(user).length !== 0) {
    cancelBtnEl.className = "btn";
    resetBtnEl.className = "btn";
    userNameEl.value = user.name;
    signEl.value = user.sign;
    userLocationEl.value = user.location;

    const musicButton = targetMusicButtonByValue(user.music);
    musicButton?.classList.add("form-btn-selected");

    const activityButton = targetActiviyButtonByValue(user.activity);
    activityButton?.classList.add("form-btn-selected");
  } else {
    cancelBtnEl.className = "hide";
    resetBtnEl.className = "hide";
  }
}

function targetMusicButtonByValue(music) {
  const musicGenres = document.querySelectorAll("#user-music>button");

  for (let i = 0; i < musicGenres.length; i++) {
    const element = musicGenres[i];
    if (element.textContent.toLowerCase() === music.toLowerCase()) {
      return element;
    }
  }
}

function targetActiviyButtonByValue(activity) {
  const activityTypes = document.querySelectorAll("#user-activity>button");

  for (let i = 0; i < activityTypes.length; i++) {
    const element = activityTypes[i];
    if (element.textContent.toLowerCase() === activity.toLowerCase()) {
      return element;
    }
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
    !user.name ||
    !user.sign ||
    !user.location ||
    !user.music ||
    !user.activity
  ) {
    window.alert("Plaese fill in all the fields");
    return;
  }

  setUserPreferences(user);

  displayMainSection(user);
}

// Add and remove Hide class to Main section function
function displayMainSection(user) {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "hide";
  mainDisplayEl.className = "main-display";

  // Header display
  headerTitleEl.textContent =
    " Welcome " + user.name + "! Enjoy your coffee, mate!";

  preferenceBtnEl.classList = "btnPref";

  retrieveWeather(user);

  retrieveSongOfTheDay(user);

  retrieveSign(user);

  displayJoke();
  getActivity(user);
}

// Get data from API-Weather
function retrieveWeather(user) {
  // URL to do the fetch for weather API
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    user.location +
    "&units=metric" +
    "&appid=fc1547c6c6eac0f4c70827baceb61b94";

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        console.log("Error: " + response.statusText);
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Display Weather section with date and time
function displayWeather(data) {
  displayTimeAndWeather.innerHTML = "";

  const currentDate = document.createElement("p");
  currentDate.textContent = moment().format("dddd, DD-MMM-YYYY, hh:mm");
  displayTimeAndWeather.appendChild(currentDate);

  const cityAndCountry = document.createElement("p");
  cityAndCountry.textContent = data.name + " - " + data.sys.country;
  displayTimeAndWeather.appendChild(cityAndCountry);

  const iconWeatherUrl =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  const temperature = document.createElement("p");
  temperature.textContent = "Temperature: " + data.main.temp + " °C";
  displayTimeAndWeather.appendChild(temperature);

  const iconWeather = document.createElement("img");
  iconWeather.src = iconWeatherUrl;
  displayTimeAndWeather.appendChild(iconWeather);
}

// Get data from API-Youtube
function retrieveSongOfTheDay(user) {
  // Youtube playlists ID - genre
  const rockPlayList = "PL7nC4HwnKolxXrPCIvyVpgyllXrI21ygs";
  const classicPlayList = "PL7nC4HwnKolwdfoSgpKAP83XkyrON2ssY";
  const funkPlayList = "PL7nC4HwnKolwI9exF1Jm_SnLHStMIGn3c";
  const latinPlayList = "PLB30C5C064B67AABF";

  // Select the playlist for favorite user genre
  let userPlaylist;

  switch (user.music) {
    case "rock": {
      userPlaylist = rockPlayList;
      break;
    }
    case "classic": {
      userPlaylist = classicPlayList;
      break;
    }
    case "funk": {
      userPlaylist = funkPlayList;
      break;
    }
    case "latin": {
      userPlaylist = latinPlayList;
      break;
    }
    default: {
      throw new Error("invalid playlist option");
    }
  }

  const MusicQueryURL =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" +
    userPlaylist +
    "&key=AIzaSyBc58mT_-8rn6_TGyrZRhizEdMAXVqiRJQ";

  // Get data from Youtube API
  fetch(MusicQueryURL)
    .then(function (response) {
      if (!response.ok) {
        console.log(response);
        throw new Error();
      }
      return response.json();
    })
    .then(function (dataSong) {
      displaySongOfTheDay(dataSong);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Display the song of the day
function displaySongOfTheDay(dataSong) {
  const i = Math.floor(Math.random() * dataSong.items.length + 1);

  iframeSong.src =
    "https://www.youtube.com/embed/" +
    dataSong.items[i].snippet.resourceId.videoId;
}

// User Starsign function
function retrieveSign(user) {
  signReadingEl.innerHTML = "";
  // Endpoint adds user sign as selected from preferences to complete the parameters
  const queryUrl =
    "https://aztro.sameerkumar.website?day=today&sign=" + user.sign;

  // Appends user sign to h2 as a greeting
  const userSign = document.createElement("h2");
  userSign.textContent = "Hey" + "  " + user.sign + "!";
  signReadingEl.appendChild(userSign);

  // Fetches via POST method, checks if response is okay - if not throws an error for catch - if yes, converts JSON to data
  fetch(queryUrl, {
    method: "POST",
  })
    .then(function (response) {
      if (!response.ok) {
        console.log(response);
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      displaySign(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Aztro 'Description' parameter is appended to display Horoscope reading on the main display
function displaySign(data) {
  const signReading = document.createElement("p");
  signReading.textContent = data.description;
  signReadingEl.appendChild(signReading);
}

function displayJoke() {
  fetch(
    "https://v2.jokeapi.dev/joke/Any?type=twopart&lang=en&blacklistFlags=nsfw,racist,sexist,explicit&safe-mode"
  )
    .then(function (response) {
      if (!response.ok) {
        console.log(response);

        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      jokeOneEl.textContent = data.setup;
      jokeTwoEl.textContent = data.delivery;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getActivity(user) {
  const activityURL =
    "https://www.boredapi.com/api/activity?type=" + user.activity;

  fetch(activityURL)
    .then(function (response) {
      if (!response.ok) {
        console.log(response);
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      activityOfTheDatEl.textContent = data.activity;
    })
    .catch(function (error) {
      console.log(error);
    });
}

init();
