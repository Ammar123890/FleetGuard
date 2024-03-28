import React, { useEffect, useState } from 'react';
import { Row, Table } from 'react-bootstrap';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface StripedRowsProps {
  drivers: Driver[];
//   onDelete: (deletedDriverId: number) => void;
}

const StripedRows: React.FC<StripedRowsProps> = ({ drivers}) => {

  return (
    <>
      <ToastContainer />

      

      {/* Driver Table */}
      <div className="table-responsive">
        <Table className="table-striped table-centered mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th className="d-none d-md-table-cell">Phone</th>
              <th className="d-none d-md-table-cell">License Number</th>
              <th className="d-none d-md-table-cell">License Expiry</th>
              
              <th>Experience</th>
           
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{driver.name}</td>
                <td className="d-none d-md-table-cell">{driver.phone}</td>
                <td className="d-none d-md-table-cell">{driver.licenseNumber}</td>
                <td className="d-none d-md-table-cell">{driver.licenseExpiry}</td>
                
                <td>{driver.experience}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

const DriversRecord = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileApi.getDrivers({
          Authorization: `Bearer ${token}`,
        });

        if (!res) {
          throw new Error('Failed to fetch data');
        }
console.log(res)
        const data: Driver[] = res.data;
        console.log(data)
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <>
      <PageBreadcrumb title="Available Drivers" subName="Drivers" />
      <Row>
        <StripedRows  drivers={drivers}/>
      </Row>
    </>
  );
};

export default DriversRecord;
