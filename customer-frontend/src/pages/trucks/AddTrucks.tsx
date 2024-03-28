// Import necessary components and hooks
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { FormInput } from '@/components';
import { customerApi } from '@/common'; // Import your customer API service
import { useState } from 'react';

// Define the type for the driver data
interface Truck {
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
  type: string;
}

const AddTrucks = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { handleSubmit, register, reset, control, formState: { errors } } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const { truckNumber, make, year, registration, weightCapacity, areaCapacity, type } = data as Truck;
    setLoading(true);
    try {
		const token = localStorage.getItem('token');

        if (!/^[A-Z0-9]{6,10}$/.test(truckNumber)) {
            setErrorMessage('Invalid truckNumber. It should be 6 to 10 characters long and contain only uppercase letters and numbers.');
            setSuccessMessage(null)
            setLoading(false);
            return;
          }

		if (token) {
		console.log('Token:', token);
		} else {
		console.error('No token found in localStorage');
		}

    
      // Call the customer API to add a new truck
      const res = await customerApi.addTruck(truckNumber, make, year, registration, weightCapacity, areaCapacity, type, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status) {
        reset();
        setSuccessMessage('Truck added successfully!');
        setErrorMessage(null)
      } else {
        setErrorMessage('Failed to add truck. Please try again.');
        setSuccessMessage(null)
      }

      console.log('API Response:', res);
    } catch (error) {
      // Handle errors
      console.error('API Error:', error);
      setErrorMessage('Failed to add truck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title">Add New Truck</h4>
      </Card.Header>
      <Card.Body>
        {/* Display success message if available */}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Display error message if available */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
          </Alert>
        )}

        <Row>
          <Col sm={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Form inputs for adding a new driver */}
              <FormInput
                label="Truck Number"
                type="text"
                name="truckNumber"
                containerClass="mb-3"
                register={register}
                key="truckNumber"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Make"
                type="text"
                name="make"
                containerClass="mb-3"
                register={register}
                key="make"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Year"
                type="text"
                name="year"
                containerClass="mb-3"
                register={register}
                key="year"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Registration"
                type="text"
                name="registration"
                containerClass="mb-3"
                register={register}
                key="registration"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Weight Capacity"
                type="number"
                name="weightCapacity"
                containerClass="mb-3"
                register={register}
                key="weightCapacity"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Area Capacity"
                type="number"
                name="areaCapacity"
                containerClass="mb-3"
                register={register}
                key="areaCapacity"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Truck Type"
                type="text"
                name="type"
                containerClass="mb-3"
                register={register}
                key="type"
                errors={errors}
                control={control}
                placeholder='["4-5 Axle", "6 Axle", "2-3 Axle"]'
              />

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Add Truck
              </Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddTrucks;
