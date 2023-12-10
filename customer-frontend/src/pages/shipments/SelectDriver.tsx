import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { customerApi } from '@/common';

interface Driver {
  _id: number;
  name: string;
  licenseNumber: string;
  // Add any additional properties for drivers
}

const SelectDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate, selectedTruckId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const driverRes = await customerApi.getAvailableDrivers(
          shipmentPickDate,
          shipmentDeliveryDate,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (driverRes) {
          setAvailableDrivers(driverRes.availableDrivers);
          setErrorMessage(null);
        } else {
          setErrorMessage('Failed to fetch available drivers. Please try again.');
          setAvailableDrivers([]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setErrorMessage('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shipmentPickDate, shipmentDeliveryDate]);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(() => driver);
  };

  const handleNextPage = () => {
    navigate('/customer/shipments/shipment-location', {
      state: {
        shipmentWeight,
        shipmentArea,
        shipmentPickDate,
        shipmentDeliveryDate,
        selectedTruckId,
        selectedDriverId: selectedDriver?._id,
      },
    });
  };

  return (
    <Card>
    <Card.Header>
      <h4 className="header-title">Select Driver</h4>
    </Card.Header>
    <Card.Body>
      <ProgressBar style={{ height: 5, marginBottom: '30px' }} now={45} animated className="progress" />

      {selectedDriver && (
        <div className="mb-4">
          <h5>Selected Driver:</h5>
          <ListGroup>
            <ListGroup.Item>
              <strong>{selectedDriver.name}</strong> - {selectedDriver.licenseNumber}
              <Badge bg={selectedDriver.availability ? 'success' : 'danger'} className="ms-2">
                {selectedDriver.availability ? 'Available' : 'Not Available'}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </div>
      )}

      {availableDrivers.length > 0 && (
        <div className="mb-4">
          <h5>Available Drivers:</h5>
          <ListGroup>
            {availableDrivers.map((driver, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => handleSelectDriver(driver)}
                active={selectedDriver?._id === driver._id}
              >
                <strong>{driver.name}</strong> - {driver.licenseNumber}
                <Badge bg={driver.availability ? 'success' : 'danger'} className="ms-2">
                  {driver.availability ? 'Available' : 'Not Available'}
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

      <Button variant="primary" onClick={handleNextPage} disabled={!selectedDriver}>
        Enter Shipment Location <i className="ri-arrow-right-line ms-1" />
      </Button>
    </Card.Body>
  </Card>
  );
};

export default SelectDriver;
