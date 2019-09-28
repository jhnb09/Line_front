import React from 'react';
import {Container, Button} from 'reactstrap';
import Map from "./Map";


export default class App extends React.Component {
    state = {
        heatmapData: [],
        map: null,
        google: null,
        heatmapLayer: null
    };
    
    setHeatmapData = () => {
        console.log('set data');
        this.setState({
            heatmapData: [
                {lat: 37.782, lng: -122.447, weight: 1000},
                {lat: 37.782, lng: -122.445, weight: 800},
                {lat: 37.782, lng: -122.443, weight: 1000},
            ]
        })
    };
    
    getMapsAndHeatmapLayer = (map, google, heatmapLayer) => {
        this.setState({
            map,
            google,
            heatmapLayer
        });//, () => {console.log('maps', this.state.maps);});// OK
    };
    
    getHeatValueFromXY = (x, y) => {
        if (!this.state.map || !this.state.google || !this.state.heatmapLayer) return -1000;
        const map = this.state.map;
        console.log('map', map.getProjection());
        const cursorGeoCoord = map.getProjection().fromContainerPixelToLatLng(
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
    
    render() {
        return (
            
            <Container>
                <h1>
                    Line APP
                </h1>
                <div
                    onClick={(e) => {
                        console.log('click', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        this.getHeatValueFromXY(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
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
                    <Button onClick={() => {
                        console.log('getTempOfCursorCoords', this.getTempOfCursorCoords());
                    }}/>
                </div>
            </Container>
        
        );
    }
}


