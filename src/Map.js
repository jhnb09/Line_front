import React from 'react';
import {GoogleMap, LoadScript, HeatmapLayer} from '@react-google-maps/api'

const center = {
    lat: 37.774546,
    lng: -122.433523
};

const google = window.google = window.google ? window.google : {};

export default class Map extends React.Component {
    
    
    render() {
        return (

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
                >
                    <HeatmapLayer
                        // optional
                        onLoad={heatmapLayer => {
                            console.log('HeatmapLayer onLoad heatmapLayer: ', heatmapLayer)
                        }}
                        // optional
                        onUnmount={heatmapLayer => {
                            console.log('HeatmapLayer onUnmount heatmapLayer: ', heatmapLayer)
                        }}
                        // required
                        data={[
                            new google.maps.LatLng(37.782, -122.447),
                            new google.maps.LatLng(37.782, -122.445),
                        
                        ]}
                    />
                </GoogleMap>

        )
    }
}

