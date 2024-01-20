import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import { MapContainer, GeoJSON, Marker, CircleMarker, Popup, Pane, TileLayer, useMap } from 'react-leaflet'
import { TiledMapLayer } from 'react-esri-leaflet';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

const basemaps = {
  'esri-gray': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  'esri-imagery': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  'esri-ocean': 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
  'positron': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  'label': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
}

const url = 'https://tiles.arcgis.com/tiles/7vxqqNxnsIHE3EKt/arcgis/rest/services/Anaemia_R1/MapServer'

function MainApp() {
  return (
    <div>
      <MapContainer
        center={[20,80]}
        zoom={5}
        minZoom={3}
        maxZoom={9}
        attributionControl={false}
        zoomAnimation={true}
        doubleClickZoom={false}
        id='map-container'
        style={{width:'90vw', height:'90vh'}}
      >

      <Pane name='basemap' style={{zIndex:60}}>
        <TileLayer url={basemaps['esri-ocean']}/>
      </Pane>

      <Pane name='gridLayer' style={{zIndex:100}}>
        <TiledMapLayer url={url}/>
      </Pane>
      </MapContainer>
    </div>
  )
}
export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<MainApp/>}/>
      </Routes>
    </div>
  )
}