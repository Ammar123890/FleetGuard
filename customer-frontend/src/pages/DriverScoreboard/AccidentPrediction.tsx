import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { customerApi } from '@/common';
import ReactApexChart from 'react-apexcharts';

interface PredictionData {
  data: {
    prediction: number[];
    totalScore: number;
    violationsCount: Record<string, number>;
  };
  driverAgeBand: number;
  timeOfDay: number;
  weather: number;
  speed: number;
  driverExperience: number;
  scoreData: number;
}

const AccidentPrediction: React.FC<PredictionData> = ({ data }) => {
  const accidentProbabilityScale: { [key: number]: string } = {
    0: 'High',
    1: 'Low',
    2: 'Medium',
  };

  const driverAgeBandMapping = {
    0: '18-24',
    1: '25-27',
    2: '28-32',
    3: '33-37',
    4: '38-42',
    5: '43-45',
    6: '46-50',
    7: '50+',
  };

  const timeOfDayMapping = {
    0: 'Evening',
    1: 'Morning',
    2: 'Night',
  };

  const weatherConditionsMapping = {
    0: 'Cloudy',
    1: 'Fog',
    2: 'Rainy',
    3: 'Sunny',
  };

  const { id } = useParams();
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [violationsCount, setViolationsCount] = useState<Record<string, number> | null>(null); // New state for violations count

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await customerApi.getAccidentPrediction({
          Authorization: `Bearer ${token}`,
        }, id);

        if (!response) {
          throw new Error('Failed to fetch data');
        }

        const updatedData = {
          ...response.data,
          driverAgeBand: driverAgeBandMapping[response.data.driverAgeBand as keyof typeof driverAgeBandMapping],
          timeOfDay: timeOfDayMapping[response.data.timeOfDay as keyof typeof timeOfDayMapping],
          weather: weatherConditionsMapping[response.data.weather as keyof typeof weatherConditionsMapping],
        };
        

        setPredictionData(updatedData)
        console.log(error);
      } catch (error) {
        
        setError('Failed');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionData();
  }, [id]);

  useEffect(() => {
    const fetchDriverScoreData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await customerApi.getDriverScore(id!, {
          Authorization: `Bearer ${token}`,
        });

        if (!response) {
          throw new Error('Failed to fetch driver score data');
        }

        setViolationsCount(response.data.violationsCount);
      } catch (error) {
        setError('Failed to fetch driver score data');
      }
    };

    fetchDriverScoreData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!predictionData) {
    return <p>No data available.</p>;
  }

  const prediction = predictionData.data.prediction[0];
  const accidentProbability = accidentProbabilityScale[prediction];

  const chartOptions = {
    labels: ['Accident Prediction'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '70%',
          background: 'rgba(62, 152, 199, 0.1)',
        },
        track: {
          background: '#d6d6d6',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: '38px',
            color: '#f88',
            offsetY: 0,
            formatter: function (val: any) {
              if (val <= 33) {
                return 'High';
              } else if (val > 33 && val <= 66) {
                return 'Medium';
              } else {
                return 'Low';
              }
            },
          },
        },
      },
    },
    colors: ['#4caf50', '#d32f2f', '#ffeb3b'], // Red, Yellow, Green
    series: [((prediction + 1) / 3) * 100],
  };

  const pieChartOptions = {
    labels: Object.keys(violationsCount || {}),
    colors: ['#FF5733', '#33FF57', '#3357FF', '#57FF33', '#5733FF', '#FF3357', '#FFFF33', '#33FFFF', '#FF5733', '#FF33FF'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
      },
    },
    legend: {
      show: true,
      position: 'bottom' as 'bottom',
    },
  };

  const pieChartData = Object.values(violationsCount || {});

  return (
    <div className="container mt-5">
      <Card className="shadow mb-4">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Accident Prediction</h3>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="radialBar"
              height={350}
            />
          </div>
          <div className="text-center mt-4">
            <p className="lead display-6">
              The probability of an accident is {accidentProbability.toLowerCase()}.
            </p>
          </div>
  
          <Row className="mb-4">
            <Col md={12}>
              <hr></hr>
              <h3 className="mb-4 text-center mt-4">Accident Prediction Details</h3>
              <hr></hr>
              <div className="detail-section">
                <Row className="mb-3">
                  <Col md={4}>
                    <p className="detail-label"><strong>Driver Age Band:</strong></p>
                    <p className="detail-value">{predictionData.driverAgeBand}</p>
                  </Col>
                  <Col md={4}>
                    <p className="detail-label"><strong>Time of Day:</strong></p>
                    <p className="detail-value">{predictionData.timeOfDay}</p>
                  </Col>
                  <Col md={4}>
                    <p className="detail-label"><strong>Weather Conditions:</strong></p>
                    <p className="detail-value">{predictionData.weather}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <p className="detail-label"><strong>Speed:</strong></p>
                    <p className="detail-value">{predictionData.speed} km/h</p>
                  </Col>
                  <Col md={4}>
                    <p className="detail-label"><strong>Driver Experience:</strong></p>
                    <p className="detail-value">{predictionData.driverExperience} years</p>
                  </Col>
                  <Col md={4}>
                    <p className="detail-label"><strong>Violation Score:</strong></p>
                    <p className="detail-value">{predictionData.scoreData}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
  
          <Row className="mb-4">
            <Col md={14}>
              <hr></hr>
              <h3 className=" text-center mt-4">Violations Count</h3>
              <hr></hr>
              <div className="d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
                <ReactApexChart
                  options={pieChartOptions}
                  series={pieChartData}
                  type="pie"
                  height={600}
                 
                />
              </div>
            </Col>
          </Row>
  
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccidentPrediction;
