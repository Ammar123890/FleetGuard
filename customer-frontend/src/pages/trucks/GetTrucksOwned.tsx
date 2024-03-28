import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Truck {
  _id: number;
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
  type: string;
}

interface StripedRowsProps {
  trucks: Truck[];
  onDelete: (deletedTruckId: number) => void;
}

const StripedRows: React.FC<StripedRowsProps> = ({ trucks, onDelete }) => {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);


  const handleConfirmDelete = () => {
    // Call the API to delete the selected truck
    if (selectedTruck) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      customerApi
        .deleteTruck(selectedTruck._id.toString(), {
          Authorization: `Bearer ${token}`,
        })
        .then((res) => {
          if (res.status) {
            // Successfully deleted
            onDelete(selectedTruck._id);
            toast.success(`${selectedTruck.truckNumber} has been deleted successfully!`);
          } else {
            // Handle error
            console.error('Failed to delete truck:', res.data.error);
            toast.error('Failed to delete truck. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error deleting truck:', error);
          toast.error('An error occurred while deleting the truck.');
        })
        .finally(() => {
          // Close the modal
          setSelectedTruck(null);
        });
    }
  };

  return (
    <>
      {/* Modal for Delete Confirmation */}
      <Modal show={!!selectedTruck} onHide={() => setSelectedTruck(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Truck</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTruck && (
            <p>
              Are you sure you want to delete {selectedTruck.truckNumber}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTruck(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Truck Table */}
      <div className="table-responsive-sm">
        <Table className="table-striped table-centered mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Truck Number</th>
              <th>Make</th>
              <th>Year</th>
              <th>Registration</th>
              <th>Weight Capacity</th>
              <th>Area Capacity</th>
              <th>Truck Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{truck.truckNumber}</td>
                <td>{truck.make}</td>
                <td>{truck.year}</td>
                <td>{truck.registration}</td>
                <td>{truck.weightCapacity}</td>
                <td>{truck.areaCapacity}</td>
                <td>{truck.type}</td>

                <td>
                  <Link to={`/customer/truck/edit/${truck._id}`} className="text-reset fs-16 px-1">
                    <i className="ri-pencil-line" />
                  </Link>
                  <Link
                    to="#"
                    className="text-reset fs-16 px-1"
                    onClick={() => setSelectedTruck(truck)}
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

const GetTrucksOwned = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getTrucks({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Truck[] = res.data;
        setTrucks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (deletedTruckId: number) => {
    // Update the trucks state by removing the deleted truck
    setTrucks((prevTrucks) => prevTrucks.filter((truck) => truck._id !== deletedTruckId));
  };

  return (
    <>
      <ToastContainer />
      <PageBreadcrumb title="Available Trucks" subName="Trucks" />
      <Row>
        <Col xl={12}>
          <StripedRows trucks={trucks} onDelete={handleDelete} />
        </Col>
      </Row>
    </>
  );
};

export default GetTrucksOwned;
