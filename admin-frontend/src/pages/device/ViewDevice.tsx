import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import StripedRows from './StripedRows';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Device {
  _id: number;
  model: string;
  price: number;
  quantity: number;
  description: string;
}

const ViewDevice = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileApi.viewDevice({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Device[] = res.dashcams;
        setDevices(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (deletedDeviceId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const res = await profileApi.deleteDevice(deletedDeviceId, {
        Authorization: `Bearer ${token}`,
      });

      if (res.status) {
        // Successfully deleted
        setDevices((prevDevices) => prevDevices.filter((device) => device._id !== deletedDeviceId));
        toast.success(`${deletedDeviceId} has been deleted successfully!`);
      } else {
        // Handle error
        console.error('Failed to delete device:', res.error);
        toast.error('Failed to delete device. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('An error occurred while deleting the device.');
    } finally {
      // Close the modal
      setSelectedDevice(null);
    }
  };

  const handleShowModal = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleCloseModal = () => {
    setSelectedDevice(null);
  };

  return (
    <>
      <ToastContainer />
      <PageBreadcrumb title="Available Devices" subName="Tables" />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className="table-responsive-sm">
                <Table className="table-striped table-centered mb-0">
                  <thead>
                    <tr>
                      <th>Serial No.</th>
                      <th>Model</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((dashcam, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{dashcam.model}</td>
                        <td>{dashcam.price}</td>
                        <td>{dashcam.quantity}</td>
                        <td>{dashcam.description}</td>
                        <td>
                          <Link to={`/admin/dashcam/edit/${dashcam._id}`} className="text-reset fs-16 px-1">
                            <i className="ri-pencil-line" />
                          </Link>
                          <Link
                            to="#"
                            className="text-reset fs-16 px-1"
                            onClick={() => handleShowModal(dashcam)}
                          >
                            <i className="ri-delete-bin-2-line" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={!!selectedDevice} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDevice && (
            <p>
              Are you sure you want to delete {selectedDevice.model}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedDevice?._id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewDevice;
