import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

interface StatisticWidget {
  title: string;
  stats: string;
  // change: string;
  icon: string;
  variant: string;
}

const Statistics = () => {
  const [statistics, setStatistics] = useState<StatisticWidget[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch('http://localhost:5000/api/customer/statistics/get', { headers });
        const data = await response.json();

        // Update the statistics array with API data
        setStatistics([
          {
            title: 'Total Dashcams',
            stats: data.totalDashcams.toString(),
            icon: 'ri-webcam-line',
            variant: 'text-bg-pink',
          },
          {
            title: 'Total Revenue',
            stats: `RS. ${data.totalRevenue.toString()}`,
            icon: 'ri-wallet-2-line',
            variant: 'text-bg-purple',
          },
          {
            title: 'Total Shipments',
            stats: data.totalShipments.toString(),
            icon: 'ri-route-line',
            variant: 'text-bg-info',
          },
          {
            title: 'Total Trucks',
            stats: data.totalTrucks.toString(),
            icon: 'ri-truck-line',
            variant: 'text-bg-primary',
          },
        ]);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <>
      {statistics.map((statistic, index) => (
        <Col xxl={3} lg={3} md={6} sm={12} key={index}>
          <Card className={`widget-flat ${statistic.variant}`}>
            <Card.Body>
              <div className="float-end">
                <i className={`${statistic.icon} widget-icon`}></i>
              </div>
              <h6 className="text-uppercase mt-0" title="Customers">
                {statistic.title}
              </h6>
              <h2 className="my-2">{statistic.stats}</h2>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default Statistics;
