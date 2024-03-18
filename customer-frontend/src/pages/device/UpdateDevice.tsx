import { useEffect, useState, useMemo } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FormInput } from '@/components';
import { FieldValues, useForm } from 'react-hook-form';
import { profileApi } from '@/common';
import { useParams } from 'react-router-dom';
import type { Device } from '@/types/Device';
import { useLocation, useNavigate } from 'react-router-dom'

const UpdateDevice = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { handleSubmit, register, reset, control, formState: { errors } } = useForm();
  const [device, setDevice] = useState<Device | null>(null);

  
	const redirectUrl = useMemo(
		() =>
			location.state && location.state.from
				? location.state.from.pathname
				: '/admin/dashcam/get',
		[location.state]
	)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        console.log('s', id)
        // const i = '656300755b7623e85cc47f22'
        const res = await profileApi.getDeviceById(id!, {
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch device data');
        }

        const deviceData = res.data;
        console.log(deviceData.pricePerMonth)
        setDevice(deviceData);
        reset(deviceData); // Populate the form with existing data
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: FieldValues) => {
    const { model, pricePerMonth, price, quantity, description } = data as Device;
    console.log('Form Data:', { model, pricePerMonth, price, quantity, description });
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('values: ', id, ' ', model, ' ', pricePerMonth, ' ', price, quantity, description,)
      const res = await profileApi.editDevice(id!, model, pricePerMonth, price, quantity, description, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status) {
        setSuccessMessage('Device updated successfully!');
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
        <h4 className="header-title">Edit Device</h4>
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
                  name="model"
                  label="Select a model"
                  type="select"
                  containerClass="mb-3"
                  className="form-select"
                  register={register}
                  key="select"
                  errors={errors}
                  control={control}
                  placeholder="Choose Model"
                >
                  <option>V1.1</option>
                  <option>V1.2</option>
                  <option>V2.1</option>
                  <option>V2.2</option>
                  <option>V2.3</option>
                </FormInput>
            

          
              
							<FormInput
								label="Package Per Month"
								type="number"
								name="packagemonthly"
								containerClass="mb-3"
								register={register}
								key="package"
								errors={errors}
								control={control}
                                defaultValue={device?.pricePerMonth}
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
                                defaultValue={device?.price}
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
                                defaultValue={device?.quantity}
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
                                defaultValue={device?.description}
							/>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Update Device
              </Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UpdateDevice;
