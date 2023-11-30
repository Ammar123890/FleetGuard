import { Button, Col, Row } from 'react-bootstrap'
import AuthLayout from '../AuthLayout'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useRegister from './useRegister'
import { Alert } from 'react-bootstrap';
// Components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'

interface UserData {
  email: string
  password: string
}

const BottomLink = () => {
  return (
    <Row>
      <Col xs={12} className="text-center">
        <p className="text-dark-emphasis">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
          >
            <b>Log In</b>
          </Link>
        </p>
      </Col>
    </Row>
  )
}

const Register = () => {
  const { loading, register, error } = useRegister()

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      
      email: yup
        .string()
        .required('Please enter Email')
        .email('Please enter a valid Email'),
      password: yup.string().required('Please enter Password'),
    })
  )

  return (
    <>
      <PageBreadcrumb title="Register" />
      <AuthLayout
        authTitle="Free Sign Up"
        helpText="Enter your email address and password to access the account."
        bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <div>
          {/* Display error message if available */}
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <VerticalForm<UserData> onSubmit={register} resolver={schemaResolver}>
          
          <FormInput
            label="Email address"
            type="text"
            name="email"
            placeholder="Enter your email"
            containerClass="mb-3"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass="mb-3"
            required
          />

		<FormInput
          label="User Type"
          type="text"
          name="userType"
          placeholder="Enter your user type"
          containerClass="mb-3"
          required
        />

          <div className="mb-0 d-grid text-center">
            <Button
              variant="primary"
              disabled={loading}
              className="fw-semibold"
              type="submit"
            >
              Sign Up
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  )
}

export default Register
