//add shipment 2
import { useState } from 'react'
import { Button, Card, Col, Form, ProgressBar, Row } from 'react-bootstrap'
import { Wizard, Steps, Step } from 'react-albus'
import React from 'react';
import Step1 from './ShipmentInput';
import Step2 from './SelectTruck';
import Step3 from './SelectDriver';
import Step4 from './AddLocation'
import Step5 from './ShipmentForm'

// import GetAvailableShipments from './GetAvailableShipments'

// component
import { PageBreadcrumb } from '@/components'
import GetAvailableShipments from './ShipmentInput'


const ProgressBarWizard = () => {
	return (
	  <Card>
		<Card.Header>
		  <h4 className="header-title mb-0">Add new Shipment</h4>
		</Card.Header>
  
		<Card.Body>
		  <Wizard render={({ step, steps }) => (
			<>
			  <ProgressBar
				animated
				striped
				variant="success"
				now={((steps.indexOf(step) + 1) / steps.length) * 100}
				className="mb-3 progress-sm"
			  />
  
			  <Steps>
				<Step id="step1" render={() => <Step1 />} />
				<Step id="step2" render={() => <Step2 />} />
				<Step id="step3" render={() => <Step3 />} />
				<Step id="step4" render={() => <Step4 />} />
				<Step id="step5" render={() => <Step5 />} />
			  </Steps>
			</>
		  )} />
		</Card.Body>
	  </Card>
	);
  };
  


const AddShipments = () => {
	return (
		<>
			<PageBreadcrumb title="Form Wizard" subName="Forms" />
		

			<Row>
				<Col xs={12}>
					<ProgressBarWizard />
				</Col>

			</Row>
		</>
	)
}

export default AddShipments
