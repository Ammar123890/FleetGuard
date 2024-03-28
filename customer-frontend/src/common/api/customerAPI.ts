import { HttpClient } from '../helpers'

function customerApi() {
	
	return {

		getCustomerDetails: (headers: Record<string, string>) => {
			return HttpClient.get('auth/customer/getdetails', { headers})
		},
		//Trucks

		addTruck: (truckNumber: string, make: string, year: string, registration: string, weightCapacity: number, areaCapacity: number, type: string, headers: Record<string, string>) => {
            const values = { truckNumber, make, year, registration, weightCapacity, areaCapacity, type};  
            return HttpClient.post('/customer/truck/add', values, { headers});
        },
        getTrucks: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/truck/get', { headers})
        },
		getTruckById: (value: string, header: Record<string, string>) => {
			return HttpClient.get(`/customer/truck/get/${value}`,  {headers: header });
		  },
		editTruck: (id: string, truckNumber: string, make: string, year: string, registration: string, weightCapacity: number, areaCapacity: number, type: string, headers: Record<string, string>) => {
			const values = {truckNumber, make, year, registration, weightCapacity, areaCapacity, type};
			return HttpClient.put(`/customer/truck/edit/${id}`, values, { headers})
        },
		deleteTruck: (value: string, headers: Record<string, string>) => {
			return HttpClient.delete(`/customer/truck/delete/${value}`, { headers });
		},
		//Driver

        addDriver: (name: string, phone: string, licenseNumber: string, licenseExpiry: string, age: number, address: string, experience: number, headers: Record<string, string>) => {
            const values = { name, phone, licenseNumber, licenseExpiry, age, address, experience,};  
            return HttpClient.post('/customer/driver/add', values, { headers});
        },
        getDrivers: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/driver/get', { headers})
        },
		getDriverById: (value: string, header: Record<string, string>) => {
				return HttpClient.get(`/customer/driver/get/${value}`,  {headers: header });
			  },
		editDriver: (id: string, name: string, phone: string, licenseNumber: string, licenseExpiry: string, age: number, address: string, experience: number, headers: Record<string, string>) => {
			const values = {name, phone, licenseNumber, licenseExpiry, age, address, experience};
			return HttpClient.put(`/customer/driver/edit/${id}`, values, { headers})
        },
		getAvailableDrivers: (shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/driver/available?shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		getAvailableTrucks: (shipmentWeight: string,shipmentArea: string,shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/truck/available?shipmentWeight=${shipmentWeight}&shipmentArea=${shipmentArea}&shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		deleteDriver: (value: string, headers: Record<string, string>) => {
			return HttpClient.delete(`/customer/driver/delete/${value}`, { headers });
		},
		//Shipments

		getAvailableShipments: (shipmentWeight: number, shipmentArea: number, shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/truck/available?shipmentWeight=${shipmentWeight}&shipmentArea=${shipmentArea}&shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		addShipment: (value: any, headers: Record<string, string>) => {
			console.log('valuesss: ', value)
			console.log('headers', headers)
            return HttpClient.post('/customer/shipment/add', value, { headers});
        },
		getShipments: ( headers: Record<string, string>) => {
			console.log('token: ', headers)
			return HttpClient.get('/customer/shipment/get', { headers})
        },
		getShipmentById: (value: string, header: Record<string, string>) => {
			return HttpClient.get(`/customer/shipment/get/${value}`,  {headers: header });
		},
		startShipment: (value: string, headers: Record<string, string>) => {
			console.log('token: ', headers)
			return HttpClient.put(`/customer/shipment/start/${value}`,  {headers});
		},
		endShipment: (value: string, headers: Record<string, string>) => {
			console.log('token: ', headers)
			return HttpClient.put(`/customer/shipment/end/${value}`,  {headers});
		},
		getWeather: (lg: string, lt: string, headers: Record<string, string>) => {
			console.log('token: ', headers)
			return HttpClient.get(`customer/shipment/weather/get/${lg}/${lt}`, { headers})
        },
		//Device
		viewDevice: ( headers: Record<string, string>) => {
			return HttpClient.get('/customer/dashcam/list/get', { headers});
		  },
		  getDashcams: ( headers: Record<string, string>) => {
			return HttpClient.get('/customer/dashcam/get', { headers});
		  },
		  viewDeviceById: (value: string, headers: Record<string, string>) => {
			console.log('gg', value)
			return HttpClient.get(`/customer/dashcam/get/${value}`, { headers});
		  },
		  purchaseDashcam: (value: any, headers: Record<string, string>) => {
			console.log('valuesss: ', value)
			console.log('headers', headers)
            return HttpClient.post('/customer/dashcam/purchase', value, { headers});
        },
		  assignDashcamToTruck: (dashcamId: string, truckId: string, headers: Record<string, string>) => {
			console.log(truckId, dashcamId)
			return HttpClient.put(`/customer/truck/assigndashcam/${dashcamId}/${truckId}`,  {headers});
		},
		getScoresByShipmentId: (value: any, headers: Record<string, string>) => {
			return HttpClient.get(`/customer/dashcam/purchase/${value}`,  { headers});
		},
		getViolationDetails: (value: string, safetyFactor: string, headers: Record<string, string>) => {
			return HttpClient.get(`/customer/shipment/violation/get/${value}/${safetyFactor}`,  { headers});
		},
		getDriverScore: (value: string, headers: Record<string, string>) => {
			return HttpClient.get(`/customer/shipment/score/get/${value}`, { headers});
		},
		getViolationCount: (headers: Record<string, string>) => {
			return HttpClient.get('/customer/driver/count', { headers});
		},
		getCostEstimation: (headers: Record<string, string>, value: string) => {
			
			return HttpClient.get(`/customer/cost-estimation?truckType=${value}`, { headers});
		},
		estimateCost: ( value: string, distance: any, headers: Record<string, string>) => {
			
			return HttpClient.get(`/customer/cost-estimation/estimate?truckType=${value}&distance=${distance}`, { headers});
		},
		updateCostEstimation: (headers: Record<string, string>, value: any, truckType: string) => {
			
			return HttpClient.put(`/customer/cost-estimation/${truckType}`, value, { headers});
		}
	}
}

export default customerApi()
