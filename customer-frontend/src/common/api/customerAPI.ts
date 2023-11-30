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
        addDriver: (name: string, phone: string, licenseNumber: string, licenseExpiry: string, age: number, address: string, experience: number, headers: Record<string, string>) => {
            const values = { name, phone, licenseNumber, licenseExpiry, age, address, experience,};  
            return HttpClient.post('/customer/driver/add', values, { headers});
        },
        getDrivers: ( headers: Record<string, string>) => {
            return HttpClient.get('/customer/driver/get', { headers})
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
