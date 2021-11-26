"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] },
        f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;

    function verb(n) { return function(v) { return step([n, v]); }; }

    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return { value: op[1], done: false };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1];
                        t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2];
                        _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e];
            y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var JqLeaflet = /** @class */ (function() {
    function JqLeaflet(inputOptions) {
        var _this = this;
        this.loading = false;
        this.dragging = false;
        this.position = { lat: "0", lng: "0" };
        JqLeaflet.inputOptions = inputOptions;
        $.when(this.getUserPosition().then(function(r) { return _this.position = r; }));
        JqLeaflet.icon = L.icon({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png",
        });
        var self = this;
        if (inputOptions) {
            if (inputOptions.latInput) {
                this.position.lat = inputOptions.latInput.value || this.position.lat;
                inputOptions.latInput.on("change", function() {
                    self.map = self.init();
                });
            }
            if (inputOptions.lngInput) {
                this.position.lng = inputOptions.lngInput.value || this.position.lng;
                inputOptions.lngInput.on("change", function() {
                    self.map = self.init();
                });
            }
        }
        this.map = this.init();
    }
    JqLeaflet.addMarker = function(target, position) {
        var user = L.latLng([position.lat, position.lng]);
        var marker = L.marker(user, {
                icon: JqLeaflet.icon,
                draggable: true,
                dragend: JqLeaflet.dragMarker
            })
            .addTo(target)
            .bindPopup(position.lat.toString()).openPopup();
        // #12 : Update marker popup content on changing it's position
        marker.on("dragend", function(e) {
            var chagedPos = e.target.getLatLng();
            //this.bindPopup(chagedPos.toString()).openPopup();
            console.log(e);
        });
        JqLeaflet.inputOptions.latInput.value = position.lat;
        JqLeaflet.inputOptions.lngInput.value = position.lng;
    };
    JqLeaflet.dragMarker = function(event) {
        console.log(event);
    };
    JqLeaflet.prototype.getAddress = function() {
        return __awaiter(this, void 0, void 0, function() {
            var address, _a, lat, lng, result, body, e_1;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        this.loading = true;
                        address = "addresse non resolue";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        _a = this.position, lat = _a.lat, lng = _a.lng;
                        return [4 /*yield*/ , fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=".concat(lat, "&lon=").concat(lng))];
                    case 2:
                        result = _b.sent();
                        if (!(result.status === 200)) return [3 /*break*/ , 4];
                        body = result.json();
                        return [4 /*yield*/ , body.display_name];
                    case 3:
                        address = _b.sent();
                        _b.label = 4;
                    case 4:
                        return [3 /*break*/ , 6];
                    case 5:
                        e_1 = _b.sent();
                        console.error("Reverse Geocode Error->", e_1);
                        return [3 /*break*/ , 6];
                    case 6:
                        this.loading = false;
                        return [2 /*return*/ , address];
                }
            });
        });
    };
    JqLeaflet.prototype.onMapClick = function(value) {
        // place the marker on the clicked spot
        this.position = value.latlng;
        var marker = L.marker(value.latlng, {
                draggable: true,
                title: "Resource location",
                alt: "Resource Location",
                riseOnHover: true
            }).addTo(this.map)
            .bindPopup(value.latlng.toString()).openPopup();
        // #12 : Update marker popup content on changing it's position
        marker.on("dragend", function(e) {
            var chagedPos = e.target.getLatLng();
            //this.bindPopup(chagedPos.toString()).openPopup();
        });
    };
    JqLeaflet.prototype.onSearch = function(value) {
        var loc = value.location;
        this.position = {
            lat: loc.y,
            lng: loc.x
        };
        JqLeaflet.addMarker(value.target, this.position);
    };
    JqLeaflet.prototype.getUserPosition = function() {
        return __awaiter(this, void 0, void 0, function() {
            var self;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        if (!navigator.geolocation) return [3 /*break*/ , 2];
                        // get GPS position
                        return [4 /*yield*/ , navigator.geolocation.getCurrentPosition(function(pos) {
                            // set the user location
                            self.position = {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude,
                            };
                            console.log("test", self.position);
                            JqLeaflet.addMarker(self.map, self.position);
                        })];
                    case 1:
                        // get GPS position
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        return [2 /*return*/ , self.position];
                }
            });
        });
    };
    JqLeaflet.prototype.init = function() {
        var GeoSearchControl = GeoSearch.GeoSearchControl,
            OpenStreetMapProvider = GeoSearch.OpenStreetMapProvider;
        if (this.map) {
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
        };
        var searchControl = new GeoSearchControl(geoSearchOptions);
        map.addControl(searchControl);
        map.on("geosearch/showlocation", this.onSearch);
        return map;
    };
    JqLeaflet.inputOptions = { latInput: {}, lngInput: {} };
    return JqLeaflet;
}());