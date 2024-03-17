import React, { useEffect, useState } from 'react';
import {  Col, Row, Table, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Driver {
  _id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  age: number;
  address: string;
  experience: number;
}

interface StripedRowsProps {
  drivers: Driver[];
  onDelete: (deletedDriverId: number) => void;
}

const StripedRows: React.FC<StripedRowsProps> = ({ drivers, onDelete }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

 

  const handleConfirmDelete = () => {
    // Call the API to delete the selected driver
    if (selectedDriver) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      customerApi
        .deleteDriver(selectedDriver._id.toString(), {
          Authorization: `Bearer ${token}`,
        })
        .then((res) => {
          if (res.status) {
            // Successfully deleted
            onDelete(selectedDriver._id);
            toast.success(`${selectedDriver.name} has been deleted successfully!`);
          } else {
            // Handle error
            
            console.error('Failed to delete driver:', res.data.error);
            toast.error('Failed to delete driver. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error deleting driver:', error);
          toast.error('An error occurred while deleting the driver.');
        })
        .finally(() => {
          // Close the modal
          setSelectedDriver(null);
        });
    }
  };

  return (
    <>
      <ToastContainer />

      {/* Modal for Delete Confirmation */}
      <Modal show={!!selectedDriver} onHide={() => setSelectedDriver(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDriver && (
            <p>
              Are you sure you want to delete {selectedDriver.name}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedDriver(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Driver Table */}
      <div className="table-responsive">
        <Table className="table-striped table-centered mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th className="d-none d-md-table-cell">Phone</th>
              <th className="d-none d-md-table-cell">License Number</th>
              <th className="d-none d-md-table-cell">License Expiry</th>
              <th className="d-none d-md-table-cell">Age</th>
              <th>Address</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{driver.name}</td>
                <td className="d-none d-md-table-cell">{driver.phone}</td>
                <td className="d-none d-md-table-cell">{driver.licenseNumber}</td>
                <td className="d-none d-md-table-cell">{driver.licenseExpiry}</td>
                <td className="d-none d-md-table-cell">{driver.age}</td>
                <td>{driver.address}</td>
                <td>{driver.experience}</td>
                <td>
                  <Link to={`/customer/driver/edit/${driver._id}`} className="text-reset fs-16 px-1">
                    <i className="ri-pencil-line" />
                  </Link>
                  <Link
                    to="#"
                    className="text-reset fs-16 px-1"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <i className="ri-delete-bin-2-line" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

const GetDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getDrivers({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Driver[] = res.data;
        
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (deletedDriverId: number) => {
    // Update the drivers state by removing the deleted driver
    setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver._id !== deletedDriverId));
  };

  return (
    <>
      <PageBreadcrumb title="Available Drivers" subName="Drivers" />
      <Row>
        <Col xl={12}>
          <StripedRows drivers={drivers} onDelete={handleDelete} />
        </Col>
      </Row>
    </>
  );
};

export default GetDrivers;
