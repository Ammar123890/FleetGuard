import { Card, Col, Row, Table, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { customerApi } from '@/common';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

interface CostEstimationData {
    truckType: string;
    labourCost: {
        driverSalary: {
            perDay: number;
            perMonth: number;
            quantity: number;
            total: number;
        };
        assistantSalary: {
            perDay: number;
            perMonth: number;
            quantity: number;
            total: number;
        };
        totalDistanceTravelledPerMonth: number;
        costPerKm: number;
    };
    fuelCost: {
        totalDistance: number;
        totalFuel: number;
        mileage: number;
        fuelCostPerLitre: number;
        costPerKm: number;
    };
    routineMaintenanceCost: {
        oilChange: {
            numberOfUnits: number;
            unitCost: number;
            total: number;
        };
        filtersChange: {
            unitCost: number;
            numberOfUnits: number;
            total: number;
        };
        vehicleService: {
            unitCost: number;
            numberOfUnits: number;
            total: number;
        };
        airCheck: {
            unitCost: number;
            numberOfUnits: number;
            total: number;
        };
        routineMaintenanceDoneAfterKm: {
            total: number;
            unitCost: number;
        };
        costPerKm: number;
    };
    tireCostPerKm: {
        tireCost: {
            unitCost: number;
            numberOfUnits: number;
            total: number;
        };
        averageLifeOfTires: {
            unitCost: number;
            numberOfUnits: number;
            total: number;
        };
        costPerKm: number;
    };
    repairCostPerKm: {
        averageRepairCost: number;
        numberOfKilometers: number;
        costPerKm: number;
    };
    miscCostPerKm: {
        tollTaxes: {
            unitCost: number;
            numberOfKms: number;
            total: number;
        };
        policeCost: {
            unitCost: number;
            numberOfKms: number;
            total: number;
        };
        costPerKm: number;
    };
    summary: {
        labourCost: number;
        fuelCost: number;
        routineMaintenanceCost: number;
        tireCostPerKm: number;
        repairCostPerKm: number;
        miscCostPerKm: number;
        VOCPerKm: number;
    };
}

const CostEstimation = () => {
    const [costEstimationData, setCostEstimationData] = useState<CostEstimationData>({
        truckType: '',
        labourCost: {
            driverSalary: {
                perDay: 0,
                perMonth: 0,
                quantity: 0,
                total: 0,
            },
            assistantSalary: {
                perDay: 0,
                perMonth: 0,
                quantity: 0,
                total: 0,
            },
            totalDistanceTravelledPerMonth: 0,
            costPerKm: 0,
        },
        fuelCost: {
            totalDistance: 0,
            totalFuel: 0,
            mileage: 0,
            fuelCostPerLitre: 0,
            costPerKm: 0,
        },
        routineMaintenanceCost: {
            oilChange: {
                numberOfUnits: 0,
                unitCost: 0,
                total: 0,
            },
            filtersChange: {
                unitCost: 0,
                numberOfUnits: 0,
                total: 0,
            },
            vehicleService: {
                unitCost: 0,
                numberOfUnits: 0,
                total: 0,
            },
            airCheck: {
                unitCost: 0,
                numberOfUnits: 0,
                total: 0,
            },
            routineMaintenanceDoneAfterKm: {
                total: 0,
                unitCost: 0,
            },
            costPerKm: 0,
        },
        tireCostPerKm: {
            tireCost: {
                unitCost: 0,
                numberOfUnits: 0,
                total: 0,
            },
            averageLifeOfTires: {
                unitCost: 0,
                numberOfUnits: 0,
                total: 0,
            },
            costPerKm: 0,
        },
        repairCostPerKm: {
            averageRepairCost: 0,
            numberOfKilometers: 0,
            costPerKm: 0,
        },
        miscCostPerKm: {
            tollTaxes: {
                unitCost: 0,
                numberOfKms: 0,
                total: 0,
            },
            policeCost: {
                unitCost: 0,
                numberOfKms: 0,
                total: 0,
            },
            costPerKm: 0,
        },
        summary: {
            labourCost: 0,
            fuelCost: 0,
            routineMaintenanceCost: 0,
            tireCostPerKm: 0,
            repairCostPerKm: 0,
            miscCostPerKm: 0,
            VOCPerKm: 0,
        },
      });
      
    const [truckType, setTruckType] = useState<string>("2-3 Axle");  // default value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                console.log('trucktyoe', truckType)
                const response = await customerApi.getCostEstimation(headers, truckType); // passing truckType to API call
                console.log('rrrr', response)

                console.log('qqq')
                if (!response) {
                    
                    throw new Error('Failed to fetch data');
                }
                setCostEstimationData(response.data);
                console.log(response.data)
            } catch (error) {
                console.log('dd')
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [truckType]);  // fetch data whenever truckType changes

    const handleInputChange = (
        value: number,
        field: keyof CostEstimationData['labourCost']['assistantSalary'],
        category: string,
    ) => {
        let updatedLabourCostData = { ...costEstimationData?.labourCost };
    
        // Update the relevant fields
        if (category === 'driver') {
            const updatedDriverData = {
                ...costEstimationData?.labourCost.driverSalary,
            };
    
            if (field === 'perMonth' || field === 'perDay' || field === 'quantity') {
                updatedDriverData[field] = value;
                const val = updatedDriverData.perMonth + (updatedDriverData.perDay * updatedDriverData.quantity * 30);
                updatedDriverData.total = val;
                updatedLabourCostData.driverSalary = updatedDriverData;
            }
        } else if (category === 'assistant') {
            const updatedAssistantData = {
                ...costEstimationData?.labourCost.assistantSalary,
            };
    
            if (field === 'perMonth' || field === 'perDay' || field === 'quantity') {
                updatedAssistantData[field] = value;
                updatedAssistantData.total = updatedAssistantData.perMonth + (updatedAssistantData.perDay * updatedAssistantData.quantity * 30);
                updatedLabourCostData.assistantSalary = updatedAssistantData;
            }
        }
    
        updatedLabourCostData.costPerKm = (updatedLabourCostData.driverSalary.total + updatedLabourCostData.assistantSalary.total) / updatedLabourCostData.totalDistanceTravelledPerMonth;
        console.log(updatedLabourCostData)
        const updatedData = {
            ...costEstimationData,
            labourCost: updatedLabourCostData,
        };
    
        setCostEstimationData(updatedData);
    };
    
    const handleInputChangeFuelCost = (
        value: number,
        field: keyof CostEstimationData['fuelCost'],
        category: string,
    ) => {
        const updatedFuelCostData = {
            ...costEstimationData?.fuelCost,
        };
    
    console.log('valueee', field)
        // Update the relevant fields

            if (field === 'totalDistance' || field === 'totalFuel'|| field === 'fuelCostPerLitre'){
                console.log(value)
                updatedFuelCostData[field] = value;
                updatedFuelCostData.mileage = updatedFuelCostData.totalDistance/updatedFuelCostData.totalFuel;
                updatedFuelCostData.costPerKm = updatedFuelCostData.fuelCostPerLitre/updatedFuelCostData.mileage;
        
            }
        
        const updatedData = {
            ...costEstimationData,
            fuelCost: {
                ...updatedFuelCostData,
               
            },
        };
    
        setCostEstimationData(updatedData);
    };
    
    const handleInputChangeRoutineCost = (
        value: number,
        field: keyof CostEstimationData['routineMaintenanceCost']['oilChange'],
        category: string,
    ) => {
        const updatedRoutineCostData = {
            ...costEstimationData?.routineMaintenanceCost,
        };
    
        const updatedOilChangeData = {
            ...costEstimationData?.routineMaintenanceCost.oilChange,
        };
    
        const updatedFiltersChangeData = {
            ...costEstimationData?.routineMaintenanceCost.filtersChange,
        };
    
        const updatedVehicleServiceData = {
            ...costEstimationData?.routineMaintenanceCost.vehicleService,
        };
    
        const updatedAirCheckData = {
            ...costEstimationData?.routineMaintenanceCost.airCheck,
        };
    
        // Update the relevant fields
        if (category === 'oilChange') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedOilChangeData[field] = value;
                updatedOilChangeData.total = updatedOilChangeData.numberOfUnits * updatedOilChangeData.unitCost;
            }
        } else if (category === 'filtersChange') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedFiltersChangeData[field] = value;
                updatedFiltersChangeData.total = updatedFiltersChangeData.numberOfUnits * updatedFiltersChangeData.unitCost;
            }
        } else if (category === 'vehicleService') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedVehicleServiceData[field] = value;
                updatedVehicleServiceData.total = updatedVehicleServiceData.numberOfUnits * updatedVehicleServiceData.unitCost;
            }
        } else if (category === 'airCheck') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedAirCheckData[field] = value;
                updatedAirCheckData.total = updatedAirCheckData.numberOfUnits * updatedAirCheckData.unitCost;
            }
        }
    
        updatedRoutineCostData.routineMaintenanceDoneAfterKm.total = updatedOilChangeData.total + updatedFiltersChangeData.total + updatedVehicleServiceData.total + updatedAirCheckData.total;
        updatedRoutineCostData.costPerKm = updatedRoutineCostData.routineMaintenanceDoneAfterKm.total/updatedRoutineCostData.routineMaintenanceDoneAfterKm.unitCost;
        
        const updatedData = {
            ...costEstimationData,
            routineMaintenanceCost: {
                ...updatedRoutineCostData,
                oilChange: updatedOilChangeData,
                filtersChange: updatedFiltersChangeData,
                vehicleService: updatedVehicleServiceData,
                airCheck: updatedAirCheckData,
            },
        };
    
        setCostEstimationData(updatedData);
    };
    
    const handleInputChangeTireCost = (
        value: number,
        field: keyof CostEstimationData['tireCostPerKm']['tireCost'],
        category: string,
    ) => {
        const updatedTireCostPerKmData = {
            ...costEstimationData?.tireCostPerKm,
        };
    
        // Update the relevant fields
        if (category === 'tireCost') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedTireCostPerKmData.tireCost[field] = value;
                updatedTireCostPerKmData.tireCost.total = updatedTireCostPerKmData.tireCost.numberOfUnits * updatedTireCostPerKmData.tireCost.unitCost;
            }
        } else if (category === 'averageLifeOfTires') {
            if (field === 'numberOfUnits' || field === 'unitCost') {
                updatedTireCostPerKmData.averageLifeOfTires[field] = value;
                updatedTireCostPerKmData.averageLifeOfTires.total = updatedTireCostPerKmData.averageLifeOfTires.numberOfUnits * updatedTireCostPerKmData.averageLifeOfTires.unitCost;
            }
        }
    
        updatedTireCostPerKmData.costPerKm = updatedTireCostPerKmData.tireCost.total / updatedTireCostPerKmData.averageLifeOfTires.total;
    
        const updatedData = {
            ...costEstimationData,
            tireCostPerKm: updatedTireCostPerKmData,
        };
    
        setCostEstimationData(updatedData);
    };
    
    const handleInputChangeRepairCost = (
        value: number,
        field: keyof CostEstimationData['repairCostPerKm'],
    ) => {
        const updatedRepairCostPerKmData = {
            ...costEstimationData?.repairCostPerKm,
        };
    
        // Update the relevant fields
        if (field === 'averageRepairCost' || field === 'numberOfKilometers') {
            updatedRepairCostPerKmData[field] = value;
        }
    
        // Calculate the cost per km
        updatedRepairCostPerKmData.costPerKm = updatedRepairCostPerKmData.averageRepairCost / updatedRepairCostPerKmData.numberOfKilometers;
    
        const updatedData = {
            ...costEstimationData,
            repairCostPerKm: updatedRepairCostPerKmData,
        };
    
        setCostEstimationData(updatedData);
    };
    
    const handleInputChangeMiscCost = (
        value: number,
        field: keyof CostEstimationData['miscCostPerKm']['tollTaxes'] | keyof CostEstimationData['miscCostPerKm']['policeCost'],
        category: string,
    ) => {
        const updatedMiscCostPerKmData = {
            ...costEstimationData?.miscCostPerKm,
        };
    
        // Update the relevant fields
        if(category === 'tollTaxes'){
            if (field === 'unitCost' || field === 'numberOfKms') {
                updatedMiscCostPerKmData.tollTaxes[field] = value;
                updatedMiscCostPerKmData.tollTaxes.total = updatedMiscCostPerKmData.tollTaxes.unitCost/updatedMiscCostPerKmData.tollTaxes.numberOfKms;
            }
        } else if(category === 'policeCost'){
            if (field === 'unitCost' || field === 'numberOfKms') {
                updatedMiscCostPerKmData.policeCost[field] = value;
                updatedMiscCostPerKmData.policeCost.total = updatedMiscCostPerKmData.policeCost.unitCost/updatedMiscCostPerKmData.policeCost.numberOfKms;
                
            }
        }
    
    
        // Calculate the cost per km
        updatedMiscCostPerKmData.costPerKm = (updatedMiscCostPerKmData.tollTaxes.total + updatedMiscCostPerKmData.policeCost.total);
    
        const updatedData = {
            ...costEstimationData,
            miscCostPerKm: updatedMiscCostPerKmData,
        };
    
        setCostEstimationData(updatedData);
    };

    
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            
            // Call your update API passing the entire object as body
            const response = await customerApi.updateCostEstimation(headers, costEstimationData, truckType);
            
            if (!response) {
                throw new Error('Failed to save data');
            }
            
            // Handle success
            console.log('Data saved successfully:', response);
            toast.success('Cost estimation updated successfully!');

        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Failed to update cost estimation. Please try again.');

        }
    };

    const handleTruckTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTruckType(event.target.value);  // update truckType state
    };
    return (
        <>

            <Row className="mb-4 mt-4">
                <Col>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Vehicle Operating Cost</h2>
                </Col>
            </Row>
            <ToastContainer />
            {/* <Overview/> */}
            {/* Dropdown for truck types */}
            <Row className="mb-4">
                <Col md={{ span: 4, offset: 4 }}>
                    <Form.Select value={truckType} onChange={handleTruckTypeChange}>
                        <option value="2-3 Axle">2-3 Axle</option>
                        <option value="4-5 Axle">4-5 Axle</option>
                        <option value="6 Axle">6 Axle</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mb-4">
               
                <Link to={'/customer/cost-overview'}>
              <Button className="mt-3" variant="primary">Graphical Overview</Button>
            </Link>
            </Row>
            {/* 1. Labour Cost (5x5) */}
            <Row>
                <Col>
                    <Card style={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Labour Cost</h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>

                                        <th colSpan={2} style={{ textAlign: 'center'}}>Labour Cost</th>
                                        <th style={{ textAlign: 'center' }}>Salary (per month)</th>
                                        <th style={{ textAlign: 'center' }}>Salary (per day)</th>
                                        <th style={{ textAlign: 'center' }}>Quantity</th>
                                        <th style={{ textAlign: 'center' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td><strong>Driver</strong></td>
                                        
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="number" value={costEstimationData?.labourCost.driverSalary.perMonth}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'perMonth', 'driver')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="number" value={costEstimationData?.labourCost.driverSalary.perDay}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'perDay', 'driver')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}> 
                                            <input type="number" value={costEstimationData?.labourCost.driverSalary.quantity}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'quantity', 'driver')} 
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.labourCost.driverSalary.total}</td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Driver Assistant</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="number" value={costEstimationData?.labourCost.assistantSalary.perMonth}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'perMonth', 'assistant')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="number" value={costEstimationData?.labourCost.assistantSalary.perDay}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'perDay', 'assistant')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}> 
                                            <input type="number" value={costEstimationData?.labourCost.assistantSalary.quantity}
                                                onChange={(e) => handleInputChange(Number(e.target.value), 'quantity', 'assistant')} 
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }} /></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.labourCost.assistantSalary.total}</td>
                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Total Distance travelled per month</strong></td>
                                        <td colSpan={2} style={{ textAlign: 'center' }}></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.labourCost.totalDistanceTravelledPerMonth} km</td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.labourCost.totalDistanceTravelledPerMonth} km</td>
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td style={{ textAlign: 'center' }} colSpan={4}><strong>Labour cost per km (RS.)</strong></td>

                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.labourCost.costPerKm} km</td>
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
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Fuel Cost</h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>

                                        <th colSpan={3} style={{ textAlign: 'center'}}>Fuel Cost</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Total Distance (Km)</strong></td>
                                        
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="number" value={costEstimationData?.fuelCost.totalDistance}
                                                onChange={(e) => handleInputChangeFuelCost(Number(e.target.value), 'totalDistance', 'fuel')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Total Fuel (Ltrs)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.fuelCost.totalFuel}
                                                onChange={(e) => handleInputChangeFuelCost(Number(e.target.value), 'totalFuel', 'fuel')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>

                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Milage (Km/Ltr)</strong></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.fuelCost.mileage} km/ltrs</td>


                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td ><strong>Fuel Cost Per Litre</strong></td>
                                        
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.fuelCost.fuelCostPerLitre}
                                                onChange={(e) => handleInputChangeFuelCost(Number(e.target.value), 'fuelCostPerLitre', 'fuel')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>

                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td ><strong>Fuel Cost Per Km (Rs.)</strong></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.fuelCost.costPerKm}</td>


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
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Routine Maintenance Cost</h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>

                                        <th colSpan={2} style={{ textAlign: 'center'}}>Routine Maintenance Cost</th>
                                        <th style={{ textAlign: 'center' }}>Unit Cost</th>
                                        <th style={{ textAlign: 'center' }}>No. of Units</th>
                                        <th style={{ textAlign: 'center' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Oil Change (Litres)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.oilChange.unitCost}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'unitCost', 'oilChange')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.oilChange.numberOfUnits}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'numberOfUnits', 'oilChange')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.routineMaintenanceCost.oilChange.total} </td>

                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Filters Change (Oil+Air)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.filtersChange.unitCost}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'unitCost', 'filtersChange')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.filtersChange.numberOfUnits}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'numberOfUnits', 'filtersChange')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.routineMaintenanceCost.filtersChange.total} </td>

                                    </tr>
                                    <tr>
                                        <td>3.</td>
                                        <td ><strong>Vehicle Service</strong></td>
                                        
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.vehicleService.unitCost}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'unitCost', 'vehicleService')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                                <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.vehicleService.numberOfUnits}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'numberOfUnits', 'vehicleService')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.routineMaintenanceCost.vehicleService.total} </td>
                                    </tr>
                                    <tr>
                                        <td>4.</td>
                                        <td ><strong>Air Check (Tyres)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.airCheck.unitCost}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'unitCost', 'airCheck')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.routineMaintenanceCost.airCheck.numberOfUnits}
                                                onChange={(e) => handleInputChangeRoutineCost(Number(e.target.value), 'numberOfUnits', 'airCheck')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>RS. {costEstimationData?.routineMaintenanceCost.airCheck.total} </td>
                                    </tr>
                                    <tr>
                                        <td>5.</td>
                                        <td ><strong>Routine Maintenance work done after -- Kms</strong></td>
                                        <td colSpan={2} style={{ textAlign: 'center' }}>{costEstimationData?.routineMaintenanceCost.routineMaintenanceDoneAfterKm.unitCost} km</td>

                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.routineMaintenanceCost.routineMaintenanceDoneAfterKm.total}</td>

                                    </tr>
                                    <tr>

                                        <td style={{ textAlign: 'center' }} colSpan={4}><strong>Routine Mainetenance cost per KM</strong></td>

                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.routineMaintenanceCost.costPerKm}</td>

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
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Tire Cost per km </h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>

                                        <th colSpan={2} style={{ textAlign: 'center'}}>Tire Cost per km</th>
                                        <th style={{ textAlign: 'center' }}>Unit Cost</th>
                                        <th style={{ textAlign: 'center' }}>No. of Units</th>

                                        <th style={{ textAlign: 'center' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Tire Cost</strong></td>
                                       
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.tireCostPerKm.tireCost.unitCost}
                                                onChange={(e) => handleInputChangeTireCost(Number(e.target.value), 'unitCost', 'tireCost')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                                <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.tireCostPerKm.tireCost.numberOfUnits}
                                                onChange={(e) => handleInputChangeTireCost(Number(e.target.value), 'numberOfUnits', 'tireCost')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                    
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.tireCostPerKm.tireCost.total}  </td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Average Life of Tires (Kms)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.tireCostPerKm.averageLifeOfTires.unitCost}
                                                onChange={(e) => handleInputChangeTireCost(Number(e.target.value), 'unitCost', 'averageLifeOfTires')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                                <td style={{ textAlign: 'center' }}>
                                                <input type="number" value={costEstimationData?.tireCostPerKm.averageLifeOfTires.numberOfUnits}
                                                onChange={(e) => handleInputChangeTireCost(Number(e.target.value), 'numberOfUnits', 'averageLifeOfTires')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
            
                                        
                                        <td style={{ textAlign: 'center' }}> {costEstimationData?.tireCostPerKm.averageLifeOfTires.total} </td>
                                    </tr>

                                    <tr>

                                        <td style={{ textAlign: 'center' }} colSpan={4}><strong>Tire Cost Per Km (Rs.)</strong></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.tireCostPerKm.costPerKm} </td>

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
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Repair Cost per km</h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={2} style={{ textAlign: 'center'}}>Repair Cost per km</th>
                                        <th style={{ textAlign: 'center' }}>Unit Cost</th>
                                        <th style={{ textAlign: 'center' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Average Repair Cost (Rs.)</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.repairCostPerKm.averageRepairCost}
                                                onChange={(e) => handleInputChangeRepairCost(Number(e.target.value), 'averageRepairCost')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                              
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.repairCostPerKm.averageRepairCost} </td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>No of Kilometers</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.repairCostPerKm.numberOfKilometers}
                                                onChange={(e) => handleInputChangeRepairCost(Number(e.target.value), 'numberOfKilometers')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.repairCostPerKm.numberOfKilometers} </td>
                                    </tr>

                                    <tr>
                                        <td style={{ textAlign: 'center' }} colSpan={3}><strong>Average Repair Cost Per Km</strong></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.repairCostPerKm.costPerKm} </td>
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
                        <Card.Header style={{ backgroundColor: '#5DADE2', color: '#fff' }}>
                            <h4 style={{ marginBottom: '0', textAlign: 'center' }}>Misc. Cost per km</h4>

                        </Card.Header>
                        <Card.Body>
                            <Table bordered striped style={{ marginBottom: '0' }}>
                                <thead>
                                    <tr>

                                        <th colSpan={2} style={{ textAlign: 'center' }}>Misc. Cost per km</th>
                                        <th style={{ textAlign: 'center' }}>Unit Cost</th>
                                        <th style={{ textAlign: 'center' }}>No of Kms</th>
                                        <th style={{ textAlign: 'center' }}>Cost Per Km</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1.</td>
                                        <td ><strong>Toll Taxes</strong></td>
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.miscCostPerKm.tollTaxes.unitCost}
                                                onChange={(e) => handleInputChangeMiscCost(Number(e.target.value), 'unitCost', 'tollTaxes')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                                 <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.miscCostPerKm.tollTaxes.numberOfKms}
                                                onChange={(e) => handleInputChangeMiscCost(Number(e.target.value), 'numberOfKms', 'tollTaxes')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                       
                                        <td style={{ textAlign: 'center' }}> {costEstimationData?.miscCostPerKm.tollTaxes.total}</td>
                                    </tr>
                                    <tr>
                                        <td>2.</td>
                                        <td ><strong>Police Cost</strong></td>
                                      
                                        <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.miscCostPerKm.policeCost.unitCost}
                                                onChange={(e) => handleInputChangeMiscCost(Number(e.target.value), 'unitCost', 'policeCost')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                                 <td style={{ textAlign: 'center' }}>
                                        <input type="number" value={costEstimationData?.miscCostPerKm.policeCost.numberOfKms}
                                                onChange={(e) => handleInputChangeMiscCost(Number(e.target.value), 'numberOfKms', 'policeCost')}
                                                style={{  borderRadius: '4px', backgroundColor: 'transparent', border: 'none', textAlign: 'center' }}/></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.miscCostPerKm.policeCost.total} </td>
                                    </tr>

                                    <tr>

                                        <td style={{ textAlign: 'center' }} colSpan={4}><strong>Misc. Cost Per Km</strong></td>
                                        <td style={{ textAlign: 'center' }}>{costEstimationData?.miscCostPerKm.costPerKm} </td>
                                    </tr>

                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
             {/* Save button */}
             <Row className="mb-4">
                <Col md={{ span: 4, offset: 4 }}>
                    <Button onClick={handleSave} variant="primary">Save</Button>
                </Col>
            </Row>
        </>
    );
};

export default CostEstimation;
