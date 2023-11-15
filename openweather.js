const apiKey = "0c9f8e560a36e989a0b09d6ad1dc3442"
// Search elements
const locationInput = document.querySelector(".locationinput")
const contentParent = document.getElementById("contentsearch")

const dataDisplay = document.getElementById("weatherdata-box")
const contentWindow = document.getElementById("openweather-contentwindow")
let optionList = document.querySelectorAll(".optiontext option")

// weather element parents
const temp = document.getElementById("temp")
const weather = document.getElementById("weather")
const icon = document.getElementById("icon")
const location2 = document.getElementById("location")
const date = document.getElementById("date")
const speed = document.getElementById("speed")
const speedLoader = document.getElementById("speed-loader")
const degree = document.getElementById("degree")
const gust = document.getElementById("gust")
const feelslike = document.getElementById("feelslike")
const desc = document.getElementById("desc")
const clouds = document.getElementById("clouds")
const cloudLoader = document.getElementById("cloud-loader")
const visibility = document.getElementById("visibility")
const pressure = document.getElementById("pressure")
const humidity = document.getElementById("humidity")
const humidityLoader = document.getElementById("humidity-loader")
const degarrow = document.getElementById("degarrow")



function clearList(){
    while (contentParent.firstChild) {
        contentParent.removeChild(contentParent.lastChild)
    }
}



// function dropDownMenu(data, int) {
//     const listElement = document.createElement("option")
//     let content = ` ${data[int].name}, ${data[int].country} ` 
//     listElement.setAttribute("class","optiontext")
//     listElement.setAttribute("id","optiontext")
//     listElement.setAttribute("value", int)
//     listElement.textContent = content
//     contentParent.appendChild(listElement)

// }



locationInput.addEventListener("input", (e) => {
    clearList()
    
    let location = e.target.value

    if(location == "") {
        dataDisplay.style.display = "none" 
        contentWindow.style.height = "250px"
    } else {
        dataDisplay.style.display = "flex" 
        contentWindow.style.height = "700px"  
    }



    let geoLink = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`
    fetch(geoLink)
    .then(result => result.json())
    .then((data) => {
            for (let i = 0; i<5; i++) {
                weatherApiRequest(data[0].lat, data[0].lon)
            }
        }
    ).catch(err => err) 

})


function weatherApiRequest(lat, lon) {
    let coordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(coordLink)
        .then(result => result.json())
        .then((data) => {
                main(data)
                details(data)
            }
        ).catch(err => console.error(err)) 
}


function clearResults(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild)
    }
}

// Wind speed, degree, gust, desc, temps, humidity, pressure, visibility
function details(data) {
    let speedText = `Wind ${data.wind.speed} m/s`
    windGraph(data.wind.speed)
    changeElement(speedText, speed)

    windDirection(data.wind.deg, degree)
    if(JSON.stringify(data.wind.gust) == null) {
        gust.textContent = ""
    } else {
        const context = `Gusts up to ${data.wind.gust} m/s`
        changeElement(context, gust)
    }
    let weather_desc = data.weather[0].description
    changeElement(weather_desc.charAt(0).toUpperCase() + weather_desc.slice(1), desc)
    changeElement(`Feels like: ${Math.round(data.main.feels_like) / 10}°C`, feelslike)

    let cloudsText = `Cloud density: ${data.clouds.all}%` 
    changeElement(cloudsText, clouds)
    percentageGraph(data.clouds.all, cloudLoader)

    changeElement(`Visibility: ${Math.round(data.visibility) *.001}km`, visibility)
    changeElement(`Air pressure: ${data.main.pressure} hPa`, pressure)
    changeElement(`Humidity: ${data.main.humidity} %`, humidity)
    percentageGraph(data.main.humidity, humidityLoader)
}

// Icon, temp, weather, location, date, sunrise
function main(data) { 
    changeIcon(data, icon)

    let tempText = `${Math.round(data.main.temp) / 10}°C`
    changeElement(tempText, temp)

    changeElement(data.weather[0].main, weather)
    
    let locationText = `${data.name}, ${data.sys.country}`
    changeElement(locationText, location2)
    
    let dateNew = new Date()
    let month = dateNew.toLocaleDateString("default", {month: "long"})
    let dateText = `${dateNew.getDate()} ${month}`
    changeElement(dateText, date)

    


    
}

function sun(data, string, parent) {
    
    let dateUnix = new Date(data) 
    let hours = dateUnix.getHours()
    let minutes = dateUnix.getMinutes()

    parent.textContent = `${string} ${hours}:${minutes}`
}

function changeIcon(data, parent) {
    clearResults(parent)
    let toIcon = data.weather[0].icon
    parent.src = `https://openweathermap.org/img/wn/${toIcon}@2x.png`

}

function changeElement(str, parent) {
    clearResults(parent)
    parent.textContent = str
}

function windGraph(data) {
    if(data <= 5) {
        speedLoader.style.width = "10%"
        speedLoader.style.backgroundColor = "#59a6ee"
    } else if (data <= 10){
        speedLoader.style.width = "25%"
        speedLoader.style.backgroundColor = "lightgreen"
    } else if (data <= 15){
        speedLoader.style.width = "50%"
        speedLoader.style.backgroundColor = "yellow"
    } else if (data <= 20){
        speedLoader.style.width = "75%"
        speedLoader.style.backgroundColor = "lightcoral"
    } else if (data <= 25){
        speedLoader.style.width = "100%"
        speedLoader.style.backgroundColor = "orangered"
    }
}

function percentageGraph(data, loader) {
    loader.style.backgroundColor = "#59a6ee"
    let newData = String(data)
    loader.style.width = `${newData}%` 
}

function windDirection(data, degree) {
    degarrow.style.rotate = `${data}deg`
    if (data < 22.5) {
        degree.textContent = "North"
    } else if (data > 23 && data < 67.5) {
        degree.textContent = "North East"
    } else if (data > 68 && data < 112.5) {
        degree.textContent = "East"
    } else if (data > 113 && data < 157.5) {
        degree.textContent = "South East"
    } else if (data > 158 && data < 202.5) {
        degree.textContent = "South"
    } else if (data > 203 && data < 247.5) {
        degree.textContent = "South West"
    } else if (data > 248 && data < 292.5) {
        degree.textContent = "West"
    } else if (data > 293 && data < 337.5) {
        degree.textContent = "North West"
    } else if (data > 338){ 
        degree.textContent = "North"
    } else {
        degree.textContent = `${String(data)}`
    }
}