import { Card, Col, Row, Table, Form } from 'react-bootstrap';

interface CostEstimation {
    truckType: string;
    labourCost: {
      driver: {
        salary: number;
        foodPerDay: number;
        quantity: number;
        total: number;
      };
      assistant: {
        salary: number;
        foodPerDay: number;
        quantity: number;
        total: number;
      };
      totalDistanceTravelledPerMonth: number;
      labourCostPerKm: number;
    };
    fuelCost: {
      totalDistance: number;
      totalFuel: number;
      mileage: number;
      fuelCostPerLitre: number;
      fuelCostPerKm: number;
    };
    routineMaintenanceCost: {
      oilChange: {
        litres: number;
        unitCost: number;
        total: number;
      };
      filtersChange: {
        unitCost: number;
        quantity: number;
        total: number;
      };
      vehicleService: {
        unitCost: number;
        quantity: number;
        total: number;
      };
      airCheck: {
        unitCost: number;
        quantity: number;
        total: number;
      };
      routineMaintenanceWorkDoneAfterKms: number;
    };
    tireCost: {
      tireCost: number;
      averageLifeOfTiresKms: number;
      tireCostPerKm: number;
    };
    repairCostPerKm: {
      averageRepairCost: number;
      numberOfKilometers: number;
      averageRepairCostPerKm: number;
    };
    miscellaneousCostPerKm: {
      tollTaxes: number;
      policeCost: number;
      miscCostPerKm: number;
    };
    summary: {
      labourCost: number;
      fuelCost: number;
      routineMaintenanceCost: number;
      tireCostPerKm: number;
      repairCostPerKm: number;
      miscCostPerKm: number;
      vocPerKm: number;
    };
  }
  

  
const CostEstimation = () => {
    return (
        <>
         {/* Heading for the entire table */}
         {/* <Row className="mb-4">
                <Col>
                    <h2>Vehicle Operating Cost</h2>
                </Col>
            </Row> */}
          <Row className="mb-4 mt-4">
                <Col>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Vehicle Operating Cost</h2>
                </Col>
            </Row>

            {/* 1. Labour Cost (5x5) */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Labour Cost</h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                        
                                        <th colSpan={2} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Labour Cost</th>
                                        <th style={{textAlign: 'center'}}>Salary (per month)</th>
                                        <th style={{textAlign: 'center'}}>Food (per day)</th>
                                        <th style={{textAlign: 'center'}}>Quantity</th>
                                        <th style={{textAlign: 'center'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Driver</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Driver Assistant</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Total Distance travelled per month</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td style={{textAlign: 'center'}} colSpan={4}><strong>Labour cost per km (RS.)</strong></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
        
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 2. Fuel Cost (6x3) */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Fuel Cost</h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                
                                        <th colSpan={3} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Fuel Cost</th>
                                       
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Total Distance (Km)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Total Fuel (Ltrs)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Milage (Km/Ltr)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td ><strong>Fuel Cost Per Litre</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td ><strong>Fuel Cost Per Km (Rs.)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 3. Routine Maintenance Cost */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Routine Maintenance Cost</h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                        
                                        <th colSpan={2} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Routine Maintenance Cost</th>
                                        <th style={{textAlign: 'center'}}>Unit Cost</th>
                                        <th style={{textAlign: 'center'}}>No. of Units</th>
                                        
                                        <th style={{textAlign: 'center'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Oil Change (Litres)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Filters Change (Oil+Air)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Vehicle Service</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td ><strong>Air Check (Tyres)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td ><strong>Routine Maintenance work done after -- Kms</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="105" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        
                                        <td style={{textAlign: 'center'}} colSpan={4}><strong></strong></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
        
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 4. Tire Cost per km */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Tire Cost per km </h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                    
                                        <th colSpan={2} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Tire Cost per km</th>
                                        <th style={{textAlign: 'center'}}>Unit Cost</th>
                                        <th style={{textAlign: 'center'}}>No. of Units</th>
                                        
                                        <th style={{textAlign: 'center'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Tire Cost</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Average Life of Tires (Kms)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                
                                    <tr>
                                      
                                        <td style={{textAlign: 'center'}} colSpan={4}><strong>Tire Cost Per Km (Rs.)</strong></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
        
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 5. Repair Cost per km */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Repair Cost per km</h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                        
                                        <th colSpan={2} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Repair Cost per km</th>
                                        <th style={{textAlign: 'center'}}>Unit Cost</th>
                                     
                                        <th style={{textAlign: 'center'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Average Repair Cost (Rs.)</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>No of Kilometers</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                    </tr>
                                    
                                    <tr>
                                        
                                        <td style={{textAlign: 'center'}} colSpan={3}><strong>Average Repair Cost Per Km</strong></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
        
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* 6. Misc. Cost per km */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#007BFF', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Misc. Cost per km</h4>
                           
                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                        
                                        <th colSpan={2} style={{textAlign: 'center', backgroundColor: '#e1f5fe', color: '#1a237e'}}>Misc. Cost per km</th>
                                        <th style={{textAlign: 'center'}}>Unit Cost</th>
                                        <th style={{textAlign: 'center'}}>No of Kms</th>
                                        <th style={{textAlign: 'center'}}>Cost Per Km</th>
                              
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Toll Texes</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Police Cost</strong></td>
                                        <td><Form.Control type="number" defaultValue="120" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td><Form.Control type="number" defaultValue="110" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                       
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
                                  
                                    <tr>
                                        
                                        <td style={{textAlign: 'center'}} colSpan={4}><strong>Misc. Cost Per Km</strong></td>
                                        
                                        <td><Form.Control type="number" defaultValue="115" style={{ width: '100%', borderRadius: '4px',  backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                    </tr>
        
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CostEstimation;
