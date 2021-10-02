const welcomeBtnEl = document.querySelector("#welcome-btn");
const aboutSectionEl = document.querySelector(".about-section");
const formPreferencesEl = document.querySelector("#form-section");
const formBtnEl = document.querySelector("#form-btn");
const mainDisplayEl = document.querySelector("#main");
const userNameEl = document.querySelector("#username");
const dateOfBirthEl = document.querySelector("#DOB");
const userLocationEl = document.querySelector("#location");
const userMusicEl = document.querySelector("#user-music");

// User enters and see a ewlcome header and the about section

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
    displayMainSection();
  }
}

//when user clicks the button display form appears and display section goes away
function displayForm() {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "form-container";
}

function getFormValues() {
  const user = {
    name: userNameEl.value,
    dob: dateOfBirthEl.value,
    location: userLocationEl.value,
    // music: userMusic,
  };
  setUserPreferences(user);

  displayMainSection();
}

function displayMainSection() {
  aboutSectionEl.className = "hide";
  formPreferencesEl.className = "hide";
  mainDisplayEl.className = "main-display";
}

userMusicEl.addEventListener("click", function (event) {
  event.preventDefault();
  const userSelection = event.target;

  if (userSelection.matches("button") === true) {
    const userMusic = userSelection.getAttribute("value");
    console.log(userMusic);
  }
});

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
