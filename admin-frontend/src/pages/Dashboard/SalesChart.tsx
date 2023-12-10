import  { useState, useEffect, ChangeEvent } from 'react';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
// import { PageBreadcrumb } from '@/components';
// import { ApexOptions } from 'apexcharts';

const SalesChart = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({ year: 2023, month: 12 });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`http://localhost:5000/api/admin/sales/get?year=${selectedFilter.year}&month=${selectedFilter.month}`, { headers });
      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    setSelectedFilter(prevFilter => ({ ...prevFilter, [field]: value }));
  };

  const handleFilterSubmit = () => {
    fetchData(); // Refetch data with updated filters
  };

  const convertToDateFormat = (monthId: number) => {
    // Assuming monthId is 1-based (January is 1, February is 2, etc.)
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthName = months[monthId - 1];
    return `${monthName} ${selectedFilter.year}`;
  };

  return (
    <>
      {/* <PageBreadcrumb title="Sales Data" subName="Graph" /> */}
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-4">Sales Data Chart</h4>
              <div>
                <Form>
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Year</Form.Label>
                      <Form.Control type="number" value={selectedFilter.year} onChange={(e) => handleFilterChange(e, 'year')} />
                    </Col>
                    <Col>
                      <Form.Label>Month</Form.Label>
                      <Form.Control type="number" value={selectedFilter.month} onChange={(e) => handleFilterChange(e, 'month')} />
                    </Col>
                    <Col>
                      <Button variant="primary" onClick={handleFilterSubmit}>Apply Filters</Button>
                    </Col>
                  </Row>
                </Form>
                <ReactApexChart
                  className="apex-charts"
                  options={{
                    chart: {
                    //   height: 100,
                      type: 'area',
                    },
                    xaxis: {
                      categories: filteredData.map((item) => convertToDateFormat(item._id)),
                    },
                  }}
                  series={[{ name: 'Total Sales', data: filteredData.map(item => item.totalSales) }]}
                  type="area"
				  style={{ height: '550px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SalesChart;
