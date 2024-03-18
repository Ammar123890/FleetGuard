import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { FormInput } from '@/components';
import { profileApi } from '@/common'; // Import your authentication service
import {  useState } from 'react'
import type { Device } from '@/types/Device';

const AddDevice = () => {
	const [loading, setLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const { handleSubmit, register, reset, control, formState: { errors } } = useForm();
	
	const onSubmit = async (data: FieldValues) => {
		const { model, pricePerMonth, price, quantity, description } = data as Device;
		console.log('Form Data:', { model, pricePerMonth, price, quantity, description });
		setLoading(true);
		console.log(model)
	  try {
		const token = localStorage.getItem('token');

		if (token) {
		console.log('Token:', token);
		} else {
		console.error('No token found in localStorage');
		}
		
		const res = await profileApi.addDevice(model, pricePerMonth, price, quantity, description, {
			Authorization: `Bearer ${token}`,
		  });
		  if (res.status) {
			reset();
			setSuccessMessage('Device added successfully!');
		} else {
		
			setSuccessMessage(null); 
		}
  
		console.log('API Response:', res);
	  } catch (error) {
		// Handle errors
		console.error('API Error:', error);
	  }
	};
  
	// Function to get the authentication token from cookies
// 	const getTokenFromCookies = () => {
		
// 	  const token = Cookies.get('token');
// 	  console.log('token isv ', token)
// 	  document.cookie = "testCookie=testValue; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
// console.log('All Cookies:', document.cookie);
// const t = Cookies.get('next-auth.session-token')
// 	  console.log('r ', t)

// 	  return token;
// 	};
  
	return (
		<Card>
			<Card.Header>
				<h4 className="header-title">Add New Device</h4>
				
			</Card.Header>
			<Card.Body>
				 {/* Display success message if available */}
				 {successMessage && (
                    <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                        {successMessage}
                    </Alert>
                )}
				<Row>
					<Col sm={12}>

						<form onSubmit={handleSubmit(onSubmit)}>
						{/* <FormInput
								name="model"
								label="Model"
								type="select"
								containerClass="mb-3"
								className="form-select"
								register={register}
								key="select"
								errors={errors}
								control={control}
								placeholder='Choose Model'
							>
								
							<option>V1.1</option>
							<option>V1.2</option>
							<option>V2.1</option>
							<option>V2.2</option>
							<option>V2.3</option>
						</FormInput> */}
						<FormInput
								label="Model"
								type="string"
								name="model"
								containerClass="mb-3"
								register={register}
								key="model"
								errors={errors}
								control={control}
							/>
							<FormInput
								label="Package Per Month"
								type="number"
								name="pricePerMonth"
								containerClass="mb-3"
								register={register}
								key="package"
								errors={errors}
								control={control}
							/>
							<FormInput
								label="Price"
								type="number"
								name="price"
								containerClass="mb-3"
								register={register}
								key="price"
								errors={errors}
								control={control}
							/>
							<FormInput
								label="Quantity"
								type="number"
								name="quantity"
								containerClass="mb-3"
								register={register}
								key="quantity"
								errors={errors}
								control={control}
							/>
							
							

							<FormInput
								label="Description"
								type="textarea"
								name="description"
								rows={5}
								containerClass="mb-3"
								register={register}
								key="description"
								errors={errors}
								control={control}
							/>
								<Button
							variant="primary"
							type="submit"
							disabled={loading}
							className="waves-effect waves-light"
						>
							Add Device
						</Button>
						</form>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}
export default AddDevice