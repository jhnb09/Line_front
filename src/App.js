import React from 'react';
import {Container, Button} from 'reactstrap';
import Map from "./Map";
import {estimatePointStrengthFromArray} from './Utils'


export default class App extends React.Component {
    state = {
        heatmapData: [],
        map: null,
        google: null,
        heatmapLayer: null,
        pointOfInterest: {lat: 37.784, lng: -122.444}
    };
    
    setHeatmapData = () => {
        console.log('set data');
        this.setState({
            heatmapData: [
                {lat: 37.782, lng: -122.447, weight: 1000},
                {lat: 37.782, lng: -122.445, weight: 1200},
                {lat: 37.782, lng: -122.443, weight: 1000},
                {lat: 37.782, lng: -122.441, weight: 1000},
                {lat: 37.782, lng: -122.439, weight: 700},
                {lat: 37.786, lng: -122.443, weight: 1000},
                {lat: 37.786, lng: -122.447, weight: 1000},
                {lat: 37.786, lng: -122.445, weight: 500},
                {lat: 37.786, lng: -122.441, weight: 1000},
                {lat: 37.786, lng: -122.439, weight: 1000},
            ],
            pointOfInterest: {lat: 37.783, lng: -122.444}
        })
    };
    
    getMapsAndHeatmapLayer = (map, overlay, google, heatmapLayer) => {
        this.setState({
            map,
            overlay,
            google,
            heatmapLayer
        });//, () => {console.log('maps', this.state.maps);});// OK
    };
    
    getHeatValueFromXY = (x, y) => {
        if (!this.state.overlay || !this.state.google || !this.state.heatmapLayer) return -1000;
        const overlay = this.state.overlay;
        console.log('overlay', overlay.getProjection());
        const cursorGeoCoord = overlay.getProjection().fromContainerPixelToLatLng(
            new this.state.google.maps.Point(x, y)
        );
        console.log('cursorGeoCoord', cursorGeoCoord.lat(), cursorGeoCoord.lng());
        //console.log('heat', this.state.heatmapLayer.getData());
        console.log('heat', this.state.heatmapLayer.getMap());
        // console.log('heat', this.state.heatmapLayer.getData().filter(item => {
        //     if (item.location.lat() && item.location.lng());
        // }));
        //console.log('cursorGeoCoord', cursorGeoCoord);
        //return {cursorGeoCoord.Lat, cursorGeoCoord.Lng};
    };
    
    getGeoPositionFromXY = (x, y) => {
        if (!this.state.overlay || !this.state.google || !this.state.heatmapLayer) return -1000;
        const overlay = this.state.overlay;
        console.log('overlay', overlay.getProjection());
        const cursorGeoCoord = overlay.getProjection().fromContainerPixelToLatLng(
            new this.state.google.maps.Point(x, y)
        );
        return cursorGeoCoord;
    };
    
    definePoint = () => {
        const strength = estimatePointStrengthFromArray(this.state.pointOfInterest, this.state.heatmapData);
        new this.state.google.maps.Marker({
            position: this.state.pointOfInterest,
            map: this.state.map,
            title: strength.toString()
        });
    };
    
    setMarker = (x, y) => {
        const geoPosition = this.getGeoPositionFromXY(x, y);
        const strength = estimatePointStrengthFromArray(
            {lat: geoPosition.lat(), lng: geoPosition.lng()},
            this.state.heatmapData
        );
        new this.state.google.maps.Marker({
            position: geoPosition,
            map: this.state.map,
            title: strength.toString()
        });
    };
    
    render() {
        return (
            
            <Container>
                <h1>
                    Line APP
                </h1>
                <div
                    onClick={(e) => {
                        console.log('click', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        //this.getHeatValueFromXY(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        this.setMarker(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    }}
                    style={{
                        height: "400px",
                        width: "800px"
                    }}>
                    <Map heatmapData={this.state.heatmapData} onLoadCB={this.getMapsAndHeatmapLayer.bind(this)}/>
                </div>
                <div>
                    {/*<button onPress=></button>*/}
                    <Button color="primary" onClick={this.setHeatmapData}>Set Data</Button>
                    {/*<p>Temp: {this.getTempOfCursorCoords()}</p>*/}
                    <Button color="info" onClick={() => {
                        console.log('getTempOfCursorCoords', this.getTempOfCursorCoords());
                    }}>Get temp</Button>
                    <Button color="info" onClick={this.definePoint}>Define</Button>
                </div>
            </Container>
        
        );
    }
}


