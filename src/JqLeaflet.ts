declare var GeoSearch: any //Leaflet GeoSearch
declare var L: any //Leaflet
declare var $: any //JQUery

class JqLeaflet {
    map: any;
    loading: boolean = false;
    dragging: boolean = false;
    static icon: any;
    geoSearchOptions: any;
    position: {lat: any, lng: any} = { lat:"0", lng: "0"};
    static inputOptions: {latInput: any, lngInput: any} = {latInput: {}, lngInput: {}};

    constructor(inputOptions: {latInput: any, lngInput: any}){
        JqLeaflet.inputOptions = inputOptions;
        $.when(this.getUserPosition().then(r => this.position = r))
        
        JqLeaflet.icon = L.icon({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png",
        });
        var self = this;
        if(inputOptions)
        {
            if(inputOptions.latInput)
                {
                    this.position.lat = inputOptions.latInput.value || this.position.lat
                    inputOptions.latInput.on("change", function(){
                        self.map = self.init()
                    })
                    }

            if(inputOptions.lngInput)
                {this.position.lng = inputOptions.lngInput.value || this.position.lng
                inputOptions.lngInput.on("change", function(){
                        self.map = self.init()
                    })
                    }
        }

        this.map = this.init()
    }

    static addMarker(target: any, position: {lat: any, lng: any}){
        var user = L.latLng([position.lat, position.lng]);
        var marker = L.marker(user, {
            icon: JqLeaflet.icon,
            draggable: true,
            dragend: JqLeaflet.dragMarker
        })
        .addTo(target)
        .bindPopup(position.lat.toString()).openPopup()

        // #12 : Update marker popup content on changing it's position
        marker.on("dragend",function(e: any){

            var chagedPos = e.target.getLatLng();
            //this.bindPopup(chagedPos.toString()).openPopup();
            console.log(e)
        });

        JqLeaflet.inputOptions.latInput.value = position.lat;
        JqLeaflet.inputOptions.lngInput.value = position.lng;
    }

    static dragMarker(event: any){
        console.log(event)
    }

    async getAddress() {
        this.loading = true;
        let address = "addresse non resolue";
        try {
            const {
                lat,
                lng
            } = this.position;
            const result = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );

            if (result.status === 200) {
                const body = result.json() as any;
                address = await body.display_name;
            }
        } catch (e) {
            console.error("Reverse Geocode Error->", e);
        }
        this.loading = false;
        return address;
    }

    onMapClick(value: any) {
        // place the marker on the clicked spot
        this.position = value.latlng;

        var marker = L.marker(value.latlng, {
                 draggable:true,
                 title:"Resource location",
                 alt:"Resource Location",
                 riseOnHover:true
                }).addTo(this.map)
                  .bindPopup(value.latlng.toString()).openPopup();

        // #12 : Update marker popup content on changing it's position
        marker.on("dragend",function(e: any){

            var chagedPos = e.target.getLatLng();
            //this.bindPopup(chagedPos.toString()).openPopup();

        });
    }

    onSearch(value: any) {
        const loc = value.location;
        this.position = {
            lat: loc.y,
            lng: loc.x
        };

        JqLeaflet.addMarker(value.target, this.position);
    }

    async getUserPosition() {
        var self = this;
        if (navigator.geolocation) {
            // get GPS position
            await navigator.geolocation.getCurrentPosition((pos) => {
                // set the user location
                self.position = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                console.log("test",self.position)
                JqLeaflet.addMarker(self.map, self.position);
            });
        }

        return self.position;
    }

    init(){
        var {
            GeoSearchControl,
            OpenStreetMapProvider
        } = GeoSearch;

        if(this.map){
            JqLeaflet.addMarker(this.map, this.position);
        }

        var map = L.map("map").setView([48.86, 2.34], 12);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var geoSearchOptions = {
            provider: new OpenStreetMapProvider(),
            showMarker: false,
            autoClose: true,
        }

        const searchControl = new GeoSearchControl(geoSearchOptions);
        map.addControl(searchControl);

        map.on("geosearch/showlocation", this.onSearch);

        return map;
    }
}