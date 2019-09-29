import React from 'react';
import {Container, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import Map from "./Map";
import {estimatePointStrengthFromArray} from './Utils';
import axios from 'axios';

import {hardcodedRouteDataSets, hardcodedHeatmapDataSets} from './dataSets';


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
        pointOfInterest: {lat: 37.784, lng: -122.444},
        
        dropdownOpen: false,
        dropDownValue: 'выберете маршрут'
    };
    
    manualRoute = [];
    
    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };
    
    changeValue = (e) => {
        this.setState({dropDownValue: e.currentTarget.textContent});
        
        console.log('e', e.currentTarget.attributes['index'].value);
        
        this.setState({
                routeData: hardcodedRouteDataSets[e.currentTarget.attributes['index'].value]
            },
            //() => console.log(hardcodedRouteDataSets[e.currentTarget.index])
            //() => console.log(this.state.routeData)
        );
    };
    
    mapDivRef = React.createRef();
    
    //hardcodedRouteData = [];
    
    //hardcodedHeatmapData = [];
    
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
        this.manualRoute.push({lat: geoPosition.lat(), lng: geoPosition.lng(), weight: strength});
    };
    
    onClickMapCanvas = (x, y) => {
        this.setMarker(x, y);
        
    };
    
    logPoints = () => {
        console.log('coords:', this.manualRoute);
    };
    
    onClickGetHeatmap = (value = 0) => {
        this.setState({
            heatmapData: hardcodedHeatmapDataSets[0]
        });
        return;
        
        /*const params = {
            lat1: this.state.mapGeoRect.lat1,
            lng1: this.state.mapGeoRect.lng1,
            lat2: this.state.mapGeoRect.lat2,
            lng2: this.state.mapGeoRect.lng2,
            operator: 'YOTA'
        };*/
        
        const dx = (this.mapDivRef.current.offsetWidth);
        const dy = (this.mapDivRef.current.offsetHeight);
        
        const geoPosition1 = this.getGeoPositionFromXY(0, 0);
        const geoPosition2 = this.getGeoPositionFromXY(dx, dy);
        
        
        const params = {
            lat1: geoPosition1.lat(),
            lng1: geoPosition1.lng(),
            lat2: geoPosition2.lat(),
            lng2: geoPosition2.lng(),
            carrierName: 'YOTA'
        };
        
        axios
            .get('/api/items', params)
            .then(res => {
                this.setState({
                    heatmapData: res.data
                })
            });
    };
    
    onClickGetRoute = (value = 0) => {
        this.setState({
            routeData: hardcodedRouteDataSets[3]
        });
        return;
        
        const params = {
            id: value,
            carrierName: 'YOTA'
        };
        
        axios
            .get('/api/routes', params)
            .then(res => {
                this.setState({
                    routeData: res.data
                })
            });
            
    };
    
    
    render() {
        return (
            
            <Container>
                <h1>
                    Line APP
                </h1>
                <div
                    className='map-wrapper'
                    ref={this.mapDivRef}
                    onClick={(e) => {
                        console.log('click', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        //this.getHeatValueFromXY(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                        this.setMarker(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    }}
                    style={{
                        display: 'flex',
                        //height: "400px",
                        //width: "800px"
                        width: '100%',
                        height: '100%'
                    }}>
                    <Map
                        heatmapData={this.state.heatmapData}
                        routeData={this.state.routeData}
                        onLoadCB={this.getMapsAndHeatmapLayer.bind(this)}
                        //onClickMap={this.onClickMapCanvas.bind(this)}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '5vh'}}>
                    {/*<button onPress=></button>*/}
                    <Button color="primary" onClick={this.onClickGetRoute}>Загрузить путь с сервера</Button>
                    <Button color="primary" onClick={this.onClickGetHeatmap}>Загрузить тепловую катру с сервера</Button>
                    {/*<p>Temp: {this.getTempOfCursorCoords()}</p>*/}
                    {/*<Button color="info" onClick={() => {*/}
                        {/*console.log('getTempOfCursorCoords', this.getTempOfCursorCoords());*/}
                    {/*}}>Get temp</Button>*/}
                    {/*<Button color="info" onClick={this.definePoint}>Define</Button>*/}
                    
                    {/*<Button color="primary" onClick={this.setRouteData}>set route</Button>*/}
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                            {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.changeValue} index={0}>Путь 1</DropdownItem>
                            <DropdownItem onClick={this.changeValue} index={1}>Путь 2</DropdownItem>
                            <DropdownItem onClick={this.changeValue} index={2}>Путь 3</DropdownItem>
                            <DropdownItem onClick={this.changeValue} index={3}>Путь 4</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
    
                    <Button color="danger" onClick={this.logPoints}>Log</Button>
                </div>
            </Container>
        
        );
    }
}


