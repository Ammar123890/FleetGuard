import  { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Modal,Badge, Accordion } from 'react-bootstrap';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Truck {
  availability: any;
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
}

interface Dashcam {
  _id: number;
  model: string;
  pricePerMonth: number;
  quantity: number;
  description: string;
  serialNumber: string;
}

const AssignTruck = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [dashcams, setDashcams] = useState<Dashcam[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getTrucks({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch trucks');
        }

        const data: Truck[] = res.trucks;
        setTrucks(data);
      } catch (error) {
        console.error('Error fetching trucks:', error);
        setError('Error fetching trucks. Please try again.');
      }
    };

    fetchTrucks();
  }, []);

  const handleAssignDashcam = async (truck: Truck) => {
    try {
      const token = localStorage.getItem('token');
      const dashcamRes = await customerApi.getDashcams({
        Authorization: `Bearer ${token}`,
      });

      if (!dashcamRes.status) {
        throw new Error('Failed to fetch dashcams');
      }

      const dashcamData: Dashcam[] = dashcamRes.data;
      setDashcams(dashcamData);
      setSelectedTruck(truck);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching dashcams:', error);
      setError('Error fetching dashcams. Please try again.'); 
    }
  };

  const handleConfirmAssign = async (dashcamId: any) => {
    try {
      const token = localStorage.getItem('token');
      console.log(dashcamId, selectedTruck?._id, token )
      const res = await customerApi.assignDashcamToTruck(dashcamId, selectedTruck?._id, {
        Authorization: `Bearer ${token}`,
      });

      if (!res.status) {
        throw new Error('Failed to assign dashcam');
      }

      const updatedTrucks = await customerApi.getTrucks({
        Authorization: `Bearer ${token}`,
      });

      if (!updatedTrucks.status) {
        throw new Error('Failed to fetch updated trucks');
        
      }

      setTrucks(updatedTrucks.trucks);
      setShowModal(false);
      setSelectedTruck(null);
    } catch (error) {
      console.error('Error assigning dashcam:', error);
      setError('Dashcam already assigned to another truck. Please select another.'); 
    }
  };

  return (
    <>
      <PageBreadcrumb title="Assign Dashcam to Trucks" subName="Truck Management" />
      
      <Row>
  {trucks.map((truck) => (
    <Col key={truck._id} md={6} className="mb-4">
      <Card>
        <Card.Header>
          <h5 className="mb-0">{truck.make} - {truck.truckNumber}</h5>
        </Card.Header>
        <Card.Body>
          <dl className="row mb-0">
            <dt className="col-sm-4">Registration:</dt>
            <dd className="col-sm-8">{truck.registration}</dd>

            <dt className="col-sm-4">Weight Capacity:</dt>
            <dd className="col-sm-8">{truck.weightCapacity} kg</dd>

            <dt className="col-sm-4">Area Capacity:</dt>
            <dd className="col-sm-8">{truck.areaCapacity} sq. units</dd>

            <dt className="col-sm-4">Year:</dt>
            <dd className="col-sm-8">{truck.year}</dd>

            <dt className="col-sm-4">Owner:</dt>
            <dd className="col-sm-8">{truck.owner}</dd>

            <dt className="col-sm-4">Availability:</dt>
            <dd className="col-sm-8">
              <Badge variant={truck.availability ? 'success' : 'danger'}>
                {truck.availability ? 'Available' : 'Not Available'}
              </Badge>
            </dd>

            <dt className="col-sm-4">Assigned Dashcam:</dt>
            <dd className="col-sm-8">{truck.assignedDashcam || 'Not Assigned'}</dd>
          </dl>

          {!truck.assignedDashcam && (
            <Button
              variant="success"
              onClick={() => handleAssignDashcam(truck)}
              className="mt-3"
            >
              Assign Dashcam
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>


      {/* Assign Dashcam Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Dashcam to {selectedTruck?.make} - {selectedTruck?.truckNumber}</Modal.Title>
          {error && <div className="alert alert-danger">{error}</div>}
        </Modal.Header>
        <Modal.Body>
        <Accordion>
            {dashcams.map((dashcam, index) => (
              <Accordion.Item key={dashcam._id} eventKey={index.toString()}>
                <Accordion.Header>{dashcam.serialNumber}</Accordion.Header>
                <Accordion.Body>
                  <p>Model: {dashcam.model}</p>
                  <p>Price Per Month: {dashcam.pricePerMonth}</p>
                  {/* Add more dashcam information as needed */}
                  <Button
                    variant="success"
                    onClick={() => handleConfirmAssign(dashcam._id)}
                  >
                    Select Dashcam
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {/* <Button
            variant="success"
            onClick={() => handleConfirmAssign(document.getElementById('dashcamId')?.value || '')}
          >
            Confirm Assign
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignTruck;
