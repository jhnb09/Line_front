import React from 'react';
import {GoogleMap, LoadScript, HeatmapLayer} from '@react-google-maps/api'

const center = {
    lat: 37.774546,
    lng: -122.433523
};


//const google = window.google = window.google ? window.google : {};


const gMapLibs = ["visualization"];


export default class Map extends React.Component {
    state = {
        response: null,
        travelMode: 'DRIVING',
        origin: '',
        destination: '',
    }
    
    getHeatmapPoints = () => {
        if(!this.google || !this.google.maps || !this.props.heatmapData) return [];
        return this.props.heatmapData.map(item =>
            ({location: new this.google.maps.LatLng(item.lat, item.lng), weight: item.weight})
        );
    };
    
    onLoadMaps = (map) => {
        //const google = window.google;// = window.google ? window.google : {};
        //console.log("window.google", window.google);
        this.google = window.google;
        this.map = map;
        //this.google.maps = window.google.maps;
        //console.log('this.google', this.google);
        /*inArr = [
            new google.maps.LatLng(37.782, -122.447),
            new google.maps.LatLng(37.782, -122.445),
            new google.maps.LatLng(37.782, -122.443),
            new google.maps.LatLng(37.782, -122.441),
            new google.maps.LatLng(37.782, -122.439),
            new google.maps.LatLng(37.782, -122.437),
            new google.maps.LatLng(37.782, -122.435),
            new google.maps.LatLng(37.785, -122.447),
            new google.maps.LatLng(37.785, -122.445),
            new google.maps.LatLng(37.785, -122.443),
            new google.maps.LatLng(37.785, -122.441),
            new google.maps.LatLng(37.785, -122.439),
            new google.maps.LatLng(37.785, -122.437),
            new google.maps.LatLng(37.785, -122.435)
        
        ];*/
    };
    
    onLoadHeatmap = (heatmapLayer) => {
        console.log('HeatmapLayer onLoad heatmapLayer: ', heatmapLayer);
        //console.log("window.google", window.google);
        //console.log("inArr", inArr);
        //this.google = window.google;
        //this.google.maps = window.google.maps;
    
        var overlay = new this.google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(this.map);
        
        this.props.onLoadCB(this.map, overlay, this.google, heatmapLayer);
    };
    
    render() {
        return (
            <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyC4RjQvK8Hnp65hjd8qr19JqDU8KKvYIQQ"
                libraries={gMapLibs}
            >
                <GoogleMap
                    // optional
                    id="heatmap-layer-example"
                    
                    // required to set height and width either through mapContainerClassName, either through mapContainerStyle prop
                    mapContainerStyle={{
                        height: "400px",
                        width: "800px"
                    }}
                    // required
                    zoom={13}
                    // required
                    center={center}
                    onLoad={this.onLoadMaps}
                    //mapTypeId: 'roadmap'

                >
                    <DirectionsService
                        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
                        options={{
                            destination: this.state.destination,
                            origin: this.state.origin,
                            travelMode: this.state.travelMode,
                        }}
                        callback={this.directionsCallback}
                    />
                    
                    {/*<HeatmapLayer*/}
                        {/*// optional*/}
                        {/*onLoad={this.onLoadHeatmap}*/}
                        {/*// optional*/}
                        {/*onUnmount={heatmapLayer => {*/}
                            {/*console.log('HeatmapLayer onUnmount heatmapLayer: ', heatmapLayer)*/}
                        {/*}}*/}
                        {/*// required*/}
                        {/*//data={inArr}*/}
                        {/*data={this.getHeatmapPoints()}*/}
                        {/*options={{*/}
                            {/*//dissipating: true,*/}
                            {/*//maxIntensity: 1000,*/}
                            {/*//radius: 2,*/}
                            {/*opacity: 0.8*/}
                        {/*}}*/}
                    {/*/>*/}
                </GoogleMap>
            </LoadScript>
        )
    }
}

