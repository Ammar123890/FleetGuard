import  { useEffect, useState, useMemo } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FormInput } from '@/components';
import { FieldValues, useForm } from 'react-hook-form';
import { customerApi } from '@/common';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

interface Truck {
  _id: string;
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
}

const EditTrucks = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { handleSubmit, register, reset, control, formState: { errors } } = useForm();
  const [truck, setTruck] = useState<Truck | null>(null);

  const redirectUrl = useMemo(
    () =>
      location.state && location.state.from ? location.state.from.pathname : '/customer/trucks/view',
    [location.state]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getTruckById(id!, {
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch truck data');
        }
        const truckData = res.data;
        setTruck(truckData);
        reset(truckData); // Populate the form with existing data
      } catch (error) {
        console.error('Error fetching truck data:', error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FieldValues) => {
    const { truckNumber, make, year, registration, weightCapacity, areaCapacity } = data as Truck;
    console.log('Form Data:', { truckNumber, make, year, registration });
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await customerApi.editTruck(id!,  truckNumber, make, year, registration, weightCapacity, areaCapacity, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status) {
        setSuccessMessage('Truck updated successfully!');
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
        <h4 className="header-title">Edit Truck</h4>
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
                label="Truck Number"
                type="text"
                name="truckNumber"
                containerClass="mb-3"
                register={register}
                key="truckNumber"
                errors={errors}
                control={control}
                defaultValue={truck?.truckNumber}
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
                defaultValue={truck?.make}
                readOnly // Make it read-only
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
                defaultValue={truck?.year}
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
                defaultValue={truck?.registration}
              />
                 {/* Display Weight Capacity (uneditable) */}
              <FormInput
                label="Weight Capacity"
                type="number"
                name="weightCapacity"
                containerClass="mb-3"
                register={register}
                key="weightCapacity"
                errors={errors}
                control={control}
                defaultValue={truck?.weightCapacity}
                readOnly
              />

              {/* Display Area Capacity (uneditable) */}
              <FormInput
                label="Area Capacity"
                type="number"
                name="areaCapacity"
                containerClass="mb-3"
                register={register}
                key="areaCapacity"
                errors={errors}
                control={control}
                defaultValue={truck?.areaCapacity}
                readOnly
              />
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Update Truck
              </Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EditTrucks;
