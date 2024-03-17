// SalesPage.jsx

import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Row, Col } from 'react-bootstrap';
// import { useLocation } from 'react-router-dom';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Sale {
  _id: number;
  totalSales: number;
  count: number;
}

const SalesPage: React.FC = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: '2024', month: '3' });
  // const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(filters.year)
        const res = await profileApi.getSalesData(
          filters.year, filters.month,
          { Authorization: `Bearer ${token}` }
        );
        console.log(res)
        if (!res) {
          throw new Error('Failed to fetch data');
        }
        // console.log(res.salesData)
        const data: Sale[] = res;
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <>
      <Card>
        <Card.Body>
          <PageBreadcrumb title="Sales Page" subName="Tables" />

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter year"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="formMonth">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter month"
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="table-responsive-sm">
            <Table className="table-striped table-centered mb-0">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Total Sales</th>
                  <th>Count</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{sale.totalSales}</td>
                    <td>{sale.count}</td>
                    {/* <td>
                      <Link to={`/sales/edit/${sale._id}`} className="text-reset fs-16 px-1">
                        <i className="ri-pencil-line" />
                      </Link>
                      
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default SalesPage;
