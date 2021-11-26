// import { latLngBounds, Icon } from 'leaflet'
// import { watch, computed } from "@vue/composition-api"
// import 'leaflet/dist/leaflet.css'
// import "leaflet-geosearch/dist/geosearch.css";

export default function useMapLeaflet(element, frm) {

    delete Icon.Default.prototype._getIconUrl
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

    const getMarkerPosition = (item) => {
        element.frm.Latitude = item.latlng.lat
        element.frm.Longitude = item.latlng.lng
        element.marker.tooltip = "Position accès réseau [ \n\r " + "Latitude : " + item.latlng.lat
        element.marker.tooltip += "\n\r " + " / Longitude : " + item.latlng.lng + " ]"
    }

    const getUserPosition = async() => {
        // check if API is supported
        if (navigator.geolocation) {
            // get  geolocation
            navigator.geolocation.getCurrentPosition(pos => {
                // set user location
                element.frm.Latitude = pos.coords.latitude
                element.frm.Longitude = pos.coords.longitude
            });
        }
    }

    const tooltipContent = computed(() => {
        if (element.dragging) return "...";
        if (element.loading) return "Loading...";
        return `<strong>${this.address.replace(
      ",",
      "<br/>"
    )}</strong> <hr/><strong>lat:</strong> ${this.position.lat
      }<br/> <strong>lng:</strong> ${this.position.lng}`;
    })

    getUserPosition()

    return {
        getMarkerPosition,
        dragging: false,
        loading: false,
        address: "",
        position: {},
        MapLat: 47.313220,
        MapLong: -1.319482,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 10,
        center: [47.313220, -1.319482],
        marker: {
            id: 'm1',
            position: { lat: 47.313220, lng: -1.319482 },
            tooltip: 'Position accès réseau',
            draggable: true,
            visible: true,
        },
        circle: {
            center: [47.313220, -1.319482],
            radius: 4500,
            color: '#EA5455',
        },
        tileProviders: [{
                name: 'OpenStreetMap',
                visible: true,
                attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
            {
                name: 'OpenTopoMap',
                visible: false,
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            },
        ],
        layersPosition: 'topright',
        token: 'your token if using mapbox',
    }
}