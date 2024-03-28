import { useEffect, useState } from 'react';
import { Card, Col, Row, Badge } from 'react-bootstrap';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Shipment {
    owner: {
      name: string;
      phone: string;
    } | null; // Owner can be null in the response
    truck: {
      truckNumber: string;
    };
    driver: {
      name: string;
      phone: string;
    };
    shipmentDescription: string;
    shipmentStatus: string;
    shipmentPickDate: string;
    shipmentDeliveryDate: string;
    shipmentCost: number;
    shipmentDestination: {
      location: string;
      coordinates: [number, number];
    };
    shipmentOrigin: {
      location: string;
      coordinates: [number, number];
    };
}

const ShipmentCard = ({ shipment, index }: { shipment: Shipment; index: number }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{index + 1}. Shipment Owner: {shipment.owner?.name}</Card.Title>
        {/* <Card.Text><strong>Truck Number:</strong> {shipment.truck.truckNumber}</Card.Text> */}
        {/* <Card.Text><strong>Driver Name:</strong> {shipment.driver.name}</Card.Text> */}
        <Card.Text><strong>Description:</strong> {shipment.shipmentDescription}</Card.Text>
        
        <Card.Text><strong>Pickup Date:</strong> {new Date(shipment.shipmentPickDate).toLocaleDateString()}</Card.Text>
        <Card.Text><strong>Delivery Date:</strong> {new Date(shipment.shipmentDeliveryDate).toLocaleDateString()}</Card.Text>
        <Card.Text><strong>Cost:</strong> ${shipment.shipmentCost}</Card.Text>
        <Card.Text><strong>Status:</strong> <Badge bg="primary">{shipment.shipmentStatus}</Badge></Card.Text>
        {/* <Card.Text><strong>Destination:</strong> {shipment.shipmentDestination.location}</Card.Text> */}
        {/* <Card.Text><strong>Origin:</strong> {shipment.shipmentOrigin.location}</Card.Text> */}
      </Card.Body>
    </Card>
  );
};

const ShipmentRows = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileApi.getShipments(selectedStatus, {
          Authorization: `Bearer ${token}`,
        });
        console.log(res)
        if (!res) {
          throw new Error('Failed to fetch data');
        }

        const data: Shipment[] = res.data;
        console.log(res.data)
        setShipments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },  [selectedStatus]);
 
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value); // Update selectedStatus state when status selection changes
  };

  return (
    <>
      <div className="mb-3">
        {/* Add filter dropdown */}
        <label className="me-2">Select Status:</label>
        <select
          className="form-select"
          value={selectedStatus || ''}
          onChange={handleStatusChange} // Call handleStatusChange function when selection changes
        >
          {/* <option value="">All</option> */}
          <option value="pending">Pending</option>
          <option value="in transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {shipments.map((shipment, idx) => (
          <Col key={idx}>
            <ShipmentCard shipment={shipment} index={idx} />
          </Col>
        ))}
      </Row>
    </>
  );
};

const ShipmentsRecord = () => {
  return (
    <>
      <PageBreadcrumb title="All Shipments" subName="Shipments" />
      <Row>
        <Col xl={12}>
          <ShipmentRows />
        </Col>
      </Row>
    </>
  );
};

export default ShipmentsRecord;
