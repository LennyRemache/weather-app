let coordinates = {
  apiKey: "1f238315b5dff50774bb58021defd49d",
  fetchLocation: function (city) {
    const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    // fetch takes an api as an argument
    // fetch returns a response res
    // status code 200 means successful fetch
    // response body data is only accessible with json() since data is JSON data
    // returns the data in JSON form
    // http methods -> GET POST PUT DELETE
    return fetch(geoAPI, { method: "GET" })
      .then((res) => {
        // need to validate successful api call returns res which is not undefined
        // fetch will always succeed no matter what even if bad API call
        if (res.ok) {
          console.log("Successful Geocoding API call!");
        } else {
          console.log("Failed Geocoding API call!");
        }
        return res.json();
      })
      .then((data) => {
        // data is an array with JSON data
        let { lat, lon } = data[0];
        return [lat, lon];
      });
  },
};

let weather = {
  apiKey: "1f238315b5dff50774bb58021defd49d",
  fetchWeather: async function (city) {
    // async function allows us to use await which causes function to not execute beyond location until its
    // fetch promise is completed and at the same time other synchronous code outside of this function is executed
    const [lat, lon] = await coordinates.fetchLocation(city);
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?units=${"imperial"}&lat=${lat}&lon=${lon}&appid=${
      this.apiKey
    }`;
    return fetch(weatherAPI, { method: "GET" })
      .then((res) => {
        if (res.ok) {
          console.log("Successful Weather API call!");
        } else {
          console.log("Failed Weather API call!");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        let { temp, temp_min, temp_max } = data.main;
        let name = data.name;
        let { description, icon } = data.weather[0]; // syntax only for type objects
        console.log(name);
        return [temp, temp_min, temp_max, name, description, icon];
      });
  },
  displayWeather: function (data) {},
};

const inputText = document.querySelector("#user-input");
const searchBtn = document.querySelector("#search-btn");
const cityText = document.querySelector(".city");
const actualTemp = document.querySelector(".actual");
const highLowTemp = document.querySelector(".high-low");
const tempIcon = document.querySelector(".curr-temp-icon");
const date = document.querySelector(".date");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", () => {
  const today = new Date();
  const day = String(today.getDate());
  const month = monthNames[today.getMonth()]; //January is 0!
  const year = today.getFullYear();
  //console.log(month, day, year);

  date.outerHTML = `<time class="date" datetime="${year}-${month}-${day}">${month} ${day}, ${year}</time>`;
});

searchBtn.addEventListener("click", async () => {
  const city = inputText.value;
  inputText.value = "";
  const [temp, temp_min, temp_max, name, description, icon] =
    await weather.fetchWeather(city);
  //console.log(temp, temp_min, temp_max, name, description, icon);
  cityText.textContent = name;
  actualTemp.innerHTML = `${Math.floor(temp)}&deg;`;
  highLowTemp.innerHTML = `${Math.floor(temp_max)}&deg; / ${Math.floor(
    temp_min
  )}&deg;`;
  tempIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
});
