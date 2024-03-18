import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from '@/common';
import { Card, Row,  Badge, Image } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const RoadConditions: React.FC = () => {
  const { lt, lg } = useParams<{ lt: string; lg: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }
        const res = await customerApi.getWeather(lg!, lt!, {
          Authorization: `Bearer ${token}`,
        });

        const data: WeatherData = res.data;
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [lt, lg]);

  // Function to determine badge color based on visibility
  const getVisibilityColor = (visibility: number): string => {
    if (visibility >= 10000) {
      return 'success'; // Green for good visibility
    } else if (visibility >= 5000) {
      return 'warning'; // Yellow for medium visibility
    } else {
      return 'danger'; // Red for bad visibility
    }
  };
  const getVisibilityRank = (visibility: number): string => {
    if (visibility >= 10000) {
      return 'Good'; // Green for good visibility
    } else if (visibility >= 5000) {
      return 'Average'; // Yellow for medium visibility
    } else {
      return 'Poor'; // Red for bad visibility
    }
  };

  return (
    <div>
      <PageBreadcrumb title="Road Conditions" subName="Weather" />
      <Row className="justify-content-center">
        <Card className="rounded-top-0 border-3 border-end-0 border-start-0 border-bottom-0 border-top border-success">
          <Card.Body className="border-bottom p-3">
            <Card.Title>
              <h2>Road Conditions</h2>
            </Card.Title>
            {weatherData && (
              <div className="mt-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{  justifyContent: 'space-between', alignItems: 'center', marginLeft: '80px' }}>
                  <p>
                    <strong>Visibility:</strong> {weatherData.visibility} meters{' '}
                    <Badge bg={getVisibilityColor(weatherData.visibility)}>
                      {getVisibilityRank(weatherData.visibility)}
                    </Badge>
                  </p>
                  <p>
                    <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
                  </p>
                  <p>
                    <strong>Wind Direction:</strong> {weatherData.wind.deg}°
                  </p>
                  <p>
                    <strong>Pressure:</strong> {weatherData.main.pressure} hPa
                  </p>
                  <p>
                    <strong>Humidity:</strong> {weatherData.main.humidity}%
                  </p>
                </div>
                <div>
  {/* Add your image here */}
  <Image
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdOUDa5mu0i9ooLpBemOK4yLnYqVO06eK4JQ&usqp=CAU"
    alt="Weather Image"
    style={{ width: '200px', height: 'auto' }}
    fluid
  />
</div>

              </div>
            )}
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};

export default RoadConditions;
