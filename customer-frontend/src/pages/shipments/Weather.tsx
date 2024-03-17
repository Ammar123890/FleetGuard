import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from '@/common';
import { Card, Row, Col, Image } from 'react-bootstrap';
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

const Weather: React.FC = () => {
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

        const data: WeatherData = res;
        console.log(res);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [lt, lg]);

  return (
    <div>
      <PageBreadcrumb title="Weather Conditions" subName="Shipment" />
     <Card>

     
      <Row>
        <Col md={6}>
          <Card style={{ height: '100%' }}>
            <Card.Body>
              <Card.Title><h2>Weather Conditions</h2></Card.Title>
              {weatherData && (
                <div className='mt-6'>
                  
                 <p style={{ marginTop: '60px' }}><strong>Temperature:</strong> {weatherData.main.temp} °K</p>
                  <p><strong>Feels Like:</strong> {weatherData.main.feels_like} °K</p>

                  <p><strong>Pressure:</strong> {weatherData.main.pressure} hPa</p>
                  <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
                  
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ height: '100%' }}>
            <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {weatherData && (
                <div className="weather-icon" style={{ width: '100%', textAlign: 'center' }}>
                  <Image 
                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} 
                    alt="Weather Icon" 
                    fluid 
                    style={{ width: '50%', height: 'auto' }} // Adjust icon size
                  />
                   <p><strong>Description:</strong> {weatherData.weather[0].description}</p>
                   <p><strong>Cloud Cover:</strong> {weatherData.clouds.all}%</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Card>
    </div>
  );
};

export default Weather;
