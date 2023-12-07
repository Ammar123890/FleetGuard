//add shipment 2
import { useState } from 'react'
import { Button, Card, Col, Form, ProgressBar, Row } from 'react-bootstrap'
import { Wizard, Steps, Step } from 'react-albus'

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
				<Wizard
					render={({ step, steps }) => (
						<>
							<ProgressBar
								animated
								striped
								variant="success"
								now={((steps.indexOf(step) + 1) / steps.length) * 100}
								className="mb-3 progress-sm"
							/>

							<Steps>
								<Step
									id="account"
									render={({ next }) => (
										// <Form>
										// 	<Row>
										// 		<Col>
										// 			<Form.Group as={Row} className="mb-3">
										// 				<Form.Label column md={3} htmlFor="userName">
										// 					User name
										// 				</Form.Label>
										// 				<Col md={9}>
										// 					<Form.Control
										// 						type="text"
										// 						id="userName3"
										// 						name="userName"
										// 						defaultValue="Velonic"
										// 					/>
										// 				</Col>
										// 			</Form.Group>
										// 			<Form.Group as={Row} className="mb-3">
										// 				<Form.Label column md={3} htmlFor="password">
										// 					{' '}
										// 					Password
										// 				</Form.Label>
										// 				<Col md={9}>
										// 					<Form.Control
										// 						type="password"
										// 						id="password3"
										// 						name="password"
										// 						defaultValue="123456789"
										// 					/>
										// 				</Col>
										// 			</Form.Group>
										// 			<Form.Group as={Row} className="mb-3">
										// 				<Form.Label column md={3} htmlFor="confirm">
										// 					Re Password
										// 				</Form.Label>
										// 				<Col md={9}>
										// 					<Form.Control
										// 						type="password"
										// 						id="confirm3"
										// 						name="confirm"
										// 						defaultValue="123456789"
										// 					/>
										// 				</Col>
										// 			</Form.Group>
										// 		</Col>
										// 	</Row>

										// 	<ul className="list-inline wizard mb-0">
										// 		<li className="next list-inline-item float-end">
										// 			<Button variant="info" onClick={next}>
										// 				Add More Info{' '}
										// 				<i className="ri-arrow-right-line ms-1" />
										// 			</Button>
										// 		</li>
										// 	</ul>
										// </Form>
										<GetAvailableShipments/>
									)}
								/>
								

								<Step
									id="profile"
									render={({ next, previous }) => (
										<Form>
											<Row>
												<Col>
													<Form.Group as={Row} className="mb-3">
														<Form.Label column md={3} htmlFor="name">
															{' '}
															First name
														</Form.Label>
														<Col md={9}>
															<Form.Control
																type="text"
																id="name3"
																name="name"
																defaultValue="Francis"
															/>
														</Col>
													</Form.Group>
													<Form.Group as={Row} className="mb-3">
														<Form.Label column md={3} htmlFor="surname3">
															{' '}
															Last name
														</Form.Label>
														<Col md={9}>
															<Form.Control
																type="text"
																id="surname"
																name="surname"
																defaultValue="Brinkman"
															/>
														</Col>
													</Form.Group>

													<Form.Group as={Row} className="mb-3">
														<Form.Label column md={3} htmlFor="email">
															Email
														</Form.Label>
														<Col md={9}>
															<Form.Control
																type="email"
																id="email"
																name="email"
																defaultValue="cory1979@hotmail.com"
															/>
														</Col>
													</Form.Group>
												</Col>
											</Row>

											<ul className="pager wizard mb-0 list-inline">
												<li className="previous list-inline-item">
													<Button variant="light" onClick={previous}>
														<i className="ri-arrow-left-line me-1" /> Back to
														Account
													</Button>
												</li>
												<li className="next list-inline-item float-end">
													<Button variant="info" onClick={next}>
														Add More Info{' '}
														<i className="ri-arrow-right-line ms-1" />
													</Button>
												</li>
											</ul>
										</Form>
									)}
								/>

								<Step
									id="finish"
									render={({ previous }) => (
										<Form>
											<Row>
												<Col>
													<div className="text-center">
														<h2 className="mt-0">
															<i className="ri-check-double-line" />
														</h2>
														<h3 className="mt-0">Thank you !</h3>

														<p className="w-75 mb-2 mx-auto">
															Quisque nec turpis at urna dictum luctus.
															Suspendisse convallis dignissim eros at volutpat.
															In egestas mattis dui. Aliquam mattis dictum
															aliquet.
														</p>

														<div className="mb-3">
															<div className="d-inline-block">
																<Form.Check
																	type="checkbox"
																	id="customCheck3"
																	label="I agree with the Terms and Conditions"
																/>
															</div>
														</div>
													</div>
												</Col>
											</Row>

											<ul className="pager wizard mb-0 list-inline mt-1">
												<li className="previous list-inline-item">
													<Button variant="light" onClick={previous}>
														<i className="ri-arrow-left-line me-1" /> Back to
														Profile
													</Button>
												</li>
												<li className="next list-inline-item float-end">
													<Button variant="info">Submit</Button>
												</li>
											</ul>
										</Form>
									)}
								/>
							</Steps>
						</>
					)}
				/>
			</Card.Body>
		</Card>
	)
}


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
