// Import necessary components and hooks
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { FormInput } from '@/components';
import { customerApi } from '@/common'; // Import your customer API service
import { useState } from 'react';
interface Driver {
    name: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
    age: number;
    address: string;
    experience: number;
  }
  
  const AddDriver = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const { handleSubmit, register, reset, control, formState: { errors } } = useForm();
  
    const onSubmit = async (data: FieldValues) => {
      const { name, phone, licenseNumber, licenseExpiry, age, address, experience } = data as Driver;
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }
  
        // Call the customer API to add a new driver
        const res = await customerApi.addDriver(
          name,
          phone,
          licenseNumber,
          licenseExpiry,
          age,
          address,
          experience,
          {
            Authorization: `Bearer ${token}`,
          }
        );
  
        if (res.status) {
          reset();
          setSuccessMessage('Driver added successfully!');
        } else {
          setErrorMessage('Failed to add driver. Please try again.');
        }
  
        console.log('API Response:', res);
      } catch (error) {
        // Handle errors
        console.error('API Error:', error);
        setErrorMessage('Failed to add driver. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card>
        <Card.Header>
          <h4 className="header-title">Add New Driver</h4>
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
                  label="Name"
                  type="text"
                  name="name"
                  containerClass="mb-3"
                  register={register}
                  key="name"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="Phone"
                  type="text"
                  name="phone"
                  containerClass="mb-3"
                  register={register}
                  key="phone"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="License Number"
                  type="text"
                  name="licenseNumber"
                  containerClass="mb-3"
                  register={register}
                  key="licenseNumber"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="License Expiry"
                  type="date"
                  name="licenseExpiry"
                  containerClass="mb-3"
                  register={register}
                  key="licenseExpiry"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="Age"
                  type="number"
                  name="age"
                  containerClass="mb-3"
                  register={register}
                  key="age"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="Address"
                  type="text"
                  name="address"
                  containerClass="mb-3"
                  register={register}
                  key="address"
                  errors={errors}
                  control={control}
                />
  
                <FormInput
                  label="Experience"
                  type="number"
                  name="experience"
                  containerClass="mb-3"
                  register={register}
                  key="experience"
                  errors={errors}
                  control={control}
                />
  
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="waves-effect waves-light"
                >
                  Add Driver
                </Button>
              </form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };
  
  export default AddDriver;