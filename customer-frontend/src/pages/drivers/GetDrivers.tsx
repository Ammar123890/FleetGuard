import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Driver {
  _id: number;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  age: number;
  address: string;
  experience: number;
}

const StripedRows = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getDrivers({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Driver[] = res.data;
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <div className="table-responsive-sm">
            <Table className="table-striped table-centered mb-0">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>License Number</th>
                  <th>License Expiry</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Experience</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.licenseNumber}</td>
                    <td>{driver.licenseExpiry}</td>
                    <td>{driver.age}</td>
                    <td>{driver.address}</td>
                    <td>{driver.experience}</td>
                    <td>
                      <Link to={`/customer/driver/edit/${driver._id}`} className="text-reset fs-16 px-1">
                        <i className="ri-pencil-line" />
                      </Link>
                      <Link to={`/delete/${driver._id}`} className="text-reset fs-16 px-1">
                        <i className="ri-delete-bin-2-line" />
                      </Link>
                    </td>
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

const GetDrivers = () => {
  return (
    <>
      <PageBreadcrumb title="Available Drivers" subName="Tables" />
      <Row>
        <Col xl={12}>
          <StripedRows />
        </Col>
      </Row>
    </>
  );
};

export default GetDrivers;
