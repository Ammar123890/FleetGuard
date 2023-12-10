import React, { useState } from 'react';
import { Card, Col, Row, Button, ListGroup , ProgressBar} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleMapsForm from './GoogleMapsForm';

const AddLocation = () => {
  const location = useLocation();
  const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate, selectedTruckId, selectedDriverId } = location.state || {};
  const navigate = useNavigate();
  const [coordinatesDest, setCoordinatesDest] = useState<{ lat: number, lng: number } | null>(null);
  const [coordinatesOrigin, setCoordinatesOrigin] = useState<{ lat: number, lng: number } | null>(null);

  const handleNextPage = () => {
    navigate('/customer/shipments/shipment-form', {
      state: {
        shipmentWeight,
        shipmentArea,
        shipmentPickDate,
        shipmentDeliveryDate,
        selectedTruckId,
        selectedDriverId,
        coordinatesDest,
        coordinatesOrigin
      },
    });
  };

  return (

    <Card>
     <Card.Header>
     <h4 className="header-title mb-0"> Shipment Location</h4>
     <ProgressBar style={{ height: 5, marginBottom: '30px', marginTop: '30px' }} now={65} animated className="progress" />
        </Card.Header>
      <Row>
      
        <Col>
        
          <Card.Header>
            Enter Shipment Destination:
            
          </Card.Header>
          
          <GoogleMapsForm onLocationSelected={(location) => setCoordinatesDest(location)} />
        </Col>
        <Col>
          <Card.Header>
          Enter Shipment Origin:
          </Card.Header>
          <GoogleMapsForm onLocationSelected={(location) => setCoordinatesOrigin(location)} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card.Title>Selected Destination:</Card.Title>
          {coordinatesDest && (
            <ListGroup>
              <ListGroup.Item>
                <strong>Coordinates:</strong> {coordinatesDest.lat}, {coordinatesDest.lng}
              </ListGroup.Item>
              {/* Add any additional information about the destination */}
            </ListGroup>
          )}
        </Col>
        <Col>
          <Card.Title>Selected Origin:</Card.Title>
          {coordinatesOrigin && (
            <ListGroup>
              <ListGroup.Item>
                <strong>Coordinates:</strong> {coordinatesOrigin.lat}, {coordinatesOrigin.lng}
              </ListGroup.Item>
              {/* Add any additional information about the origin */}
            </ListGroup>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
        
          <Card.Footer style={{marginBottom: '30px' }}>
          <li className="next list-inline-item float-end">
          <Button variant="primary" onClick={handleNextPage}>
            Complete Shipment Details<i className="ri-arrow-right-line ms-1" />
          </Button>
          </li>
          </Card.Footer>
        </Col>
      </Row>
    </Card>
  );
};

export default AddLocation;
