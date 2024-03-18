import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Device {
  _id: string;
  model: string;
  pricePerMonth: number;
  price: number;
  quantity: number;
  description: string;
  __v: number;
}

const Purchase = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.viewDeviceById(id!, {
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Device = res.data;
        setDevice(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      const model = device?.model;
      const value = { model, quantity };
      const res = await customerApi.purchaseDashcam(value, {
        Authorization: `Bearer ${token}`,
      });

      if (!res) {
        throw new Error('Failed to purchase device');
      }

      // Assuming you want to update the device information after purchase
      const res_updated = await customerApi.viewDeviceById(id!, {
        Authorization: `Bearer ${token}`,
      });

      if (!res_updated.status) {
        throw new Error('Failed to fetch data');
      }

      const data: Device = res_updated.data;
      setDevice(data);

      // Set success alert
      setSuccessAlert('Device purchased successfully!');
      setErrorAlert(null);
    } catch (error) {
      console.error('Error purchasing dashcam:', error);

      // Set error alert
      setErrorAlert('Failed to purchase device. Please try again.');
      setSuccessAlert(null);
    }

    // Reset quantity and close the modal
    setQuantity(1);
    setShowModal(false);
  };

  return (
    <>
      <PageBreadcrumb title="Device Details" subName="View Device" />

      <Card>
        <Card.Body>
          {device && (
            <>
              <h2>{device.model}</h2>
              <p>Price: ${device.price}</p>
              <p>Quantity: {device.quantity}</p>
              <p>Description: {device.description}</p>

              <Row className="mt-4">
                <Col md={6}>
                  {/* Go Back Button */}
                  <Button variant="primary" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                </Col>
                <Col md={6} className="d-flex justify-content-end">
                  {/* Buy Button */}
                  <Button variant="success" onClick={() => setShowModal(true)}>
                    Buy
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Purchase Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase {device?.model}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePurchase}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error and Success Alerts */}
      {errorAlert && <Alert variant="danger">{errorAlert}</Alert>}
      {successAlert && <Alert variant="success">{successAlert}</Alert>}
    </>
  );
};

export default Purchase;
