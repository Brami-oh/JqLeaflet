declare var GeoSearch: any;
declare var L: any;
declare var $: any;
declare class JqLeaflet {
    map: any;
    loading: boolean;
    dragging: boolean;
    static icon: any;
    geoSearchOptions: any;
    position: {
        lat: any;
        lng: any;
    };
    static inputOptions: {
        latInput: any;
        lngInput: any;
    };
    constructor(inputOptions: {
        latInput: any;
        lngInput: any;
    });
    static addMarker(target: any, position: {
        lat: any;
        lng: any;
    }): void;
    static dragMarker(event: any): void;
    getAddress(): Promise<string>;
    onMapClick(value: any): void;
    onSearch(value: any): void;
    getUserPosition(): Promise<{
        lat: any;
        lng: any;
    }>;
    init(): any;
}