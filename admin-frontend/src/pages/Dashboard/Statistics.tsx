import  { useState, useEffect } from 'react';
import { Card , Col} from 'react-bootstrap';

interface StatisticWidget {
  title: string;
  stats: string;
  change: string;
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
        const response = await fetch('https://fleetguard.azurewebsites.net/api/admin/statistics/get',  { headers });
        const data = await response.json();
console.log(data)

        // Update the statistics array with API data
        setStatistics([
          {
            title: 'Dashcams Sold',
            stats: data.data.totalDashcamSold.toString(),
            change: `${data.data.changePercentage.dashcamSold}%`,
            icon: 'ri-stock-line',
            variant: 'text-bg-pink',
          },
          {
            title: 'Revenue',
            stats: `RS. ${data.data.totalRevenue.toString()}`,
            change: `${data.data.changePercentage.revenue}%`,
            icon: 'ri-wallet-2-line',
            variant: 'text-bg-purple',
          },
          {
            title: 'Orders',
            stats: data.data.totalOrders.toString(),
            change: `${data.data.changePercentage.orders}%`,
            icon: 'ri-shopping-basket-line',
            variant: 'text-bg-info',
          },
          {
            title: 'Users',
            stats: data.data.totalUsers.toString(),
            change: `${data.data.changePercentage.users}%`,
            icon: 'ri-group-2-line',
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
        <Col xxl={3} sm={6} key={index}>
          <Card className={`widget-flat ${statistic.variant}`}>
            <Card.Body>
              <div className="float-end">
                <i className={`${statistic.icon} widget-icon`}></i>
              </div>
              <h6 className="text-uppercase mt-0" title="Customers">
                {statistic.title}
              </h6>
              <h2 className="my-2">{statistic.stats}</h2>
              <p className="mb-0">
                <span className="badge bg-white bg-opacity-10 me-1">{statistic.change}</span>
                &nbsp;
                <span className="text-nowrap">Since last month</span>
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default Statistics;
