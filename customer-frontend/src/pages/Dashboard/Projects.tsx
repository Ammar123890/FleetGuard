import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { CustomCardPortlet } from '@/components';
import { customerApi } from '@/common';


interface Shipment {
  _id: string;
  driver: string;
  truck: string;
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

const Projects = () => {
  const [inTransitShipments, setInTransitShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const fetchInTransitShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getShipments({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }
        if(res.data){
          const inTransitShipmentsData = res.data.filter(
            (shipment: { shipmentStatus: string; }) => shipment.shipmentStatus === 'in transit'
          );
  
          setInTransitShipments(inTransitShipmentsData);
        }
       
      } catch (error) {
        console.error('Error fetching in-transit shipments:', error);
      }
    };

    fetchInTransitShipments();
  }, []);

  const getLastTwoWords = (location: string) => {
    const words = location.split(' ');
    return words.slice(-3).join(' ');
  };

  return (
    <CustomCardPortlet cardTitle="Ongoing Deliveries" titleClass="header-title">
      <Table hover responsive className="table-nowrap mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Shipment Type</th>
            {/* Include other shipment details you want to display */}
            <th>Origin</th>
            <th>Destination</th>
			<th>Delivery Due Date</th>
          </tr>
        </thead>
        <tbody>
          {inTransitShipments.map((shipment, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{shipment.shipmentType}</td>
                {/* Include other shipment details you want to display */}
                <td>{getLastTwoWords(shipment.shipmentOrigin.location)}</td>
                <td>{getLastTwoWords(shipment.shipmentDestination.location)}</td>
				<td>{shipment.shipmentDeliveryDate}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </CustomCardPortlet>
  );
};

export default Projects;
