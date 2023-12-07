import React, { useState, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';

interface MapContainerProps {
  google: any;
  onLocationSelected: (location: { lat: number; lng: number; name: string } | null) => void;
}

const GoogleMapsForm = ({ google, onLocationSelected }: MapContainerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  const handleMapClick = async (mapProps: any, map: any, clickEvent: any) => {
	const latLng = clickEvent.latLng.toJSON();
	await updateSelectedLocation(latLng);
  
	// Using OpenCage Geocoding API for reverse geocoding
	const apiKey = 'e01c02a261ca47fcaa6616ba72fa2d41';
	const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latLng.lat}+${latLng.lng}&language=en&pretty=1`);
  
	if (response.data.results.length > 0) {
	  const locationName = response.data.results[0].formatted;
	  setSelectedLocation({ lat: latLng.lat, lng: latLng.lng, name: locationName });
	  onLocationSelected({ lat: latLng.lat, lng: latLng.lng, name: locationName });
	} else {
	  console.error('Error fetching location name from OpenCage Geocoding API');
	}
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=e01c02a261ca47fcaa6616ba72fa2d41&language=en&pretty=1`
      );

      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        await updateSelectedLocation({
          lat: firstResult.geometry.lat,
          lng: firstResult.geometry.lng,
        });

        // Access the map instance using ref and set its center
        const map = mapRef.current.map;
        map.setCenter({ lat: firstResult.geometry.lat, lng: firstResult.geometry.lng });
      } else {
        console.error('No results found for the given query.');
      }
    }
  };

  const updateSelectedLocation = async (location: { lat: number; lng: number }) => {
    setSelectedLocation({ lat: location.lat, lng: location.lng, name: '' });
    onLocationSelected({ lat: location.lat, lng: location.lng, name: '' });
  };

   // ... (handleMapClick, handleSearch, updateSelectedLocation)

   return (
    <Card>
      <Card.Body>
        <div className="gmaps" style={{ position: 'relative', overflow: 'hidden' , height: 500}}>
          <Map
            google={google}
            initialCenter={{ lat: 33.6563379010466, lng: 73.01544755217836 }}
            onClick={handleMapClick}
            ref={mapRef}
          >
            {selectedLocation && (
              <Marker
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                title="Selected Location"
              />
            )}
          </Map>
          {selectedLocation && (
            <div style={{ position: 'absolute', top: 5, left: 5, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 5,  }}>
              <h5>Selected Location:</h5>
              <p>{`Name: ${selectedLocation.name}`}</p>
              <p>{`Latitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`}</p>
            </div>
          )}
         <div style={{ border: 0.5 , position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255, 255, 255, 1)', padding: 10 }}>
            <h5>Search Location:</h5>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter location"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDsucrEdmswqYrw0f6ej3bf4M4suDeRgNA',
})(GoogleMapsForm);
