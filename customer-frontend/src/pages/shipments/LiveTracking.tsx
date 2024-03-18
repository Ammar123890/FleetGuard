import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '@/components';

const LiveTracking: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDetails, setLocationDetails] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    mapRef.current = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Fetch location when component mounts
    getLocation();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.setView([location.latitude, location.longitude], 13);
      L.marker([location.latitude, location.longitude]).addTo(mapRef.current);

      // Fetch location details
      reverseGeocode(location.latitude, location.longitude);
    }
  }, [location]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      if (data && data.display_name) {
        setLocationDetails(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  return (
    <div>
      <PageBreadcrumb title="View Shipment details" subName="Shipments" />
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="text-center">Track Shipment</h2>
        </Card.Header>
        <Card.Body>
          <div id="map" style={{ height: '400px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}></div>
          <div className="mt-4">
            {location && (
              <div>
                <h4>Location Details:</h4>
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
                <p><strong>Location Name:</strong> {locationDetails}</p>
              </div>
            )}
          </div>
          {error && <div className="mt-4 alert alert-danger">Error: {error}</div>}
          {location && (
            <Link to={`/customer/shipments/roadConditions/${location.latitude}/${location.longitude}`}>
              <Button className="mt-3" variant="primary">View Road Conditions</Button>
            </Link>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default LiveTracking;
