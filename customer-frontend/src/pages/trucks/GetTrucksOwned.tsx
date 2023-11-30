import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Truck {
  _id: number;
  truckNumber: string;
  make: string;
  year: string;
  registration: string;
  weightCapacity: number;
  areaCapacity: number;
}

const StripedRows = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getTrucks({
          Authorization: `Bearer ${token}`,
        });

        if (!res.status) {
          throw new Error('Failed to fetch data');
        }

        const data: Truck[] = res.data;
        setTrucks(data);
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
                  <th>Truck Number</th>
                  <th>Make</th>
                  <th>Year</th>
                  <th>Registration</th>
                  <th>Weight Capacity</th>
                  <th>Area Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{truck.truckNumber}</td>
                    <td>{truck.make}</td>
                    <td>{truck.year}</td>
                    <td>{truck.registration}</td>
                    <td>{truck.weightCapacity}</td>
                    <td>{truck.areaCapacity}</td>
                    <td>
                      <Link to={`/customer/truck/edit/${truck._id}`} className="text-reset fs-16 px-1">
                        <i className="ri-pencil-line" />
                      </Link>
                      <Link to={`/delete/${truck._id}`} className="text-reset fs-16 px-1">
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

const GetTrucksOwned = () => {
  return (
    <>
      <PageBreadcrumb title="Available Trucks" subName="Tables" />
      <Row>
        <Col xl={12}>
          <StripedRows />
        </Col>
      </Row>
    </>
  );
};

export default GetTrucksOwned;
