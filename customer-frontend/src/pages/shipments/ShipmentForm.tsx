// Import necessary components and hooks
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { customerApi } from '@/common'; // Replace with the actual path to your customer API service
import { FormInput } from '@/components';
import { useNavigate, useLocation } from 'react-router-dom';


interface Shipment {
  shipmentWeight: number;
  shipmentArea: number;
  shipmentPickDate: string;
  shipmentDeliveryDate: string;
}

interface ShipmentDetails {
  shipmentType: string;
  shipmentDescription: string;
  shipmentCost: number;
  paymentMethods: string;
  sender: {
    name: string;
    phone: string;
  };
  receiver: {
    name: string;
    phone: string;
  };
}

const ShipmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate, selectedTruckId, selectedDriverId, coordinatesDest, coordinatesOrigin } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { handleSubmit, register, control, formState: { errors } } = useForm();
  console.log('coordinatesDest: ', coordinatesDest)
  console.log('coordinates origin: ', coordinatesOrigin)
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: FieldValues) => {
    const { shipmentDescription, shipmentCost, shipmentType, paymentMethods, sender, receiver } = data as ShipmentDetails;
    console.log(shipmentType)
    console.log('coordinates dst: ', coordinatesDest.name)
    const coordinatesDestName = coordinatesDest.name;
    const coordinatesOriginName = coordinatesOrigin.name;
    const coordinatesDestlat = coordinatesDest.lat;
    const coordinatesOriginlat = coordinatesOrigin.lat;
    const coordinatesDestlng = coordinatesDest.lng;
    const coordinatesOriginlng = coordinatesOrigin.lng;
    const senderName = sender.name;
    const senderPhone = sender.phone;
    const receiverName = receiver.name;
    const receiverPhone = receiver.phone;

    

    setLoading(true);
    const values = {selectedTruckId, selectedDriverId, shipmentType, shipmentWeight, 
        shipmentArea, shipmentDescription, shipmentPickDate, shipmentDeliveryDate,coordinatesDestName, 
        coordinatesDestlat, coordinatesDestlng, coordinatesOriginName, coordinatesOriginlat, 
        coordinatesOriginlng, shipmentCost, paymentMethods, senderName, senderPhone, receiverName, receiverPhone}
   console.log(values)
   
// Mapping data to the desired format for the request body
const requestBody = {
    truck: values.selectedTruckId,
    driver: values.selectedDriverId,
    shipmentType: values.shipmentType,
    shipmentWeight: values.shipmentWeight,
    shipmentArea: values.shipmentArea,
    shipmentDescription: values.shipmentDescription,
    shipmentPickDate: values.shipmentPickDate,
    shipmentDeliveryDate: values.shipmentDeliveryDate,
    shipmentDestination: {
      location: values.coordinatesDestName,
      coordinates: [values.coordinatesDestlat, values.coordinatesDestlng],
    },
    shipmentOrigin: {
      location: values.coordinatesOriginName,
      coordinates: [values.coordinatesOriginlat, values.coordinatesOriginlng],
    },
    shipmentCost: values.shipmentCost,
    paymentMethod: values.paymentMethods,
    sender: {
      name: values.senderName,
      phone: values.senderPhone,
    },
    receiver: {
      name: values.receiverName,
      phone: values.receiverPhone,
    },
  };
  
  try{
  // Now `requestBody` holds the data in the desired format for the request body
  console.log(requestBody);
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found in localStorage');
    return;
  }

  // Call the customer API to add a new driver
  const res = await customerApi.addShipment(
   requestBody,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  if (res) {
    console.log(res.status)
    // reset();
    setSuccessMessage('Shipment added successfully!');
  } else {
    setErrorMessage('Failed to add shipment. Please try again.');
  }

  console.log('API Response:', res);
} catch (error) {
  // Handle errors
  console.error('API Error:', error);
  setErrorMessage('Failed to add shipment. Please try again.');
} finally {
  setLoading(false);
}
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="header-title">Get Available Trucks</h4>
      </Card.Header>
      <Card.Body>
        {/* Display error message if available */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
          </Alert>
        )}

        <Row>
          <Col sm={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Form inputs for getting available trucks */}
              <FormInput
                label="Shipment Type"
                type="text"
                name="shipmentType"
                containerClass="mb-3"
                register={register}
                key="shipmentType"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Shipment Description"
                type="text"
                name="shipmentDescription"
                containerClass="mb-3"
                register={register}
                key="shipmentDescription"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Shipment Cost"
                type="number"
                name="shipmentCost"
                containerClass="mb-3"
                register={register}
                key="shipmentCost"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Payment Method"
                type="text"
                name="paymentMethods"
                containerClass="mb-3"
                register={register}
                key="paymentMethods"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Sender Name"
                type="text"
                name="sender.name"
                containerClass="mb-3"
                register={register}
                key="sender.name"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Sender Phone"
                type="text"
                name="sender.phone"
                containerClass="mb-3"
                register={register}
                key="sender.phone"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Receiver Name"
                type="text"
                name="receiver.name"
                containerClass="mb-3"
                register={register}
                key="receiver.name"
                errors={errors}
                control={control}
              />

              <FormInput
                label="Receiver Phone"
                type="text"
                name="receiver.phone"
                containerClass="mb-3"
                register={register}
                key="receiver.phone"
                errors={errors}
                control={control}
              />

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="waves-effect waves-light"
              >
                Add Shipment
              </Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ShipmentForm;
