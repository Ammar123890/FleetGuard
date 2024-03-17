import { useEffect, useState } from 'react';
import { Card,  Table,
 } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
// import { PageBreadcrumb } from '@/components';
// import { color } from 'chart.js/helpers';
// import { Badge } from 'react-bootstrap';
// import { Title } from 'chart.js';


interface Shipment {
    _id: string;
    shipmentType: string;
    shipmentWeight: number;
    shipmentArea: number;
    shipmentDescription: string;
    shipmentStatus: string;
    shipmentPickDate: string;
    shipmentDeliveryDate: string;
    shipmentCost: number;
    paymentMethod: string;
    shipmentDestination: {
      location: string;
      coordinates: [number, number];
    };
    shipmentOrigin: {
      location: string;
      coordinates: [number, number];
    };
    sender: {
      name: string;
      phone: string;
    };
    receiver: {
      name: string;
      phone: string;
    };
  }

interface ShipmentInTransitProps {
    shipment: Shipment;
  }
  
  const ShipmentInTransit: React.FC<ShipmentInTransitProps> = ({ shipment }) => {
    // const getStatusBadgeVariant = (status: string): string => {
    //   switch (status) {
    //     case 'in transit':
    //       return 'primary';
    //     default:
    //       return 'secondary';
    //   }
    // };
  
    return (
      <tr>
        <td>{shipment.shipmentType}</td>
        <td>{shipment.shipmentDestination.location}</td>
        {/* <td>
          <Badge bg={getStatusBadgeVariant(shipment.shipmentStatus)} text="light">
            {shipment.shipmentStatus}
          </Badge>
        </td> */}
        <td>
          <Link to={`/customer/accidentPrediction/${shipment._id}`} className="btn btn-primary">
            View probability
          </Link>
        </td>
      </tr>
    );
  };
  
  const DeliveriesForAccidentPrediction = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
  
    useEffect(() => {
      const fetchOngoingDeliveries = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await customerApi.getShipments({
            Authorization: `Bearer ${token}`,
          });
  
          if (!res.status) {
            throw new Error('Failed to fetch data');
          }
  
          const data: Shipment[] = res.data.filter((shipment: { shipmentStatus: string; }) => shipment.shipmentStatus === 'in transit');
          setShipments(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchOngoingDeliveries();
    }, []);
  
    return (
      <>
        {/* <PageBreadcrumb title="Ongoing Deliveries" subName="Shipments in Transit" /> */}
        <Card>
            <Card.Header>
              <h2>Ongoing Deliveries</h2> 
            </Card.Header>
          <Card.Body>
            <div className="table-responsive-sm">
              <Table className="table-striped table-centered mb-0">
                <thead>
                  <tr>
                    <th>Shipment Type</th>
                    <th>Shipment Destination</th>
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment, idx) => (
                    <ShipmentInTransit key={idx} shipment={shipment} />
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  };
  
  export default DeliveriesForAccidentPrediction;
  