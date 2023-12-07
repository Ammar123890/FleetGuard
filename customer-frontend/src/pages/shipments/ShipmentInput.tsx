import React, { useState } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { FormInput } from '@/components';
import { useNavigate } from 'react-router-dom';

interface Shipment {
  shipmentWeight: number;
  shipmentArea: number;
  shipmentPickDate: string;
  shipmentDeliveryDate: string;
}


const ShipmentInput = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { handleSubmit, register, control, formState: { errors } } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate } = data as Shipment;
    setLoading(true);

    try {
      navigate('/customer/shipments/find-truck', {
        state: {
          shipmentWeight,
          shipmentArea,
          shipmentPickDate,
          shipmentDeliveryDate,
        },
      });
    } catch (error) {
      console.error('Navigation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title">Enter Shipment Details</h4>
      </Card.Header>
      <Card.Body>
        {/* Display error message if available */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
          </Alert>
        )}

        <Row>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {/* <Col sm={6}> */}
                {/* Form inputs for getting available trucks */}
                
                <FormInput
                  label="Shipment Weight"
                  type="number"
                  name="shipmentWeight"
                  containerClass="mb-3"
                  register={register}
                  key="shipmentWeight"
                  errors={errors}
                  control={control}
                  placeholder='Enter shipment weight (eg. 1000)'
                />
              {/* </Col> */}
              {/* <Col sm={6}> */}
                <FormInput
                  label="Shipment Area"
                  type="number"
                  name="shipmentArea"
                  containerClass="mb-3"
                  register={register}
                  key="shipmentArea"
                  errors={errors}
                  control={control}
                  placeholder='Enter shipment area (eg. 1000)'
                />
              {/* </Col> */}
            </Row>
            <Row>
              <Col>
                <FormInput
                  label="Pickup Date"
                  type="date"
                  name="shipmentPickDate"
                  containerClass="mb-3"
                  register={register}
                  key="shipmentPickDate"
                  errors={errors}
                  control={control}
                />
              </Col>
              <Col>
                <FormInput

                  label="Delivery Date"
                  type="date"
                  name="shipmentDeliveryDate"
                  containerClass="mb-3"
                  register={register}
                  key="shipmentDeliveryDate"
                  errors={errors}
                  control={control}
                />
              </Col>
            </Row>
            <li className="next list-inline-item float-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Get Available Trucks<i className="ri-arrow-right-line ms-1" />
              </Button>
            </li>



            {/* </Col> */}
          </form>
        </Row>

      </Card.Body>
    </Card>
  );
};

export default ShipmentInput;
