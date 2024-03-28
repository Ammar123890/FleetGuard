import { HttpClient } from '../helpers'

function adminApi() {
	
	return {

		getCustomerDetails: (headers: Record<string, string>) => {
			return HttpClient.get('auth/customer/getdetails', { headers})
		},
		//Trucks

        getTrucks: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/truck/get', { headers})
        },
		//Driver

        
        getDrivers: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/driver/get', { headers})
        },
		getDriverById: (value: string, header: Record<string, string>) => {
				return HttpClient.get(`/customer/driver/get/${value}`,  {headers: header });
			  },
	
		//Shipments

		getAvailableShipments: (shipmentWeight: number, shipmentArea: number, shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/truck/available?shipmentWeight=${shipmentWeight}&shipmentArea=${shipmentArea}&shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		
		getShipments: ( headers: Record<string, string>) => {
			console.log('token: ', headers)
			return HttpClient.get('/customer/shipment/get', { headers})
        },
		getShipmentById: (value: string, header: Record<string, string>) => {
			return HttpClient.get(`/customer/shipment/get/${value}`,  {headers: header });
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
		  
		getCostEstimation: (headers: Record<string, string>, value: string) => {
			
			return HttpClient.get(`/customer/cost-estimation?truckType=${value}`, { headers});
		},
		
	}
}

export default adminApi()
