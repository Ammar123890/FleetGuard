import { SetStateAction, useEffect, useState } from 'react';
import { Button, Card, Col, Image, Nav, Row, Tab, Table, Badge, Form, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import bgProfile from '@/assets/images/bg-profile.jpg';

interface CustomerDetails {
  profilPic: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  location: {
    country: string;
    address: string;
    city: string;
  };
}

const EditProfileForm = ({ customerDetails, onSave }: { customerDetails: CustomerDetails; onSave: (updatedDetails: CustomerDetails) => void }) => {
	const [editedDetails, setEditedDetails] = useState<CustomerDetails>(customerDetails);
  
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  const { name, value } = e.target;
	  setEditedDetails((prevDetails) => ({
		...prevDetails,
		[name]: value,
	  }));
	};
  
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	  e.preventDefault();
	  onSave(editedDetails);
	};
  
	return (
		<Form onSubmit={handleSubmit}>
		  <Form.Group className="mb-3" controlId="formProfilPic">
			<Form.Label>Profile Picture URL</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter profile picture URL"
			  name="profilPic"
			  value={editedDetails.profilPic}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formName">
			<Form.Label>Name</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your name"
			  name="name"
			  value={editedDetails.name}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formCompanyName">
			<Form.Label>Company Name</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your company name"
			  name="companyName"
			  value={editedDetails.companyName}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formPhone">
			<Form.Label>Phone</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your phone number"
			  name="phone"
			  value={editedDetails.phone}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formCountry">
			<Form.Label>Country</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your country"
			  name="country"
			  value={editedDetails.location.country}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formAddress">
			<Form.Label>Address</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your address"
			  name="address"
			  value={editedDetails.location.address}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Form.Group className="mb-3" controlId="formCity">
			<Form.Label>City</Form.Label>
			<Form.Control
			  type="text"
			  placeholder="Enter your city"
			  name="city"
			  value={editedDetails.location.city}
			  onChange={handleChange}
			/>
		  </Form.Group>
		  <Button variant="primary" type="submit">
			Save Changes
		  </Button>
		</Form>
	  );
  };
  
  

const ShipmentsTable = () => {
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await customerApi.getShipments({
          Authorization: `Bearer ${token}`,
        });

        if (response.status) {
          setShipments(response.data);
        } else {
          console.error('Failed to fetch shipments:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
      }
    };

    fetchShipments();
  }, []);

  const getStatusBadgeVariant = (status: any) => {
    switch (status) {
      case 'pending':
        return 'danger';
      case 'in transit':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Serial No.</th>
          <th>Shipment Type</th>
          <th>Shipment Destination</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {shipments.map((shipment, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{shipment.shipmentType}</td>
            <td>{shipment.shipmentDestination.location}</td>
            <td>
              <Badge bg={getStatusBadgeVariant(shipment.shipmentStatus)} text="light">
                {shipment.shipmentStatus}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};


const ProfilePages = () => {
	const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
	  const fetchCustomerDetails = async () => {
		try {
		  const token = localStorage.getItem('token');
		  const response = await customerApi.getCustomerDetails({
			Authorization: `Bearer ${token}`,
		  });
  
		  if (response.status) {
        console.log(response)
			setCustomerDetails(response.data);
		  } else {
			console.error('Failed to fetch customer details:', response.data.error);
		  }
		} catch (error) {
		  console.error('Error fetching customer details:', error);
		}
	  };
  
	  fetchCustomerDetails();
	}, []);
  
	const handleEditProfile = () => {
		setEditMode(true);
		setShowModal(true); // Show the modal when entering edit mode
	  };
  
	const handleSaveProfile = async (updatedDetails: SetStateAction<CustomerDetails | null>) => {
		try {
		  const token = localStorage.getItem('token');
		  const response = await fetch('http://localhost:5000/api/auth/customer/editdetails', {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedDetails),
		  });
	
		  const data = await response.json();
	
		  if (response.ok) {
			setCustomerDetails(updatedDetails as CustomerDetails);
			console.log('Customer details updated successfully:', data);
		  } else {
			console.error('Failed to update customer details:', data.error);
		  }
		} catch (error) {
		  console.error('Error updating customer details:', error);
		} finally {
			setEditMode(false);
			setShowModal(false);
		}
	  };
  
  return (
    <>
      <div>
        <Row>
          <Col sm={12}>
            <div className="profile-bg-picture"
							style={{ backgroundImage: `url(${bgProfile})` }}>
              <span className="picture-bg-overlay" />
            </div>
            <div className="profile-user-box">
              <Row>
                <Col sm={6}>
                  <div className="profile-user-img">
                    <Image src={customerDetails?.profilPic} className="avatar-lg rounded-circle" alt="user" />
                  </div>
                  <div>
                    <h4 className="mt-4 fs-17 ellipsis">{customerDetails?.name}</h4>
                    <p className="font-13">{customerDetails?.companyName}</p>
                    <p className="text-muted mb-0">
                      <small>{`${customerDetails?.location?.city}, ${customerDetails?.location?.country}`}</small>
                    </p>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex justify-content-end align-items-center gap-2">
				   
                  
                  <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {customerDetails !== null ? (
      <EditProfileForm
        customerDetails={customerDetails}
        onSave={handleSaveProfile}
      />
    ) : (
      <div>Loading...</div>
    )}
                    </Modal.Body>
                  </Modal>
                
                  <Button type="button" variant="soft-danger" onClick={handleEditProfile}>
                    <i className="ri-settings-2-line align-text-bottom me-1 fs-16 lh-1" /> Edit Profile
                  </Button>
                
                    {/* <Button variant="soft-info">
                      {' '}
                      <i className="ri-check-double-fill fs-18 me-1 lh-1" /> Following
                    </Button> */}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Card className="p-0">
          <Card.Body className="p-0">
            <div className="profile-content">
              <Tab.Container defaultActiveKey="About">
                <Nav as="ul" justify className="nav-underline gap-0">
                  <Nav.Item as="li">
                    <Nav.Link as={Link} to="#" eventKey="About" type="button">
                      About
                    </Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link eventKey="Activities" to="#" as={Link} type="button">
                      Activities
                    </Nav.Link>
                  </Nav.Item> */}
                  <Nav.Item>
                    <Nav.Link as={Link} type="button" to="#" eventKey="Shipments">
                      Shipments
                    </Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link type="button" as={Link} to="#" eventKey="Projects">
                      Projects
                    </Nav.Link>
                  </Nav.Item> */}
                </Nav>
                <Tab.Content className="m-0 p-4">
                  <Tab.Pane eventKey="About" id="aboutme" tabIndex={0}>
                    <div className="profile-desk">
                      <h5 className="text-uppercase fs-17 text-dark">{customerDetails?.name}</h5>
                      <div className="designation mb-4">{customerDetails?.companyName}</div>
					  <p className="text-muted fs-16">
														I am a seasoned Fleet Manager with a passion for optimizing 
														transportation operations. With over 10 years of experience in the industry,
														 I have successfully overseen and managed large fleets of vehicles, ensuring efficiency, 
														 compliance, and cost-effectiveness.
													</p>
                      {/* <p className="text-muted fs-16">{customerDetails?.description}</p> */}
                      <h5 className="mt-4 fs-17 text-dark">Contact Information</h5>
                      <table className="table table-condensed mb-0 border-top">
                        <tbody>
                          {/* <tr>
                            <th scope="row">Url</th>
                            <td>
                              <Link to={customerDetails?.url} className="ng-binding">
                                {customerDetails?.url}
                              </Link>
                            </td>
                          </tr> */}
                          <tr>
                            <th scope="row">Email</th>
                            <td>
                              <Link to={`mailto:${customerDetails?.email}`} className="ng-binding">
                                {customerDetails?.email}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Phone</th>
                            <td className="ng-binding">{customerDetails?.phone}</td>
                          </tr>
                          {/* <tr>
                            <th scope="row">Skype</th>
                            <td>
                              <Link to={`skype:${customerDetails?.skype}`} className="ng-binding">
                                {customerDetails?.skype}
                              </Link>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </Tab.Pane>
				  <Tab.Pane eventKey="Shipments" id="shipments">
				  <div className="profile-desk">
            <h5 className="text-uppercase fs-17 text-dark">Shipment Details</h5>
            <ShipmentsTable />
          </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ProfilePages;
