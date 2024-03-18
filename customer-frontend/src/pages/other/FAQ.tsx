import { Button, Card, Col, Row } from 'react-bootstrap';

// components
import { PageBreadcrumb } from '@/components';

const FleetFAQ = () => {
  return (
    <>
      <PageBreadcrumb title="FAQ" subName="Pages" />
      <Row>
        <Col>
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="mb-4 text-center">
                <h3 className="">Frequently Asked Questions</h3>
                <p className="text-muted mt-3">
                  Do you have questions about our fleet management services, vehicle tracking, or other aspects of our business? Here you can find some helpful answers to frequently asked questions (FAQ).
                </p>

                <Button type="button" variant="success" className="mt-2">
                  <i className="ri-mail-line me-1"></i> Email us your question
                </Button>
                {/* <Button type="button" variant="info" className="mt-2 ms-1">
                  <i className="ri-twitter-line me-1"></i> Send us a tweet
                </Button> */}
              </div>
            </Col>
          </Row>
          <Card>
            <Card.Body>
              <Row className="justify-content-center mt-4">
                <Col xs={10}>
                  <Row>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question" data-wow-delay=".1s">
                          How does the vehicle tracking system work?
                        </h4>
                        <p className="faq-answer mb-4">
                          Our vehicle tracking system uses GPS technology to track and monitor the location, speed, and other parameters of your fleet vehicles in real-time.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question">
                          What types of vehicles can be monitored in the fleet management system?
                        </h4>
                        <p className="faq-answer mb-4">
                          Our fleet management system can monitor a variety of vehicles, including cars, trucks, vans, and specialized vehicles used in your business operations.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question">
                          How can fleet management improve fuel efficiency?
                        </h4>
                        <p className="faq-answer mb-4">
                          Fleet management helps optimize routes, reduce idle time, and implement fuel-efficient driving practices, contributing to overall fuel efficiency and cost savings.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question" data-wow-delay=".1s">
                          Is the vehicle tracking system compatible with all trucks makes and models?
                        </h4>
                        <p className="faq-answer mb-4">
                          Our vehicle tracking system is designed to be compatible with a wide range of trucks makes and models, providing flexibility for businesses with diverse fleets.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question">
                          How does preventive maintenance work in fleet management?
                        </h4>
                        <p className="faq-answer mb-4">
                          Fleet management systems can schedule and track preventive maintenance tasks, ensuring timely servicing of vehicles to prevent breakdowns and extend their lifespan.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <div className="faq-question-q-box">Q.</div>
                        <h4 className="faq-question">
                          Can I monitor driver behavior using the fleet management system?
                        </h4>
                        <p className="faq-answer mb-4">
                          Yes, our fleet management system provides insights into driver behavior, including speeding, harsh braking, and idling, helping improve overall safety and efficiency.
                        </p>
                      </div>
                    </Col>
                    {/* Add more fleet-related FAQs as needed */}
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default FleetFAQ;
