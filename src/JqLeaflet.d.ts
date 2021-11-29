declare var GeoSearch: any;
declare var L: any;
declare var $: any;
interface Position {
    lat: any;
    lng: any;
    label?: string;
}
declare class JqLeaflet {
    map: any;
    static loading: boolean;
    static dragging: boolean;
    static icon: any;
    geoSearchOptions: any;
    position: Position;
    static inputOptions: {
        latInput: any;
        lngInput: any;
    };
    constructor(inputOptions: {
        latInput: any;
        lngInput: any;
    });
    static tooltipContent(position: Position): Promise<string>;
    static addMarker(target: any, position: Position): void;
    static dragMarker(event: any): void;
    static getAddress(position: Position): Promise<string>;
    onMapClick(value: any): void;
    onSearch(value: any): void;
    getUserPosition(): Promise<Position>;
    init(): any;
}
