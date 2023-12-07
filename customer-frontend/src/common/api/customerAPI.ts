import { HttpClient } from '../helpers'

function customerApi() {
	
	return {
		addTruck: (truckNumber: string, make: string, year: string, registration: string, weightCapacity: number, areaCapacity: number, headers: Record<string, string>) => {
            const values = { truckNumber, make, year, registration, weightCapacity, areaCapacity};  
            return HttpClient.post('/customer/truck/add', values, { headers});
        },
        getTrucks: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/truck/get', { headers})
        },
		getTruckById: (value: string, header: Record<string, string>) => {
			return HttpClient.get(`/customer/truck/get/${value}`,  {headers: header });
		  },
		editTruck: (id: string, truckNumber: string, make: string, year: string, registration: string, weightCapacity: number, areaCapacity: number, headers: Record<string, string>) => {
			const values = {truckNumber, make, year, registration, weightCapacity, areaCapacity};
			return HttpClient.put(`/customer/truck/edit/${id}`, values, { headers})
        },
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
		getAvailableShipments: (shipmentWeight: number, shipmentArea: number, shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/truck/available?shipmentWeight=${shipmentWeight}&shipmentArea=${shipmentArea}&shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		getAvailableDrivers: (shipmentPickDate: string, shipmentDeliveryDate: string, headers: Record<string, string>) => {
			const url = `/customer/driver/available?shipmentPickDate=${shipmentPickDate}&shipmentDeliveryDate=${shipmentDeliveryDate}`;
			
			console.log(url, headers);
			
			return HttpClient.get(url, { headers });
		},
		addShipment: (value: any, headers: Record<string, string>) => {
			console.log('valuesss: ', value)
			console.log('headers', headers)
            return HttpClient.post('/customer/shipment/add', value, { headers});
        },

		
		// addDevice: (model: string, pricePerMonth: number, price: number, quantity: number, description: string, headers: Record<string, string>) => {
		// 	const values = { model, pricePerMonth, price, quantity, description };
		// 	console.log('header of add device', headers)
		// 	return HttpClient.post('/admin/dashcam/add', values, { headers});
		//   },
		//   viewDevice: ( headers: Record<string, string>) => {
		// 	return HttpClient.get('/admin/dashcam/get', { headers});
		//   },
		//   getDeviceById: (value: string, header: Record<string, string>) => {
		// 	console.log('header: ', header)
		// 	console.log('value',)
		// 	return HttpClient.get(`/admin/dashcam/get/${value}`,  {
		// 		headers: header  // Correct way to include headers in the request
		// 	  });;
		//   },
		//   editDevice: (value: string, model: string, pricePerMonth: number, price: number, quantity: number, description: string,  header: Record<string, string>) => {
		// 	console.log('header: ', header)
		// 	console.log('value',)
		// 	const values = { model, pricePerMonth, price, quantity, description };
		// 	return HttpClient.put(`/admin/dashcam/edit/${value}`, values, {
		// 		headers: header 
		// 	  });
		//   },
	}
}

export default customerApi()
