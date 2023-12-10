import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { customerApi } from '@/common';

interface Truck {
  _id: number;
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
  availability: boolean;
}

const SelectTruck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [availableTrucks, setAvailableTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const truckRes = await customerApi.getAvailableShipments(shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate, {
          Authorization: `Bearer ${token}`,
        });

        if (truckRes) {
          setAvailableTrucks(truckRes.availableTrucks);
          setErrorMessage(null);
        } else {
          setErrorMessage('Failed to fetch available trucks. Please try again.');
          setAvailableTrucks([]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setErrorMessage('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate]);

  const handleSelectTruck = (truck: Truck) => {
    setSelectedTruck(() => truck);
  };

  const handleNextPage = () => {
    navigate('/customer/shipments/find-driver', {
      state: {
        shipmentWeight,
        shipmentArea,
        shipmentPickDate,
        shipmentDeliveryDate,
        selectedTruckId: selectedTruck?._id,
      },
    });
  };

  return (
    <Card>
    <Card.Header>
      <h4 className="header-title">Select Truck</h4>
    </Card.Header>
    <Card.Body>
      <ProgressBar style={{ height: 5, marginBottom: '30px' }} now={25} animated className="progress" />

      {selectedTruck && (
        <div className="mb-4">
          <h5>Selected Truck:</h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>{selectedTruck.truckNumber}</strong> - {selectedTruck.make} - {selectedTruck.year}
              <Badge bg={selectedTruck.availability ? 'success' : 'danger'} className="ms-2">
                {selectedTruck.availability ? 'Available' : 'Not Available'}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </div>
      )}

      {availableTrucks.length > 0 && (
        <div className="mb-4">
          <h5>Available Trucks:</h5>
          <ListGroup>
            {availableTrucks.map((truck, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => handleSelectTruck(truck)}
                active={selectedTruck?._id === truck._id}
              >
                <strong>{truck.truckNumber}</strong> - {truck.make} - {truck.year}
                <Badge bg={truck.availability ? 'success' : 'danger'} className="ms-2">
                  {truck.availability ? 'Available' : 'Not Available'}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <Badge bg="danger">{errorMessage}</Badge>
        </div>
      )}

      <Button variant="primary" onClick={handleNextPage} disabled={!selectedTruck}>
        Get Available Drivers <i className="ri-arrow-right-line ms-1" />
      </Button>
    </Card.Body>
  </Card>
  );
};

export default SelectTruck;
