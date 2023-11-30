import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FormInput } from '@/components';
import { FieldValues, useForm } from 'react-hook-form';
import { customerApi } from '@/common';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  age: number;
  address: string;
  experience: number;
}

const EditDrivers = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { handleSubmit, register, reset, control, formState: { errors } } = useForm();
  const [driver, setDriver] = useState<Driver | null>(null);

  const redirectUrl = useMemo(
    () =>
      location.state && location.state.from ? location.state.from.pathname : '/customer/driver/get',
    [location.state]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getDriverById(id, {
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch driver data');
        }

        const driverData = res.data;
        setDriver(driverData);
        reset(driverData); // Populate the form with existing data
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FieldValues) => {
    const { name, phone, licenseNumber, licenseExpiry, age, address, experience } = data as Driver;
    console.log('Form Data:', { name, phone, licenseNumber, licenseExpiry, age, address, experience });
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await customerApi.editDriver(id, name, phone, licenseNumber, licenseExpiry, age, address, experience, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status) {
        setSuccessMessage('Driver updated successfully!');
        navigate(redirectUrl);
      } else {
        setSuccessMessage(null);
      }

      console.log('API Response:', res);
    } catch (error) {
      // Handle errors
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title">Edit Driver</h4>
      </Card.Header>
      <Card.Body>
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}
        <Row>
          <Col sm={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label="Name"
                type="text"
                name="name"
                containerClass="mb-3"
                register={register}
                key="name"
                errors={errors}
                control={control}
                defaultValue={driver?.name}
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
                defaultValue={driver?.phone}
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
                defaultValue={driver?.licenseNumber}
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
                defaultValue={driver?.licenseExpiry}
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
                defaultValue={driver?.age}
                readOnly // Make it read-only
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
                defaultValue={driver?.address}
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
                defaultValue={driver?.experience}
                readOnly // Make it read-only
              />

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Update Driver
              </Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EditDrivers;
