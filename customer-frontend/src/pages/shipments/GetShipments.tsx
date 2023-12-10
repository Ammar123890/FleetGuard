import { useEffect, useState } from 'react';
import { Card, Col, Row, Table,
	OverlayTrigger,
 } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';
// import { color } from 'chart.js/helpers';
import { Badge } from 'react-bootstrap';


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

const HoverPopover = () => {
	// const hoverPopover = (
	// 	<Popover>
	// 		{/* <Popover.Header as="h3">Ohh Wow !</Popover.Header>
	// 		<Popover.Body>
	// 			And here's some amazing content. It's very engaging. Right?
	// 		</Popover.Body> */}
	// 	</Popover>
	// )

	return (
		<Card>
			<Card.Header>
				{/* <h4 className="header-title">View Details</h4> */}
				<p className="text-muted mb-0">
					View Details
				</p>
			</Card.Header>
			{/* <Card.Body>
				<OverlayTrigger
					trigger={['hover', 'focus']}
					placement="right"
					overlay={hoverPopover}
				>
					<Button variant="dark"> Please Hover Me</Button>
				</OverlayTrigger>
			</Card.Body> */}
		</Card>
	)
}

const ShipmentRows = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getShipments({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Shipment[] = res.shipments;
        setShipments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
 
  // Helper function to get the badge variant based on status
  const getStatusBadgeVariant = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'danger';
      case 'in transit':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };


 // Apply the status filter if selected
const filteredShipments = filterStatus
? shipments.filter((shipment) => shipment.shipmentStatus === filterStatus)
: shipments;

  return (
    <>
      <Card>
        <Card.Body>
        <div className="mb-3">
            {/* Add filter dropdown */}
            <label className="me-2">Filter by Status:</label>
            <select
              className="form-select"
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="table-responsive-sm">
            <Table className="table-striped table-centered mb-0">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Shipment Type</th>
                  {/* <th>Weight</th> */}
                  {/* <th>Area</th> */}
                  {/* <th>Description</th> */}
                 
                  {/* <th>Pick Date</th> */}
                  {/* <th>Delivery Date</th> */}
                  {/* <th>Cost</th> */}
                  {/* <th>Payment Method</th> */}
                <th>Shipment Destination</th>
                  <th>Status</th>
                  {/* <th>Origin</th> */}
                  {/* <th>Sender</th> */}
                  {/* <th>Receiver</th> */}
                  {/* <th>Action    </th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{shipment.shipmentType}</td>
                    {/* <td>{shipment.shipmentWeight}</td> */}
                    {/* <td>{shipment.shipmentArea}</td> */}
                    {/* <td>{shipment.shipmentDescription}</td> */}
                    
                    {/* <td>{shipment.shipmentPickDate}</td> */}
                    {/* <td>{shipment.shipmentDeliveryDate}</td> */}
                    {/* <td>{shipment.shipmentCost}</td> */}
                    {/* <td>{shipment.paymentMethod}</td> */}
                 <td>{shipment.shipmentDestination.location}</td>
                 <td>
                      <Badge
                        bg={getStatusBadgeVariant(shipment.shipmentStatus)}
                        text="light"
                      >
                        {shipment.shipmentStatus}
                      </Badge>
                    </td>
                    {/* <td>{shipment.shipmentOrigin.location}</td> */}
                    {/* <td>{shipment.sender.name}</td> */}
                    {/* <td>{shipment.receiver.name}</td> */}
                    <td>
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="left"
                        overlay={<div><HoverPopover/></div>}
                        >
                        <Link to={`/customer/shipment/get/${shipment._id}`} className="text-reset fs-16 px-1">
                            <i  className="ri-add-line" />
                        </Link>
                        </OverlayTrigger>
                      {/* <Link to={`/delete/${shipment._id}`} className="text-reset fs-16 px-1">
                        <i className="ri-delete-bin-2-line" />
                      </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

const GetShipments = () => {
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

export default GetShipments;
