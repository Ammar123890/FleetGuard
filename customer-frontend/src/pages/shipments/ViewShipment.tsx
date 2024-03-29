import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { RiSunCloudyFill, RiRoadMapFill } from 'react-icons/ri';
// import { LatLngExpression } from 'leaflet';
import polyline from 'google-polyline';

import axios from 'axios';


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
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

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
        console.log('data ', res)
        setShipment(data);
        const pickup_date = new Date(data.shipmentPickDate);
        const formattedDate1 = pickup_date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const delivery_date = new Date(data.shipmentDeliveryDate);
        const formattedDate2 = delivery_date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        console.log('pickup date', formattedDate1);
        
        setPickupDate(formattedDate1)
        setDeliveryDate(formattedDate2)
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
                <h2>Shipment Logistics Dashboard</h2>

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
                <div className='mt-4'>

                  <Row>
                  <Col xl={5}> {/* Sidebar Column */}
                      <Card className="shadow p-2 mb-2 rounded" style={{ backgroundColor: '#E2F7E6' }} >
                        <Card.Body>
                        <Card.Header className="d-flex justify-content-between align-items-center"  style={{ backgroundColor: 'transparent' }}>
                        <h4 style={{ marginRight: '10px', marginLeft: '-30px' }}>Shipment Details</h4>
                          <p style={{ marginRight: '-30px' }}><Badge bg="purple" className="text-white">{shipment.shipmentType}</Badge></p>
                        </Card.Header>
                        
                          {/* <hr></hr> */}
                      <p><span style={{ fontWeight: 'bold', marginRight: '60px' }}>Shipment Weight: </span>{shipment.shipmentWeight} kg</p>
                      <p><span style={{ fontWeight: 'bold', marginRight: '80px' }}>Shipment Area: </span>{shipment.shipmentArea} </p>
                      
                      <p><span style={{ fontWeight: 'bold', marginRight: '80px' }}>Shipment Cost: </span><mark> RS. {shipment.shipmentCost}</mark></p>
                      <p><span style={{ fontWeight: 'bold', marginRight: '70px' }}>Payment Method: </span>{shipment.paymentMethod}</p>
                      <p><span style={{ fontWeight: 'bold', marginRight: '80px' }}>Description: </span>{shipment.shipmentDescription}</p>
                        </Card.Body>
                      </Card>

                    </Col>
                      <Col xl = {1}></Col>
                    <Col xl={5}>
                      
                      <p style={{marginTop: '20px'}}><span style={{ fontWeight: 'bold' , marginRight: '50px'}}>Pickup Date:</span> {pickupDate} </p>
                      <p><span style={{ fontWeight: 'bold', marginRight: '40px' }}>Delivery Date: </span>{deliveryDate}</p>
                      {/* <p style={{marginTop: '40px'}}><span style={{ fontWeight: 'bold', marginRight: '40px' }}>Shipment Type:</span> <Badge bg="purple" className="text-white">{shipment.shipmentType}</Badge></p> */}
                      <hr></hr>
                      
                      {/* <Row>
                    <Col xl={6}> */}
                      <p><span style={{ fontWeight: 'bold', marginRight: '30px' }}> Shipment Origin: </span></p><p>{shipment.shipmentOrigin.location}</p>
                      {/* Add more destination details as needed */}
                    {/* </Col>
                    <Col xl={6}> */}

                      <p><span style={{ fontWeight: 'bold', marginRight: '30px' }}>Shipment Destination: </span></p><p>{shipment.shipmentDestination.location}</p>
                      {/* Add more origin details as needed */}
                    {/* </Col>
                  </Row> */}
                    </Col>
                    {/* <Col xl={6}> */}
                 
                    <Col xl = {2}>
                      <Card></Card>
                    </Col>
                  </Row>
                </div>

                {/* <hr /> */}
{/* 
                <div>
                  <h5>Shipment Details</h5>
                  <Row>
                    <Col xl={6}>
                      <p><span style={{ fontWeight: 'bold' }}>Origin: </span>{shipment.shipmentOrigin.location}</p>
                      
                    </Col>
                    <Col xl={6}>

                      <p><span style={{ fontWeight: 'bold' }}>Destination: </span>{shipment.shipmentDestination.location}</p>
                    
                    </Col>
                  </Row>
                </div> */}



                {/* </Col> */}

                <div style={{ minHeight: '500px' }}>
                  <Row>
                    <Col xl = {10}><h3>Route Analysis</h3>
                    </Col>
                  <Col xl = {2}> 
                  {shipment.shipmentStatus === 'in transit' && (
                    <Button variant="primary" onClick={handleLiveTracking}>Track Shipment</Button>
                  )}
                  </Col>
                 
                  </Row>
                  
                  <LeafletMap
                    originCoordinates={shipment.shipmentOrigin.coordinates}
                    destinationCoordinates={shipment.shipmentDestination.coordinates}
                  />
                </div>

                {/* <hr/> */}

                <div className="d-flex justify-content-end align-items-center">
                  
                 <ButtonGroup className="mb-2 me-1">

                 
                  {location && (
                    <Link to={`/customer/shipments/weather/${location.latitude}/${location.longitude}`}>
                      <Button
                        variant="light"
                        style={{
                          backgroundColor: '#e6e6e6', // Lighter color
                          borderColor: '#e6e6e6', // Same color as background
                          color: '#333', // Text color
                          marginLeft: '20px', // Add margin to create space between buttons
                          transition: 'background-color 0.3s', // Smooth transition effect
                          borderRadius: '0',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        title="View Weather Conditions"
                        onMouseOver={(e: any) => (e.target as HTMLElement).style.backgroundColor = '#d9d9d9'} // Change color on hover
                        onMouseOut={(e: any) => (e.target as HTMLElement).style.backgroundColor = '#e6e6e6'} // Revert to original color on mouse out
                      >
                        <RiSunCloudyFill size={24} /> View Weather Conditions
                      </Button>
                      </Link> 
                      )}
                      {location && (
                      <Link to={`/customer/shipments/roadConditions/${location.latitude}/${location.longitude}`}>
              <Button variant="light"
                        style={{
                          backgroundColor: '#e6e6e6', // Lighter color
                          borderColor: '#e6e6e6', // Same color as background
                          color: '#333', // Text color
                           // Add margin to create space between buttons
                          transition: 'background-color 0.3s', // Smooth transition effect
                          borderRadius: '0',
                          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        title="View Weather Conditions"
                        onMouseOver={(e: any) => (e.target as HTMLElement).style.backgroundColor = '#d9d9d9'} // Change color on hover
                        onMouseOut={(e: any) => (e.target as HTMLElement).style.backgroundColor = '#e6e6e6'} // Revert to original color on mouse out
                      > <RiRoadMapFill size={24} />View Road Conditions</Button>
            </Link>
                   
                    
                  )}
                  </ButtonGroup>
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
// type LatLngExpression = [number, number];

// const LeafletMap: React.FC<LeafletMapProps> = ({

//   originCoordinates,
//   destinationCoordinates,

// }) => {


// const calculateDistance = async (origin: [number, number], destination: [number, number]): Promise<number> => {
//   try {
//       const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=false`;

//       const response = await axios.get(url);

//       // Check if response is successful
//       if (response.data.code === 'Ok') {
//           const distance = response.data.routes[0].distance; // Distance in meters
//           return distance;
//       } else {
//           throw new Error('Failed to calculate distance');
//       }
//   } catch (error) {
//       console.error('Error calculating distance:', error);
//       throw error;
//   }
// };

//   // const calculateDistance = (origin: LatLngExpression, destination: LatLngExpression): number => {

//   //   const [lat1, lon1] = origin;
//   //   const [lat2, lon2] = destination;
//   //   const R = 6371e3; // Radius of the Earth in meters
//   //   const φ1 = (lat1 * Math.PI) / 180;
//   //   const φ2 = (lat2 * Math.PI) / 180;
//   //   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   //   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   //   const a =
//   //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//   //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   //   return R * c; // Distance in meters
//   // };

//   // const distance = originCoordinates && destinationCoordinates
//   //   ? calculateDistance(originCoordinates, destinationCoordinates)
//   //   : null;


//     const origin: [number, number] = [51.5074, -0.1278]; // London
// const destination: [number, number] = [48.8566, 2.3522]; // Paris

// calculateDistance(origin, destination)
//     .then(distance => {
//         console.log('Distance:', distance, 'meters');
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

//   return (
//     <Card>

//       <Card.Body>
//         <div className="leaflet-map-container">
//           <MapContainer
//             center={originCoordinates}
//             zoom={14}
//             style={{ height: '400px', width: '100%' }}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <Polyline
//               positions={[originCoordinates, destinationCoordinates]}
//               color="blue"
//             />
//             <Marker position={originCoordinates}>
//               <Popup>Origin</Popup>
//             </Marker>
//             <Marker position={destinationCoordinates}>
//               <Popup>Destination</Popup>
//             </Marker>
//           </MapContainer>

//         </div>

//          {/* Display the distance */}
//          <p>Distance: {distance ? `${(distance / 1000).toFixed(2)} km` : 'Calculating...'}</p>
//       </Card.Body>
//     </Card>
//   );
// };




interface Route {
  path: [number, number][];
  distance: number;
  duration: string;
  startingPoint: [number, number];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ originCoordinates, destinationCoordinates }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number>(0); // Initialize to the first route
  
  useEffect(() => {
    const calculateRoute = async (start: [number, number], end: [number, number]): Promise<Route[]> => {
      const url = `https://router.project-osrm.org/route/v1/driving--hgv/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&alternatives=true`;
      const response = await axios.get(url);

      if (response.data.code === 'Ok') {
        const routesData = response.data.routes.map((route: any) => {
          const encodedPolyline = route.geometry;
          const decodedPolyline = polyline.decode(encodedPolyline);
          const distanceInMeters = route.distance;
          const durationInSeconds = route.duration;
          console.log('reee ', response.data)
          // Convert duration from seconds to hours and minutes
          const hours = Math.floor(durationInSeconds / 3600);
          const minutes = Math.floor((durationInSeconds % 3600) / 60);
          const formattedDuration = `${hours}h ${minutes}m`;

          return { path: decodedPolyline, distance: distanceInMeters, duration: formattedDuration, startingPoint: decodedPolyline[0] };
        });

        return routesData;
      } else {
        throw new Error('Failed to calculate distance');
      }
    };

    const requests = [originCoordinates, destinationCoordinates].map((coordinates, index) => {
      const start = index === 0 ? coordinates : originCoordinates;
      const end = index === 1 ? coordinates : destinationCoordinates;

      return calculateRoute(start, end);
    });

    Promise.all(requests)
      .then(allRoutes => {
        // Flatten the array of arrays into a single array of routes
        const flattenedRoutes = allRoutes.flat();
        setRoutes(flattenedRoutes);
        console.log('rputes', flattenedRoutes)
      })
      .catch(error => {
        console.error('Error calculating routes:', error);
      });
  }, [originCoordinates, destinationCoordinates]);

  const switchRoute = () => {
    setSelectedRoute((prevRoute) => (prevRoute + 1) % routes.length);
  };

  const currentRoute = routes[selectedRoute];

  return (
    <Card>
      <Card.Body>
        <div style={{ marginBottom: '20px' }}>
          <MapContainer
            center={originCoordinates}
            zoom={9}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {currentRoute && (
              <>
                <Polyline positions={currentRoute.path} color="blue" weight={3} />
                <Marker position={currentRoute.startingPoint}>
                  <Popup>Origin</Popup>
                </Marker>
              </>
            )}

            <Marker position={destinationCoordinates}>
              <Popup>Destination</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Button variant="outline-primary" onClick={switchRoute} style={{ flexShrink: 0 }}>
            Switch Route
          </Button>

          {currentRoute && (
            <div 
              style={{ 
                display: 'flex',
                flexDirection: 'column',  // Align children vertically
                alignItems: 'center',     // Center-align items
                marginLeft: 'auto'        // Push the container to the center
              }}
            >
              <p style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' , marginLeft: '-200px', marginRight: '90px'}}>
                Distance:<span style={{ marginLeft: '30px'}}> {(currentRoute.distance / 1000).toFixed(2)} km</span>
              </p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '-200px', marginRight: '90px' }}>
                Duration:<span style={{ marginLeft: '30px'}}>{currentRoute.duration}</span> 
              </p>
            </div>
          )}
        </div>

      </Card.Body>
    </Card>
  );
};




export default ViewShipment;
