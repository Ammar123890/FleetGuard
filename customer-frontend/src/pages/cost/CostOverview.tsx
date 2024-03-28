import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { customerApi } from '@/common';
import { Form } from 'react-bootstrap';

// interface CostEstimationData {
//     truckType: string;
//     labourCost: {
//         driverSalary: {
//             perDay: number;
//             perMonth: number;
//             quantity: number;
//             total: number;
//         };
//         assistantSalary: {
//             perDay: number;
//             perMonth: number;
//             quantity: number;
//             total: number;
//         };
//         totalDistanceTravelledPerMonth: number;
//         costPerKm: number;
//     };
//     fuelCost: {
//         totalDistance: number;
//         totalFuel: number;
//         mileage: number;
//         fuelCostPerLitre: number;
//         costPerKm: number;
//     };
//     routineMaintenanceCost: {
//         oilChange: {
//             numberOfUnits: number;
//             unitCost: number;
//             total: number;
//         };
//         filtersChange: {
//             unitCost: number;
//             numberOfUnits: number;
//             total: number;
//         };
//         vehicleService: {
//             unitCost: number;
//             numberOfUnits: number;
//             total: number;
//         };
//         airCheck: {
//             unitCost: number;
//             numberOfUnits: number;
//             total: number;
//         };
//         routineMaintenanceDoneAfterKm: {
//             total: number;
//             unitCost: number;
//         };
//         costPerKm: number;
//     };
//     tireCostPerKm: {
//         tireCost: {
//             unitCost: number;
//             numberOfUnits: number;
//             total: number;
//         };
//         averageLifeOfTires: {
//             unitCost: number;
//             numberOfUnits: number;
//             total: number;
//         };
//         costPerKm: number;
//     };
//     repairCostPerKm: {
//         averageRepairCost: number;
//         numberOfKilometers: number;
//         costPerKm: number;
//     };
//     miscCostPerKm: {
//         tollTaxes: {
//             unitCost: number;
//             numberOfKms: number;
//             total: number;
//         };
//         policeCost: {
//             unitCost: number;
//             numberOfKms: number;
//             total: number;
//         };
//         costPerKm: number;
//     };
//     summary: {
//         labourCost: number;
//         fuelCost: number;
//         routineMaintenanceCost: number;
//         tireCostPerKm: number;
//         repairCostPerKm: number;
//         miscCostPerKm: number;
//         VOCperKm: number;
//     };
// }

const CostOverview = () => {
    // const [costEstimationData, setCostEstimationData] = useState<CostEstimationData>({
    //     truckType: '',
    //     labourCost: {
    //         driverSalary: {
    //             perDay: 0,
    //             perMonth: 0,
    //             quantity: 0,
    //             total: 0,
    //         },
    //         assistantSalary: {
    //             perDay: 0,
    //             perMonth: 0,
    //             quantity: 0,
    //             total: 0,
    //         },
    //         totalDistanceTravelledPerMonth: 0,
    //         costPerKm: 0,
    //     },
    //     fuelCost: {
    //         totalDistance: 0,
    //         totalFuel: 0,
    //         mileage: 0,
    //         fuelCostPerLitre: 0,
    //         costPerKm: 0,
    //     },
    //     routineMaintenanceCost: {
    //         oilChange: {
    //             numberOfUnits: 0,
    //             unitCost: 0,
    //             total: 0,
    //         },
    //         filtersChange: {
    //             unitCost: 0,
    //             numberOfUnits: 0,
    //             total: 0,
    //         },
    //         vehicleService: {
    //             unitCost: 0,
    //             numberOfUnits: 0,
    //             total: 0,
    //         },
    //         airCheck: {
    //             unitCost: 0,
    //             numberOfUnits: 0,
    //             total: 0,
    //         },
    //         routineMaintenanceDoneAfterKm: {
    //             total: 0,
    //             unitCost: 0,
    //         },
    //         costPerKm: 0,
    //     },
    //     tireCostPerKm: {
    //         tireCost: {
    //             unitCost: 0,
    //             numberOfUnits: 0,
    //             total: 0,
    //         },
    //         averageLifeOfTires: {
    //             unitCost: 0,
    //             numberOfUnits: 0,
    //             total: 0,
    //         },
    //         costPerKm: 0,
    //     },
    //     repairCostPerKm: {
    //         averageRepairCost: 0,
    //         numberOfKilometers: 0,
    //         costPerKm: 0,
    //     },
    //     miscCostPerKm: {
    //         tollTaxes: {
    //             unitCost: 0,
    //             numberOfKms: 0,
    //             total: 0,
    //         },
    //         policeCost: {
    //             unitCost: 0,
    //             numberOfKms: 0,
    //             total: 0,
    //         },
    //         costPerKm: 0,
    //     },
    //     summary: {
    //         labourCost: 0,
    //         fuelCost: 0,
    //         routineMaintenanceCost: 0,
    //         tireCostPerKm: 0,
    //         repairCostPerKm: 0,
    //         miscCostPerKm: 0,
    //         VOCperKm: 0,
    //     },
    //   });
      
    const [truckType, setTruckType] = useState<string>("2-3 Axle");  // default value
    const [pieChartData, setPieChartData] = useState<number[]>([]);
    const [barChartData, setBarChartData] = useState<number[]>([]);

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
                // setCostEstimationData(response.data);
                const summaryData = response.data.summary;
                console.log('summary, ', summaryData)
                const pieData = [
                    summaryData.labourCost,
                    summaryData.fuelCost,
                    summaryData.routineMaintenanceCost,
                    summaryData.tireCostPerKm,
                    summaryData.repairCostPerKm,
                    summaryData.miscCostPerKm,
                    summaryData.VOCperKm,
                ];
                const barData = [
                    summaryData.labourCost,
                    summaryData.fuelCost,
                    summaryData.routineMaintenanceCost,
                    summaryData.tireCostPerKm,
                    summaryData.repairCostPerKm,
                    summaryData.miscCostPerKm,
                    summaryData.VOCperKm,
                ];
                
                setPieChartData(pieData);
                setBarChartData(barData);
                console.log(pieData)
                console.log(
                    summaryData.VOCPerKm)
            } catch (error) {
                console.log('dd')
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [truckType]); 
    const handleTruckTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruckType(e.target.value);
    };
    return (
        <>
        {/* Pie Chart */}
        <Form.Select className='mb-2 mt-2' value={truckType} onChange={handleTruckTypeChange}>
                            <option value="2-3 Axle">2-3 Axle</option>
                            <option value="4-5 Axle">4-5 Axle</option>
                            <option value="6 Axle">6 Axle</option>
                        </Form.Select>
        <Row className="mb-4">
            
            <Col>
            
                <Card>
                    
                    <Card.Body>
                        <h4 className="header-title">Percentage Contribution of VOC Components</h4>
                        
                        {pieChartData.length > 0 && (
                            <ReactApexChart
                                options={{
                                    labels: [
                                        'Labour Cost',
                                        'Fuel Cost',
                                        'Routine Maintenance Cost',
                                        'Tire Cost Per Km',
                                        'Repair Cost Per Km',
                                        'Misc Cost Per Km',
                                        'VOC Per Km',
                                    ],
                                    colors: ['#5DADE2', '#F4D03F', '#3357FF', '#AEB6BF', '#EC7063', '#008080', '#E74C3C'],
                                }}
                                series={pieChartData}
                                type="pie"
                                height={350}
                                className="apex-charts"
                            />
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        {/* Bar Chart */}
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <h4 className="header-title">Summary Costs</h4>
                        {barChartData.length > 0 && (
                            <ReactApexChart
                                options={{
                                    xaxis: {
                                        categories: [
                                            'Labour Cost',
                                            'Fuel Cost',
                                            'Routine Maintenance Cost',
                                            'Tire Cost Per Km',
                                            'Repair Cost Per Km',
                                            'Misc Cost Per Km',
                                            'VOC Per Km',
                                        ],
                                    },
                                    colors: ['#5DADE2'],
                                }}
                                series={[
                                    {
                                        name: 'Cost',
                                        data: barChartData,
                                    },
                                ]}
                                type="bar"
                                height={350}
                                className="apex-charts"
                            />
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
    );
};
export default CostOverview;
