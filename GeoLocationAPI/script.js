navigator.geolocation.getCurrentPosition(
    function(position){
        //console.log(position);
        const latitude = position.coords.latitude;
        const longtitude = position.coords.longitude;
        const coords=[latitude, longtitude]
        console.log(`https://www.google.com/maps/@${latitude},${longtitude}`)
        var map = L.map('map').setView(coords, 16 );

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
        .bindPopup('A random Location that I dont know :)')
        .openPopup();
        
    },

    function(){
        alert("Could not get position");
    }
);