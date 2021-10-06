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

  preferenceBtnEl.classList = "btnPref";

  // Retrieve weather and display
  retrieveWeather(user);
 // retrieveSongOfTheDay(user);
  retrieveSign(user);
  displayJoke();
  getActivity(user);

}

function retrieveWeather(user) {
  const APIKey = "fc1547c6c6eac0f4c70827baceb61b94";
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    user.location +
    "&units=metric" +
    "&appid=" +
    APIKey;

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

function retrieveSongOfTheDay(user) {

  const rockPlayList = "PLNxOe-buLm6cz8UQ-hyG1nm3RTNBUBv3K";
  const classicPlayList = "PL2788304DC59DBEB4";
  const funkPlayList = "PL7IyjolaORJ1kM2JEO4s9VGp4CUJZu5Gr";
  const latinPlayList = "PLkqz3S84Tw-QoDzNr9VvMXxUTQ7TkANO_";

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
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLNxOe-buLm6cz8UQ-hyG1nm3RTNBUBv3K&maxResults=25&key=AIzaSyBc58mT_-8rn6_TGyrZRhizEdMAXVqiRJQ";

  https: fetch(MusicQueryURL)
    .then(function (response) {
      if (!response.ok) {

        console.log(response);
        throw new Error();

      }
      return response.json();
    })
    .then(function (dataSong) {
      console.log(dataSong);
      displaySongOfTheDay(dataSong);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displaySongOfTheDay(dataSong) {

  const i = Math.floor(Math.random() * 30);

  iframeSong.src =
    "https://www.youtube.com/embed/" +
    dataSong.items[i].snippet.resourceId.videoId;

}

// User starsign
function retrieveSign(user) {
  signReadingEl.innerHTML = "";

  const queryUrl =
    "https://aztro.sameerkumar.website?day=today&sign=" + user.sign;

  console.log(user);

  const userSign = document.createElement("h2");
  userSign.textContent = "Hey"+"  "+user.sign+"!" ;
  signReadingEl.appendChild(userSign);

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

function displaySign(data) {
  const signReading = document.createElement("p");
  signReading.textContent = data.description;
  signReadingEl.appendChild(signReading);
}

function displayJoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?type=twopart&lang=en&blacklistFlags=nsfw,racist,sexist,explicit&safe-mode")
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
  var activityURL = "https://www.boredapi.com/api/activity?type=" + user.activity;


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
