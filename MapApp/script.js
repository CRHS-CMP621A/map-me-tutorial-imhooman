'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent
let workouts = []
inputType.value = "running"

//ClASSES/////
class Workout {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;//[lat,lng]
        this.distance = distance;//[in km]
        this.duration = duration;//in mins
    }
}
//child classes of Workout class
class Running extends Workout {
    type = "Running"
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace();//calculate the pace
        this.setDescription();//sets the description for the workout title
    }
    calcPace() {
        //min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

class Cycling extends Workout {
    type = "Cycling"
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevation = elevationGain
        this.calcSpeed()
        this.setDescription();
    }
    calcSpeed() {
        //min/km
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`;
    }
}

//testing classes by passing in test parameters
// const run1=new Running([39,-12],5.2,24,178);
// const cycling1=new Cycling([39,-12],27,95,523);
// console.log(run1,cycling1)


//
navigator.geolocation.getCurrentPosition(
    function (position) {
        //console.log(position);

        const latitude = position.coords.latitude;
        const longtitude = position.coords.longitude;
        const coords = [latitude, longtitude]
        console.log(`https://www.google.com/maps/@${latitude},${longtitude}`)
        map = L.map('map').setView(coords, 16);
        // const lat=mapEvent.latlng.lat
        // const lng=mapEvent.latlng.lng

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        const data = JSON.parse(localStorage.getItem(workouts))

        if (data) {
            workouts = data
            console.log(data)
        }



        L.marker(coords).addTo(map)
            .bindPopup('A random Location that I dont know :)')
            .openPopup();

        map.on("click", function (mapE) {
            mapEvent = mapE
            form.classList.remove("hidden");
            inputDistance.focus();
            console.log(mapEvent)



        })

    },


    function () {
        alert("Could not get position");
    }
);



form.addEventListener("submit", function (e) {
    e.preventDefault()
    console.log(mapEvent)
    const type = inputType.value;
    const distance = Number(inputDistance.value)
    const duration = Number(inputDuration.value)
    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng
    // let activity = inputType.value
    let workout;



    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: "running-popup"
        }))

        .setPopupContent("A random Location that I picked")
        .openPopup();


    if (type === "running") {
        const cadence = Number(inputCadence.value)

        //validate form data later

        //create new running object
        workout = new Running([lat, lng], distance, duration, cadence);
        workouts.push(workout)
    }

    if (type === "cycling") {
        const elevation = +inputElevation.value

        //create new cycling object
        workout = new Cycling([lat, lng], distance, duration, elevation);
        workouts.push(workout)
    }

    console.log(workouts)


    let html
    for (let workout of workouts) {
        let lat = workout.coords[0]
        let lng = workout.coords[1]
    }
    if (type === "running") {
        html = `<li class="workout workout--running" data-id=${workout.id}>
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
<span class="workout__icon">🏃‍♂️</span>
<span class="workout__value">${workout.distance}</span>
<span class="workout__unit">km</span>
</div>
<div class="workout__details">
<span class="workout__icon">⏱</span>
<span class="workout__value">${workout.duration}</span>
<span class="workout__unit">min</span>
</div>
<div class="workout__details">
<span class="workout__icon">⚡️</span>
<span class="workout__value">${workout.pace}</span>
<span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
<span class="workout__icon">🦶🏼</span>
<span class="workout__value">${workout.cadence}</span>
<span class="workout__unit">spm</span>
</div>
</li>`;
        L.marker([lat, lng]).addTo(map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: "running-popup"
            }))

            .setPopupContent("A random Location that I picked")
            .openPopup();

    }

    if (type === "cycling") {
        html = ` <li class="workout workout--cycling" data-id=${workout.id}>
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🚴‍♀️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.speed}</span>
  <span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⛰</span>
  <span class="workout__value">${workout.elevation}</span>
  <span class="workout__unit">m</span>
</div>
</li>`
        L.marker([lat, lng]).addTo(map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: "cycling-popup"
            }))

            .setPopupContent("A random Location that I picked")
            .openPopup();
    }
    console.log(html)
    form.insertAdjacentHTML("afterEnd", html);
    workouts.push(workout);
    console.log(workouts)
    localStorage.setItem("workouts", JSON.stringify(workouts));




    if (inputType.value == "cycling") { // This code will reset back to running with the correct cadence/elevation options.
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    }
    form.reset();
    // inputType.value = activity

})



// map.on("click", function(mapEvent){
//     console.log(mapEvent)
// }),
inputType.addEventListener("change", function () {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
})
containerWorkouts.addEventListener("click", function (e) {
    const workoutEl = e.target.closest(".workout");//This sselects the workout(class)

    if (!workoutEl) return;//if workout not found then return out of this function

    const workout = workouts.find((work) => work.id === workout.El.dataset.id)

    map.setview(workout.coords, 14, {

        //set the mapview to the location of the workout coordinates
        animate: true,
        pan: {
            duration: 1,
        },
    });
});
