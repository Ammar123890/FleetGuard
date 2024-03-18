import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row, Button, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { RiSunCloudyFill } from 'react-icons/ri';

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

interface Driver {
  _id: number;
  name: string;
  licenseNumber: string;
  availability: any;
  phone: any;
}

interface Truck {
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
  availability: any;
}
interface LeafletMapProps {
  originCoordinates: [number, number];
  destinationCoordinates: [number, number];
}

// interface ViewShipmentProps {
//     google: any;
// }


const ViewShipment = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [originCoordinates, setOriginCoordinates] = useState<[number, number] | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [truck, setTruck] = useState<Truck | null>(null);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const history = useHistory();
  useEffect(() => {
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
            console.log(error)
            setError(error.message);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        console.log(error)
      }
    };

    getLocation();
  }, []);

  const handleLiveTracking = () => {
    window.location.href = '/customer/shipments/live-tracking';
  };

  const handleStartShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(id, token)
      const res = await customerApi.startShipment(id!, {
        Authorization: `Bearer ${token}`,
      });

      if (!res.status) {
        throw new Error('Failed to start shipment');
      }

      // Assuming the API response contains the updated shipment data
      //   const token = localStorage.getItem('token');
      const resp = await customerApi.getShipmentById(id!, {
        Authorization: `Bearer ${token}`,
      });

      if (!resp.status) {
        throw new Error('Failed to fetch data');
      }
      const data: Shipment = resp.data;
      setShipment(data);
      setOriginCoordinates(data.shipmentOrigin.coordinates);
      setDestinationCoordinates(data.shipmentDestination.coordinates);



    } catch (error) {
      console.error('Error starting shipment:', error);
    }
  };

  const handleEndShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await customerApi.endShipment(id!, {
        Authorization: `Bearer ${token}`,
      });

      if (!res.status) {
        throw new Error('Failed to end shipment');
      }

      // Assuming the API response contains the updated shipment data
      const resp = await customerApi.getShipmentById(id!, {
        Authorization: `Bearer ${token}`,
      });

      if (!resp.status) {
        throw new Error('Failed to fetch data');
      }

      const data: Shipment = resp.data;
      setShipment(data);
    } catch (error) {
      console.error('Error ending shipment:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getShipmentById(id!, {
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }
        
        const data: Shipment = res.data;
        console.log('data ',res)
        setShipment(data);
        setOriginCoordinates(data.shipmentOrigin.coordinates);
        setDestinationCoordinates(data.shipmentDestination.coordinates);

        // Fetch and set driver details
        console.log('se', data.driver)
        const driverRes = await customerApi.getDriverById(data.driver, {
          Authorization: `Bearer ${token}`,
        });
        console.log('driver ', driverRes)
        if (driverRes.status) {
          setDriver(driverRes.data);
          console.log(driverRes.data)
        } else {
          console.error('Failed to fetch driver details:', driverRes.data.error);
        }

        // Fetch and set truck details
        const truckRes = await customerApi.getTruckById(data.truck, {
          Authorization: `Bearer ${token}`,
        });
        console.log('truck ', truckRes)
        if (truckRes.status) {
          setTruck(truckRes.data);
        } else {
          console.error('Failed to fetch truck details:', truckRes.data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);


  return (
    <>
      <PageBreadcrumb title="View Shipment Details" subName="Shipments" />
      <Row>
        <Col xl={12}>

          {shipment && originCoordinates && destinationCoordinates && (
            <Card >
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h2>Shipment Overview</h2>

                <p>
                  <span style={{ fontWeight: 'bold' }}>Status: </span>
                  <Badge
                    className={`bg-${shipment.shipmentStatus === 'pending'
                      ? 'danger'
                      : shipment.shipmentStatus === 'in transit'
                        ? 'primary'
                        : shipment.shipmentStatus === 'delivered'
                          ? 'success'
                          : ''
                      }`}
                  >
                    {shipment.shipmentStatus}
                  </Badge>
                </p>
               
              </Card.Header>
              <Card.Body>
                <div>

                  <Row>
                    <Col xl={6}>
                      <p><span style={{ fontWeight: 'bold' }}>Shipment Type:</span> {shipment.shipmentType}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Weight: </span>{shipment.shipmentWeight} kg</p>
                      <p><span style={{ fontWeight: 'bold' }}>Area: </span>{shipment.shipmentArea} </p>
                      <p><span style={{ fontWeight: 'bold' }}>Description: </span>{shipment.shipmentDescription}</p>
                    </Col>
                    <Col xl={6}>

                      <p><span style={{ fontWeight: 'bold' }}>Pickup Date:</span> {shipment.shipmentPickDate}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Delivery Date: </span>{shipment.shipmentDeliveryDate}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Cost: </span>RS. {shipment.shipmentCost}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Payment Method: </span>{shipment.paymentMethod}</p>
                    </Col>
                  </Row>
                </div>

                {/* <hr /> */}

                <div>
                  <h5>Shipment Details</h5>
                  <Row>
                    <Col xl={6}>
                      <p><span style={{ fontWeight: 'bold' }}>Origin: </span>{shipment.shipmentOrigin.location}</p>
                      {/* Add more destination details as needed */}
                    </Col>
                    <Col xl={6}>

                      <p><span style={{ fontWeight: 'bold' }}>Destination: </span>{shipment.shipmentDestination.location}</p>
                      {/* Add more origin details as needed */}
                    </Col>
                  </Row>
                </div>
                <div style={{ minHeight: '500px' }}>
                  {/* <hr /> */}
                  {/* <hr /> */}
                  {/* Add LeafletMap component with origin and destination coordinates */}
                  <LeafletMap
                    originCoordinates={shipment.shipmentOrigin.coordinates}
                    destinationCoordinates={shipment.shipmentDestination.coordinates}
                  />

                  {/* <hr /> */}
                </div>

                {/* <hr/> */}
               
                <div className="d-flex justify-content-between align-items-center">
    {shipment.shipmentStatus === 'in transit' && (
        <Button variant="primary" onClick={handleLiveTracking}>Track Shipment</Button>
    )}
    {location && (
        <Link to={`/customer/shipments/weather/${location.latitude}/${location.longitude}`}>
           <Button
    variant="primary"
    style={{
        backgroundColor: '#e6e6e6', // Lighter color
        borderColor: '#e6e6e6', // Same color as background
        color: '#333', // Text color
        marginLeft: '40px', // Add margin to create space between buttons
        transition: 'background-color 0.3s' // Smooth transition effect
    }}
    title="View Weather Conditions"
    onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#d9d9d9'} // Change color on hover
    onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#e6e6e6'} // Revert to original color on mouse out
>
    <RiSunCloudyFill size={24} /> View Weather Conditions
</Button>

        </Link>
    )}
</div>

                <hr />
                <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Driver Details</Accordion.Header>
                  <Accordion.Body>
                    {/* Driver details... */}
                    <div>
                  {/* <h5>Driver Details</h5> */}
                  <Row>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Driver Name: </span>
                        {driver?.name}
                      </p>
                      {/* Add more driver details as needed */}
                    </Col>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Driver Phone: </span>
                        {driver?.phone}
                      </p>
                      {/* Add more driver details as needed */}
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Driver Availability: </span>
                        <Badge
                          className={`bg-${driver?.availability ? 'success' : 'danger'}`}
                        >
                          {driver?.availability ? 'Available' : 'Not Available'}
                        </Badge>
                      </p>
                    </Col>
                  </Row>
                </div>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

               
                <hr />
                <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Truck Details</Accordion.Header>
                  <Accordion.Body>
                    {/* Truck details... */}
                    <div>
                  {/* <h5>Truck Details</h5> */}
                  <Row>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Truck Number: </span>
                        {truck?.truckNumber}
                      </p>
                      {/* Add more truck details as needed */}
                    </Col>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Truck Make: </span>
                        {truck?.make}
                      </p>

                      {/* Add more truck details as needed */}
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Truck Availability: </span>
                        <Badge
                          className={`bg-${truck?.availability ? 'success' : 'danger'}`}
                        >
                          {truck?.availability ? 'Available' : 'Not Available'}
                        </Badge>
                      </p>
                    </Col>
                  </Row>
                </div>
                {/* </hr> */}
                {/* <div> */}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
               
                  <hr />
                  <h5>Parties Involved</h5>
                  <Row>
                    <Col xl={6}>
                      <p><span style={{ fontWeight: 'bold' }}>Sender: </span>{shipment.sender.name}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Phone #: </span>{shipment.sender.phone}</p>
                    </Col>
                    <Col xl={6}>
                      <p><span style={{ fontWeight: 'bold' }}>Receiver: </span>{shipment.receiver.name}</p>
                      <p><span style={{ fontWeight: 'bold' }}>Phone #: </span>{shipment.receiver.phone}</p>
                    </Col>
                  </Row>
                {/* </div> */}

                {/* <hr /> */}

                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="primary"
                    onClick={handleStartShipment}
                    disabled={shipment.shipmentStatus !== 'pending'}
                  >
                    Start Shipment
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleEndShipment}
                    disabled={shipment.shipmentStatus === 'delivered' || shipment.shipmentStatus !== 'in transit'}
                  >
                    End Shipment
                  </Button>
                </Card.Footer>

              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};


const LeafletMap: React.FC<LeafletMapProps> = ({
  originCoordinates,
  destinationCoordinates,
}) => {
  return (
    <Card>

      <Card.Body>
        <div className="leaflet-map-container">
          <MapContainer
            center={originCoordinates}
            zoom={14}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
              positions={[originCoordinates, destinationCoordinates]}
              color="blue"
            />
            <Marker position={originCoordinates}>
              <Popup>Origin</Popup>
            </Marker>
            <Marker position={destinationCoordinates}>
              <Popup>Destination</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card.Body>
    </Card>
  );
};



export default ViewShipment;
