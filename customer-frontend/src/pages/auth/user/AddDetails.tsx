import { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/common';
import { FormInput } from '@/components';
import AuthLayout from '../AuthLayout'; // Added import

const AddDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilPic: '',
    name: '',
    companyName: '',
    phone: '',
    country: '',
    address: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await authApi.addCustomerDetails(
        {
          profilPic: formData.profilPic,
          name: formData.name,
          companyName: formData.companyName,
          phone: formData.phone,
          location: {
            country: formData.country,
            address: formData.address,
            city: formData.city,
          },
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
  
      if (response.status) {
        setSuccessMessage('Details added successfully!');
        setErrorMessage(null);

        // Navigate to another page after successful submission
        navigate('/dashboard'); // Change the route as needed
      } else {
        setErrorMessage('Failed to add details. Please try again.');
        setSuccessMessage(null);
      }

      console.log('API Response:', response);
    } catch (error) {
      console.error('Error adding details:', error);
      setErrorMessage('Failed to add details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      authTitle="Add Details" // Added title
      helpText="Please provide the required details to complete your profile." // Added helpText
    >
      <Container className="mt-5">
        <Card>
          <Card.Body>
            {successMessage && (
              <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <FormInput
                label="Profile Picture URL"
                type="text"
                name="profilPic"
                containerClass="mb-3"
                value={formData.profilPic}
                onChange={handleChange}
                placeholder="Enter profile picture URL"
                required
              />

              <FormInput
                label="Name"
                type="text"
                name="name"
                containerClass="mb-3"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

              <FormInput
                label="Company Name"
                type="text"
                name="companyName"
                containerClass="mb-3"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />

              <FormInput
                label="Phone"
                type="tel"
                name="phone"
                containerClass="mb-3"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />

              <FormInput
                label="Country"
                type="text"
                name="country"
                containerClass="mb-3"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter your country"
                required
              />

              <FormInput
                label="Address"
                type="text"
                name="address"
                containerClass="mb-3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />

              <FormInput
                label="City"
                type="text"
                name="city"
                containerClass="mb-3"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
              />

              <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </AuthLayout>
  );
};

export default AddDetails;
