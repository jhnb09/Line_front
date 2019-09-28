import React from 'react';
import {Container, Button} from 'reactstrap';
import Map from "./Map";
import {estimatePointStrengthFromArray} from './Utils'


function getRandomCelluarPower() {
    //Math.random()});// -120db: 0, -84db:max
    return -(Math.floor(Math.random() * (120 - 84 + 1)) + 84);
}


export default class App extends React.Component {
    state = {
        heatmapData: [],
        routeData: [],
        map: null,
        google: null,
        heatmapLayer: null,
        pointOfInterest: {lat: 37.784, lng: -122.444}
    };
    
    hardcodedRouteData = [
        {lat: 55.76561921521052, lng: 49.10824788530567, weight: -102},
        {lat: 55.77428091700512, lng: 49.10469822355708, weight: -117},
        {lat: 55.77963971079378, lng: 49.10170707453517, weight: -113},
        {lat: 55.78186003195261, lng: 49.10123500574855, weight: -102},
        {lat: 55.784987725023896, lng: 49.10149249781398, weight: -91},
        {lat: 55.78925873114895, lng: 49.09891757715968, weight: -87},
        {lat: 55.793214266391224, lng: 49.09587301265856, weight: -84},
        {lat: 55.79519123017344, lng: 49.09282602321764, weight: -102},
        {lat: 55.79695231393624, lng: 49.08304132473131, weight: -94},
        {lat: 55.798351474399766, lng: 49.075445308801136, weight: -97},
        {lat: 55.80052402397739, lng: 49.0695832597803, weight: -107},
        {lat: 55.8043109431034, lng: 49.05966981526126, weight: -91},
        {lat: 55.80584264548399, lng: 49.055034958083525, weight: -107},
        {lat: 55.80586676385855, lng: 49.050271354873075, weight: -118},
        {lat: 55.805336156166454, lng: 49.044263206679716, weight: -113},
        {lat: 55.80388900752057, lng: 49.03598054524173, weight: -104},
        {lat: 55.80285185123387, lng: 49.03166685462065, weight: -104},
        {lat: 55.80183878818784, lng: 49.026903251410204, weight: -117},
        {lat: 55.801356367948834, lng: 49.02380718274844, weight: -107},
        {lat: 55.80130812559621, lng: 49.019944801767, weight: -90},
        {lat: 55.80125988318376, lng: 49.01458038373721, weight: -100},
        {lat: 55.80128928407374, lng: 49.00960220380557, weight: -93}
    ];
    
    hardcodedHeatmapData = [
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
    ];
    
    setHeatmapData = () => {
        console.log('set data');
        this.setState({
            heatmapData: this.hardcodedHeatmapData,
            pointOfInterest: {lat: 37.783, lng: -122.444}
        })
    };
    
    setRouteData = () => {
        console.log('set data');
        this.setState({
            routeData: this.hardcodedRouteData
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
        //console.log('overlay', overlay.getProjection());
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
        const strength = getRandomCelluarPower();
        // const strength = estimatePointStrengthFromArray(
        //     {lat: geoPosition.lat(), lng: geoPosition.lng()},
        //     this.state.heatmapData
        // );
        new this.state.google.maps.Marker({
            position: geoPosition,
            map: this.state.map,
            title: strength.toString()
        });
        //this.hardcodedRoute.push({lat: geoPosition.lat(), lng: geoPosition.lng(), weight: strength});
    };
    
    onClickMapCanvas = (x, y) => {
        this.setMarker(x, y);
        
    };
    
    logPoints = () => {
        console.log('coords:', this.hardcodedRoute);
    };
    
    render() {
        return (
            
            <Container>
                <h1>
                    Line APP
                </h1>
                <div
                    onClick={(e) => {
                        //console.log('click', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        //this.getHeatValueFromXY(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        //this.setMarker(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    }}
                    /*style={{
                        height: "400px",
                        width: "800px"
                    }}*/>
                    <Map
                        heatmapData={this.state.heatmapData}
                        routeData={this.state.routeData}
                        onLoadCB={this.getMapsAndHeatmapLayer.bind(this)}
                        //onClickMap={this.onClickMapCanvas.bind(this)}
                    />
                </div>
                <div>
                    {/*<button onPress=></button>*/}
                    <Button color="primary" onClick={this.setHeatmapData}>set heatmap</Button>
                    {/*<p>Temp: {this.getTempOfCursorCoords()}</p>*/}
                    <Button color="info" onClick={() => {
                        console.log('getTempOfCursorCoords', this.getTempOfCursorCoords());
                    }}>Get temp</Button>
                    <Button color="info" onClick={this.definePoint}>Define</Button>
                    <Button color="danger" onClick={this.logPoints}>Log</Button>
                    <Button color="primary" onClick={this.setRouteData}>set route</Button>
                </div>
            </Container>
        
        );
    }
}


