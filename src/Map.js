import React from 'react';
import {
    GoogleMap,
    LoadScript,
    HeatmapLayer,
    //DirectionsService,
    //DirectionsRenderer,
    //Autocomplete
    Polyline
} from '@react-google-maps/api'

const center = {
    lat: 55.81972625526989,
    lng: 49.123287279032525
};


//const google = window.google = window.google ? window.google : {};


const gMapLibs = ["visualization", "places"];


export default class Map extends React.Component {
    state = {
        response: null,
        travelMode: 'DRIVING',
        origin: '',
        destination: '',
    };
    
    
    directionsCallback = response => {
        console.log(response);
        
        if (response !== null) {
            if (response.status === 'OK') {
                this.setState(() => ({
                    response,
                }))
            } else {
                console.log('response: ', response)
            }
        }
    };
    
    checkDriving = ({target: {checked}}) => {
        checked &&
        this.setState(() => ({
            travelMode: 'DRIVING',
        }))
    };
    
    checkBicycling = ({target: {checked}}) => {
        checked &&
        this.setState(() => ({
            travelMode: 'BICYCLING',
        }))
    };
    
    checkTransit = ({target: {checked}}) => {
        checked &&
        this.setState(() => ({
            travelMode: 'TRANSIT',
        }))
    };
    
    checkWalking = ({target: {checked}}) => {
        checked &&
        this.setState(() => ({
            travelMode: 'WALKING',
        }))
    };
    
    getOrigin = ref => {
        this.origin = ref
    };
    
    getDestination = ref => {
        this.destination = ref
    };
    
    /*onClick = () => {
        if (this.origin.value !== '' && this.destination.value !== '') {
            this.setState(() => ({
                origin: this.origin.value,
                destination: this.destination.value,
            }))
        }
    };*/
    
    onMapClick = (...args) => {
        console.log('onClick args: ', args)
    };
    
    
    scaleWeightToCelluar(weight) {
        // -120db: 0, -84db:max
        // 0            1000
        const D = 120 - 84;
        let weight1 = (weight + 84) + (D); //-> -36 to 0 -> 0 to 36
        //
        console.log('weight1', weight1);
        console.log('1000*(weight1/D', 1000*(weight1/D));
        return 1000*(weight1/D);
        
        
    }
    
    getHeatmapPoints = () => {
        
        
        if (!this.google || !this.google.maps || !this.props.heatmapData) return [];
        return this.props.heatmapData.map(item =>
            ({
                location: new this.google.maps.LatLng(item.lat, item.lng),
                weight: this.scaleWeightToCelluar(item.weight)
            })
        );
    };
    
    getRoutePoints = () => {
        console.log('this.props.routeData', this.props.routeData);
        if (!this.google || !this.google.maps || !this.props.routeData) return [];
        return this.props.routeData.map(item => new this.google.maps.LatLng(item.lat, item.lng));
    };
    
    onLoadMaps = (map) => {
        //const google = window.google;// = window.google ? window.google : {};
        //console.log("window.google", window.google);
        this.google = window.google;
        this.map = map;
        
        var routePolyline = new this.google.maps.Polyline({
            path: this.getRoutePoints(),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        
        routePolyline.setMap(map);
        
    };
    
    onLoadHeatmap = (heatmapLayer) => {
        console.log('HeatmapLayer onLoad heatmapLayer: ', heatmapLayer);
        //console.log("window.google", window.google);
        //console.log("inArr", inArr);
        //this.google = window.google;
        //this.google.maps = window.google.maps;
        
        var overlay = new this.google.maps.OverlayView();
        overlay.draw = function () {
        };
        overlay.setMap(this.map);
        
        this.props.onLoadCB(this.map, overlay, this.google, heatmapLayer);
    };
    
    onPlaceChangedSrc(place) {
        const lat = place.geometry.location.lat();
        const long = place.geometry.location.lng();
        console.log('lat long', lat, long);
        if (this.autocompleteSrc !== null) {
            console.log(this.autocompleteSrc.getPlace());
            this.setState(() => ({
                origin: place.geometry.location,
            }))
        } else {
            console.log('autocompleteSrc is not loaded yet!')
        }
    }
    
    onPlaceChangedDst(place) {
        //const lat = place.geometry.location.lat();
        //const long = place.geometry.location.lng();
        console.log('qq');
        if (this.autocompleteDst !== null) {
            console.log(this.autocompleteDst.getPlace());
            this.setState(() => ({
                destination: place.geometry.location,
            }))
        } else {
            console.log('autocompleteDst is not loaded yet!')
        }
    }
    
    onLoadAutocompleteSrc = (autocomplete) => {
        console.log('autocomplete: ', autocomplete);
        
        this.autocompleteSrc = autocomplete
    };
    
    onLoadAutocompleteDst = (autocomplete) => {
        console.log('autocomplete: ', autocomplete);
        
        this.autocompleteDst = autocomplete
    };
    
    onClickMap = (e) => {
        console.log('click map', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        //this.getHeatValueFromXY(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        this.props.onClickMap(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };
    
    getColorFromWeight = (weight) => {
        // -86 is green
        // -115 is red
        // -120 is grey
        if (weight > -86.0) {
            return 'rgba(0, 255, 0, 1)';
        } else if (weight < -115.0) {
            return 'rgba(127, 127, 127, 1)';
        } else {
            const scale = (115.0 - 86.0);
            let t = 255 * (weight - (-115.0)) / scale;
            return `rgba(${255 - t}, ${t}, 0, 1)`;
        }
    };
    
    getAverageColor = (dataIndex1, dataIndex2) => {
        console.log('dataIndex1', dataIndex1);
        console.log('dataIndex2', dataIndex2);
        if (dataIndex2 < 0) return this.getColorFromWeight(this.props.routeData[dataIndex1].weight);
        return this.getColorFromWeight(
            ((this.props.routeData[dataIndex1].weight + this.props.routeData[dataIndex2].weight) / 2)
        );
    };
    
    renderSectionalPolyline() {
        if (this.props.routeData.length <= 1) return null;
        
        const routePoints = this.getRoutePoints();
        let prevPoint = routePoints[0];
        let currPoint = routePoints[0];
        
        
        return (
            routePoints.map((point, i) => {
                prevPoint = currPoint;
                currPoint = point;
                
                return (
                    <Polyline
                        onLoad={polyline => {
                            console.log('polyline: ', polyline)
                        }}
                        path={[currPoint, prevPoint]}
                        options={{
                            strokeColor: this.getAverageColor(i, i - 1),//'rgba(0, 191, 255, 1)', //
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            //fillColor: '#FF0000',
                            //fillOpacity: 0.35,
                            clickable: false,
                            draggable: false,
                            editable: false,
                            visible: true,
                            radius: 30000,
                            //paths: this.getRoutePoints(),
                            zIndex: 1
                        }}
                    />
                );
            })
        );
    };
    
    render() {
        return (
            <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyC4RjQvK8Hnp65hjd8qr19JqDU8KKvYIQQ"
                libraries={gMapLibs}
            >
                <div className='map' style={{display: 'flex', width: '100%', height: '100%'}}>
                    {/*<div className='map-settings'>*/}
                    {/*<hr className='mt-0 mb-3'/>*/}
                    {/**/}
                    {/*<div className='row'>*/}
                    {/*<div className='col-md-6 col-lg-4'>*/}
                    {/*<div className='form-group'>*/}
                    {/*<label htmlFor='ORIGIN'>Origin</label>*/}
                    {/*<br/>*/}
                    {/*<input*/}
                    {/*id='ORIGIN'*/}
                    {/*className='form-control'*/}
                    {/*type='text'*/}
                    {/*ref={this.getOrigin}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<div className='col-md-6 col-lg-4'>*/}
                    {/*<div className='form-group'>*/}
                    {/*<label htmlFor='DESTINATION'>Destination</label>*/}
                    {/*<br/>*/}
                    {/*<input*/}
                    {/*id='DESTINATION'*/}
                    {/*className='form-control'*/}
                    {/*type='text'*/}
                    {/*ref={this.getDestination}*/}
                    {/*/>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<div className='d-flex flex-wrap'>*/}
                    {/*<div className='form-group custom-control custom-radio mr-4'>*/}
                    {/*<input*/}
                    {/*id='DRIVING'*/}
                    {/*className='custom-control-input'*/}
                    {/*name='travelMode'*/}
                    {/*type='radio'*/}
                    {/*checked={this.state.travelMode === 'DRIVING'}*/}
                    {/*onChange={this.checkDriving}*/}
                    {/*/>*/}
                    {/*<label className='custom-control-label' htmlFor='DRIVING'>*/}
                    {/*Driving*/}
                    {/*</label>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<div className='form-group custom-control custom-radio mr-4'>*/}
                    {/*<input*/}
                    {/*id='BICYCLING'*/}
                    {/*className='custom-control-input'*/}
                    {/*name='travelMode'*/}
                    {/*type='radio'*/}
                    {/*checked={this.state.travelMode === 'BICYCLING'}*/}
                    {/*onChange={this.checkBicycling}*/}
                    {/*/>*/}
                    {/*<label className='custom-control-label' htmlFor='BICYCLING'>*/}
                    {/*Bicycling*/}
                    {/*</label>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<div className='form-group custom-control custom-radio mr-4'>*/}
                    {/*<input*/}
                    {/*id='TRANSIT'*/}
                    {/*className='custom-control-input'*/}
                    {/*name='travelMode'*/}
                    {/*type='radio'*/}
                    {/*checked={this.state.travelMode === 'TRANSIT'}*/}
                    {/*onChange={this.checkTransit}*/}
                    {/*/>*/}
                    {/*<label className='custom-control-label' htmlFor='TRANSIT'>*/}
                    {/*Transit*/}
                    {/*</label>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<div className='form-group custom-control custom-radio mr-4'>*/}
                    {/*<input*/}
                    {/*id='WALKING'*/}
                    {/*className='custom-control-input'*/}
                    {/*name='travelMode'*/}
                    {/*type='radio'*/}
                    {/*checked={this.state.travelMode === 'WALKING'}*/}
                    {/*onChange={this.checkWalking}*/}
                    {/*/>*/}
                    {/*<label className='custom-control-label' htmlFor='WALKING'>*/}
                    {/*Walking*/}
                    {/*</label>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/**/}
                    {/*<button*/}
                    {/*className='btn btn-primary'*/}
                    {/*type='button'*/}
                    {/*onClick={this.onClick}*/}
                    {/*>*/}
                    {/*Build Route*/}
                    {/*</button>*/}
                    {/*</div>*/}
                    
                    <div
                        className='map-container'
                        //onClick={this.onClickMap}
                        style={{display: 'flex', width: '100%', height: '100%'}}
                    >
                        <GoogleMap
                            // optional
                            id="heatmap-layer-example"
                            
                            // required to set height and width either through mapContainerClassName, either through mapContainerStyle prop
                            mapContainerStyle={{
                                //height: "400px",
                                //width: "800px",
                                display: 'flex',
                                width: '100vw',
                                height: '80vh',
                                //minHeight: '800px'
                            }}
                            // required
                            zoom={11}
                            // required
                            center={center}
                            onLoad={this.onLoadMaps}
                            //mapTypeId: 'roadmap'
                        
                        >
                            {/*<Autocomplete*/}
                            {/*onLoad={this.onLoadAutocompleteSrc}*/}
                            {/*onPlacesChanged={this.onPlaceChangedSrc}*/}
                            {/*>*/}
                            {/*<input*/}
                            {/*type="text"*/}
                            {/*placeholder="Src"*/}
                            {/*style={{*/}
                            {/*boxSizing: `border-box`,*/}
                            {/*border: `1px solid transparent`,*/}
                            {/*width: `200px`,*/}
                            {/*height: `32px`,*/}
                            {/*padding: `0 12px`,*/}
                            {/*borderRadius: `3px`,*/}
                            {/*boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,*/}
                            {/*fontSize: `14px`,*/}
                            {/*outline: `none`,*/}
                            {/*textOverflow: `ellipses`,*/}
                            {/*position: "absolute",*/}
                            {/*left: "50%",*/}
                            {/*marginLeft: "-120px"*/}
                            {/*}}*/}
                            {/*/>*/}
                            {/*</Autocomplete>*/}
                            
                            {/*<Autocomplete*/}
                            {/*onLoad={this.onLoadAutocompleteDst}*/}
                            {/*onPlacesChanged={this.onPlaceChangedDst}*/}
                            {/*>*/}
                            {/*<input*/}
                            {/*type="text"*/}
                            {/*placeholder="Dst"*/}
                            {/*style={{*/}
                            {/*boxSizing: `border-box`,*/}
                            {/*border: `1px solid transparent`,*/}
                            {/*width: `200px`,*/}
                            {/*height: `32px`,*/}
                            {/*padding: `0 12px`,*/}
                            {/*borderRadius: `3px`,*/}
                            {/*boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,*/}
                            {/*fontSize: `14px`,*/}
                            {/*outline: `none`,*/}
                            {/*textOverflow: `ellipses`,*/}
                            {/*position: "absolute",*/}
                            {/*left: "80%",*/}
                            {/*marginLeft: "-120px"*/}
                            {/*}}*/}
                            {/*/>*/}
                            {/*</Autocomplete>*/}
                            
                            {/*<DirectionsService*/}
                            {/*options={{*/}
                            {/*destination: this.state.destination,*/}
                            {/*origin: this.state.origin,*/}
                            {/*travelMode: this.state.travelMode,*/}
                            {/*}}*/}
                            {/*callback={this.directionsCallback}*/}
                            {/*/>*/}
                            
                            <HeatmapLayer
                                // optional
                                onLoad={this.onLoadHeatmap}
                                // optional
                                onUnmount={heatmapLayer => {
                                    console.log('HeatmapLayer onUnmount heatmapLayer: ', heatmapLayer)
                                }}
                                // required
                                //data={inArr}
                                data={this.getHeatmapPoints()}
                                options={{
                                    //dissipating: true,
                                    //maxIntensity: 1000,
                                    radius: 60,
                                    opacity: 0.8
                                }}
                            />
                            
                            {this.renderSectionalPolyline()}
                            
                            {/*{this.state.destination !== '' && this.state.origin !== '' && (*/}
                            {/*<DirectionsService*/}
                            {/*options={{*/}
                            {/*destination: this.state.destination,*/}
                            {/*origin: this.state.origin,*/}
                            {/*travelMode: this.state.travelMode,*/}
                            {/*}}*/}
                            {/*callback={this.directionsCallback}*/}
                            {/*/>*/}
                            {/*)}*/}
                            
                            {/*{this.state.response !== null && (*/}
                            {/*<DirectionsRenderer*/}
                            {/*options={{*/}
                            {/*directions: this.state.response,*/}
                            {/*}}*/}
                            {/*/>*/}
                            {/*)}*/}
                        </GoogleMap>
                    </div>
                </div>
            
            </LoadScript>
        )
    }
}

