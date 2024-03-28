import { SetStateAction, useState, useEffect } from 'react';
import { Card, Col, Row, Button, ProgressBar, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { customerApi } from '@/common';

const CostEstimate = () => {
    const location = useLocation();
    
    const { 
        shipmentWeight, 
        shipmentArea, 
        shipmentPickDate, 
        shipmentDeliveryDate, 
        selectedTruckId, 
        selectedDriverId, 
        coordinatesDest, 
        coordinatesOrigin,
        selectedTruckType,
    } = location.state || {};

    const [distance, setDistance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false); // Define the loading state
    const [costEstimation, setCostEstimation] = useState<any | null>(null); // Define the costEstimation state
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Define the errorMessage state

    const navigate = useNavigate();
    useEffect(() => {
        const fetchDistanceAndCostEstimation = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
        
                const url = `https://router.project-osrm.org/route/v1/driving--hgv/${coordinatesOrigin.lng},${coordinatesOrigin.lat};${coordinatesDest.lng},${coordinatesDest.lat}?overview=full&alternatives=true`;
                const distanceResponse = await axios.get(url);
        
                if (distanceResponse.data.code === 'Ok') {
                    const distanceInMeters = distanceResponse.data.routes[0].distance;
                    const distanceInKm = distanceInMeters / 1000;
                    setDistance(distanceInKm);
        
                    const response = await customerApi.estimateCost(
                        selectedTruckType,
                        distanceInKm,
                        {
                            Authorization: `Bearer ${token}`,
                        }
                    );
        
                    if (response.data) {
                        setCostEstimation(response.data);
                        setErrorMessage(null);
                    } else {
                        setErrorMessage('Failed to fetch cost estimation data. Please try again.');
                        // setCostEstimation(null);
                    }
                } else {
                    throw new Error('Failed to calculate distance');
                }
            } catch (error) {
                console.error('API Error:', error);
                setErrorMessage('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        if (coordinatesOrigin && coordinatesDest && selectedTruckType) {
            fetchDistanceAndCostEstimation();
        }
    }, [coordinatesOrigin, coordinatesDest, selectedTruckType]);
    

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
                coordinatesOrigin,
                distance,
                costEstimation  // Pass the cost estimation data to the next page
            },
        });
    };

    return (
        <>
            <Card>
                <Card.Header>
                    <h4 className="header-title mb-0">Shipment Location</h4>
                    <ProgressBar style={{ height: 5, marginBottom: '30px', marginTop: '30px' }} now={80} animated className="progress" />
                </Card.Header>
                <Card.Body>
                    <Row>
                        {/* Display the calculated distance */}
                        {distance && (
                            <Col>
                                <p>Distance from Origin to Destination: {distance.toFixed(2)} km</p>
                            </Col>
                        )}
</Row>
<Row>
                        {/* Display the cost estimation summary */}
                        {costEstimation && (
                            <Col>
                                <h5>Cost Estimation Summary</h5>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Labour Cost</td>
                                            <td>{costEstimation.labourCost}</td>
                                        </tr>
                                        <tr>
                                            <td>Fuel Cost</td>
                                            <td>{costEstimation.fuelCost}</td>
                                        </tr>
                                        <tr>
                                            <td>Routine Maintenance Cost</td>
                                            <td>{costEstimation.routineMaintenanceCost}</td>
                                        </tr>
                                        <tr>
                                            <td>Repair Cost</td>
                                            <td>{costEstimation.repairCost}</td>
                                        </tr>
                                        <tr>
                                            <td>Tire Cost</td>
                                            <td>{costEstimation.tireCost}</td>
                                        </tr>
                                        <tr>
                                            <td>Miscellaneous Cost</td>
                                            <td>{costEstimation.miscCost}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Cost</strong></td>
                                            <td><strong>{costEstimation.totalCost}</strong></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
                <Card.Footer style={{ marginBottom: '30px' }}>
                    <Row className="mt-4">
                        <Col>
                            <li className="next list-inline-item float-end">
                                <Button variant="primary" onClick={handleNextPage}>
                                    Complete Shipment Details
                                </Button>
                            </li>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    );
};

export default CostEstimate;
