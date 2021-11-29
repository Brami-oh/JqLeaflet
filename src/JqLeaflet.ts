declare var GeoSearch: any //Leaflet GeoSearch
declare var L: any //Leaflet
declare var $: any //JQUery

interface Position {lat: any, lng: any, label?: string}

class JqLeaflet {
    map: any;
    static loading: boolean = false;
    static dragging: boolean = false;
    static icon: any;
    geoSearchOptions: any;
    position: Position = { lat:"0", lng: "0", label: "..."};
    static inputOptions: {latInput: any, lngInput: any} = {latInput: {}, lngInput: {}};

    constructor(inputOptions: {latInput: any, lngInput: any}){
        JqLeaflet.inputOptions = inputOptions;
        this.getUserPosition().then((r: Position) => {
            this.position = r

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
                    this.position.lat = inputOptions.latInput.val() || this.position.lat
                    inputOptions.latInput.on("change", function(){
                        self.map = self.init()
                    })
                    }

            if(inputOptions.lngInput)
                {this.position.lng = inputOptions.lngInput.val() || this.position.lng
                inputOptions.lngInput.on("change", function(){
                        self.map = self.init()
                    })
                    }
        }

        this.map = this.init()
        });
        
    }

    static tooltipContent(position: Position) {
        var address = position.label || JqLeaflet.getAddress(position);
      if (JqLeaflet.dragging) return "...";
      if (JqLeaflet.loading) return "Loading...";
      return `<strong>${ address && address.replace(
        ",",
        "<br/>"
      )}</strong> <hr/><strong>Latitude:</strong> ${
        position.lat
      }<br/> <strong>Longitude:</strong> ${position.lng}`;
    }

    static addMarker(target: any, position: Position){
        var user = L.latLng([position.lat, position.lng]);
        var marker = L.marker(user, {
            icon: JqLeaflet.icon,
            draggable: true,
            dragend: JqLeaflet.dragMarker
        })
        .addTo(target);

        var tooltipContent = JqLeaflet.tooltipContent(position);
        marker.bindPopup(tooltipContent).openPopup();

        // #12 : Update marker popup content on changing it's position
        marker.on("dragend", function(e: any){
            var {lat, lng} = e.target._latlng;
            position.lat = lat;
            position.lng = lng;
            position.label = "";

            var tooltipContent = JqLeaflet.tooltipContent(position);
            marker.bindPopup(tooltipContent).openPopup();

            JqLeaflet.inputOptions.latInput.val(position.lat);
            JqLeaflet.inputOptions.lngInput.val(position.lng);
        });

        JqLeaflet.inputOptions.latInput.val(position.lat);
        JqLeaflet.inputOptions.lngInput.val(position.lng);
    }

    static dragMarker(event: any){
        console.log(event)
    }

    static getAddress(position: Position) {
        JqLeaflet.loading = true;
        let address = "addresse non resolue";
        try {
            const {
                lat,
                lng
            } = position;
            
            $.ajax({
                url:`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                method: "get",
                async: false,
                success: (body: any)=>{  address = body.display_name; },
                error: (e: any)=> { console.error("Reverse Geocode Error->", e); }
            })

        } catch (e) {
            console.error("Reverse Geocode Error->", e);
        }
        JqLeaflet.loading = false;
        return address;
    }

    onMapClick(value: any) {
        // place the marker on the clicked spot
        this.position = value.latlng;

        var user = L.latLng([this.position.lat, this.position.lng]);
        var marker = L.marker(user, {
            icon: JqLeaflet.icon,
            draggable: true,
            dragend: JqLeaflet.dragMarker
        })
        .addTo(value.target)

        $.when(JqLeaflet.tooltipContent(this.position)).done((r: string)=> {
            marker.bindPopup(r).openPopup();
        });

        // #12 : Update marker popup content on changing it's position
        marker.on("dragend", function(e: any){
            var {lat, lng} = e.target._latlng;
            var position:any = {};
            position.lat = lat;
            position.lng = lng;

            var tooltipContent = JqLeaflet.tooltipContent(position);
            marker.bindPopup(tooltipContent).openPopup();

            JqLeaflet.inputOptions.latInput.val(lat);
            JqLeaflet.inputOptions.lngInput.val(lng);
        });

        JqLeaflet.inputOptions.latInput.val(this.position.lat);
        JqLeaflet.inputOptions.lngInput.val(this.position.lng);
    }

    onSearch(value: any) {
        const loc = value.location;
        this.position = {
            lat: loc.y,
            lng: loc.x,
            label: loc.label
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
            return this.map;
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