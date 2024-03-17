import { ApexOptions } from 'apexcharts';
import { useState, useEffect, SetStateAction } from 'react';
import { Table, Button, Modal, Card, Alert } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { CustomCardPortlet } from '@/components';
import { customerApi } from '@/common';
import { useParams } from 'react-router-dom';
import calling1 from '@/assets/images/users/calling1.jpg';
import calling2 from '@/assets/images/users/calling2.jpg';
import calling3 from '@/assets/images/users/calling3.jpg';
import fatigue from '@/assets/images/users/fatigue.jpg';
import seatbelt1 from '@/assets/images/users/seatbelt1.jpg';
import seatbelt2 from '@/assets/images/users/seatbelt2.jpg';
import hair1 from '@/assets/images/users/hair1.jpg';
import hair2 from '@/assets/images/users/hair2.jpg';
import texting1 from '@/assets/images/users/texting1.jpg';
import texting2 from '@/assets/images/users/texting2.jpg';
import meal1 from '@/assets/images/users/meal1.jpg';
import meal2 from '@/assets/images/users/meal2.jpg';
import radio1 from '@/assets/images/users/radio1.jpg';
import radio2 from '@/assets/images/users/radio2.jpg';


const noteStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
  padding: '10px',
  marginBottom: '20px',
  border: '1px solid #c3e6cb',
  borderRadius: '4px',
};

// const driverInfoStyle = {
//   marginBottom: '20px',
// };

export const basicRadialBarChart: ApexOptions = {
  chart: {
    height: 350,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%',
      },
      dataLabels: {
        showOn: 'always',
        name: {
          show: false,
        },
        value: {
          show: true,
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#3bc0c3',
          offsetY: 10,
          formatter: function (val) {
            return val + '%';
          },
        },
      },
      track: {
        strokeWidth: '70%',
        background: '#f2f2f2',
      },
    },
  },
  colors: ['#3bc0c3'],
  series: [70],
  labels: ['CRICKET'],
};
import talking1 from '@/assets/images/users/talking1.jpg';
const SafetyCompliance = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSafetyFactor, setSelectedSafetyFactor] = useState('');
  const [violations, setViolations] = useState([]);
  const [shipmentDetails, setShipmentDetails] = useState({
    driverId: '',
    truckId: '',
    shipmentId: '',
    shipmentDestination: '',
    shipmentOrigin: '',
  });
  const [violationDetails, setViolationDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [driverScore, setDriverScore] = useState(70); // Replace with the actual driver score
  const [driverName, setDriverName] = useState();
  const [driverPhone, setDriverPhone] = useState();
  const [violationCounts, setViolationCounts] = useState(null);




  const customSafetyFactors = {
    isSpeedLimitCompliance: 'Speed Limit Compliance',
    isFatigueDetection: 'Fatigue Detection',
    isSeatbeltCompliance: 'Seatbelt Compliance',
    calling: 'Calling on Phone',
    texting: 'Texting on Phone',
    radio: 'Operating Radio',
    hair: 'Hair-related',
    talkingPassenger: 'Talking to Passenger',
    reachingBehind: 'Reaching Behind',
    mealtimeMotion: 'Mealtime Motion',
  };


  const handleShowDetails = async (safetyFactor: SetStateAction<string>) => {

    console.log('f', safetyFactor)
    setSelectedSafetyFactor(safetyFactor);
    setShowModal(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await customerApi.getViolationDetails(id!, safetyFactor, {
        Authorization: `Bearer ${token}`,
      });
      setViolations(response.violationDetails);
 
    } catch (error) {
      console.error('Error fetching violation details:', error);
    }
  };
  
  
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await customerApi.getShipmentById(id!, {
          Authorization: `Bearer ${token}`,
        });
  
        if (!response.status) {
          throw new Error('Failed to fetch shipment details');
        }
  
        const data = response.data;
        setShipmentDetails({
          driverId: data.driver,
          truckId: data.truck,
          shipmentId: data._id,
          shipmentDestination: data.shipmentDestination,
          shipmentOrigin: data.shipmentOrigin,
        });
        setLoading(false);
      } catch (error:any) {
        console.error('Error fetching shipment details:', error);
        setError(error.message || 'Failed to fetch shipment details');
        setLoading(false);
      }
    };
  
    const fetchDriverScore = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await customerApi.getDriverScore(id!, {
          Authorization: `Bearer ${token}`,
        });
        if (!response.status) {
          throw new Error('Failed to fetch driver score');
        }
        setDriverScore(response.totalScore);
        setViolationCounts(response.violationsCount);
        setViolationDetails(response);
        setDriverName(response.driverName);
        setDriverPhone(response.driverPhone)
      } catch (error: any) {
        console.error('Error fetching driver score:', error);
        setError(error.message || 'Failed to fetch driver score');
      }
    };
    fetchShipmentDetails();
    fetchDriverScore();
  }, [id]);
  


 

const handleViewImage = (safetyFactor: string, index: number) => {
    console.log('image', safetyFactor, index)
    if(safetyFactor.includes("calling")){
        if(index == 0){
            setImageUrl(calling1);
        }
        else if(index == 1){
            setImageUrl(calling2);
        }
        else if(index == 2){
            setImageUrl(calling3);
        }
    }
    else if(safetyFactor.includes("texting")){
        if(index == 0){
            setImageUrl(texting1);
        }
        else if(index == 1){
            setImageUrl(texting2);
        }
       
    }
    else if(safetyFactor.includes("Fatigue")){
        if(index == 0){
            setImageUrl(fatigue);
        }
    }
    else if(safetyFactor.includes("Seat")){
        if(index == 0){
            setImageUrl(seatbelt1);
        }
        else if(index==1){
            setImageUrl(seatbelt2)
        }
    }
    else if(safetyFactor.includes("radio")){
        if(index == 0){
            setImageUrl(radio1);
        }
        else if(index==1){
            setImageUrl(radio2)
        }
    }
    else if(safetyFactor.includes("hair")){
        if(index == 0){
            setImageUrl(hair1);
        }
        else if(index==1){
            setImageUrl(hair2)
        }
    }
    else if(safetyFactor.includes("talking")){
        if(index == 0){
            setImageUrl(talking1);
        }
    }
    else if(safetyFactor.includes("meal")){
        if(index == 0){
            setImageUrl(meal1);
        }
        else if(index == 1){
            setImageUrl(meal2);
        }
       
    }
    setShowImage(true);
  };
  const handleCloseImage = () => {
    setShowImage(false);
  };

  const ImageViewer = ({ imageUrl, handleCloseImage }) => {
    return (
      <Modal show={showImage} onHide={handleCloseImage}>
        <Modal.Body>
          <img src={imageUrl} alt="View" style={{ width: '100%', height: 'auto' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImage}>
            Close Image
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-2">
      <CustomCardPortlet cardTitle="Shipment Details" titleClass="header-title">
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              <strong>Driver name:</strong> {driverName}
            </div>
            <div className="col-md-4">
              <strong>Driver phone #:</strong> {driverPhone}
            </div>
            {/* <div className="col-md-4">
              <strong>Truck ID:</strong> {shipmentDetails.truckId}
            </div> */}
            <div className="col-md-4">
              <strong>Shipment ID:</strong> {shipmentDetails.shipmentId}
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <strong>Shipment Destination:</strong> {shipmentDetails.shipmentDestination.location}
            </div>
            <div className="col-md-6">
              <strong>Shipment Origin:</strong> {shipmentDetails.shipmentOrigin.location}
            </div>
          </div>
        </Card.Body>
      </CustomCardPortlet>

      {/* Driver Score Radial Bar Chart */}
      <Card>
        <Card.Header>
        <Alert variant="info" style={noteStyle}>
            In case any shipment has not started yet, the driver's score will be be initially 100.
          </Alert>
          <h1 className="text-center mb-2">Driver Score</h1>
        </Card.Header>
        <Card.Body>
        <div className="d-flex align-items-center justify-content-center">
            {driverScore !== null ? (
              <ReactApexChart
                options={basicRadialBarChart}
                series={[driverScore]}
                type="radialBar"
                height={350}
              />
            ) : (
              <p>Loading driver score...</p>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Safety Compliance Table */}
      <Card>
        <Card.Header>
         
          <h1 className="text-center mb-2">Violation Count for Ongoing Delivery</h1>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="text-center">Safety Factors</th>
                <th className="text-center">Count</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
            {Object.keys(customSafetyFactors).map((factorKey) => (
  <tr key={factorKey}>
    <td className="align-middle">{customSafetyFactors[factorKey]}</td>
    <td className="align-middle">
      <div className="text-center">
        {violationCounts !== null ? violationCounts[factorKey] : 'Loading...'}
      </div>
    </td>
    <td className="text-center align-middle">
      <Button
        onClick={() => handleShowDetails(factorKey)}
        disabled={violationCounts !== null && violationCounts[factorKey] === 0}
      >
        Show Details
      </Button>
    </td>
  </tr>
))}

            </tbody>
          </Table>

          {/* Modal for Violation Details */}
          <Modal show={showModal} onHide={handleCloseModal} style={{ maxWidth: '90%', margin: '0 auto' }}>
            <Modal.Header closeButton>
              <Modal.Title>{`Violation Details - ${selectedSafetyFactor}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowX: 'auto', overflowY: 'auto' }}>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Time</th>
                    <th>Acceleration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((violation, index) => (
                    <tr key={index}>
                      <td>{violation.latitude}, {violation.longitude}</td>
                      <td>{violation.timestamp}</td>
                      <td>{violation.acceleration}</td>
                      <td>
                    <Button onClick={() => handleViewImage(selectedSafetyFactor, index)}>
                      View Image
                    </Button>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>

      <ImageViewer imageUrl={imageUrl} handleCloseImage={handleCloseImage} />
    </div>
  );
};

export default SafetyCompliance;
