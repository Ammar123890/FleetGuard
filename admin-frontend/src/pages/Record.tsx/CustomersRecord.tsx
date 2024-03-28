import React, { useEffect, useState } from 'react';
import { Row, Table } from 'react-bootstrap';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Customer {
    name: string,
    companyName: string,
    phone: string,
}

interface StripedRowsProps {
  customers: Customer[];
//   onDelete: (deletedDriverId: number) => void;
}

const StripedRows: React.FC<StripedRowsProps> = ({ customers}) => {

  return (
    <>
      <ToastContainer />

      

      {/* Customer Table */}
      <div className="table-responsive">
        <Table className="table-striped table-centered mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th className="d-none d-md-table-cell">Phone</th>
              <th className="d-none d-md-table-cell">Company Name</th>
        
           
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{customer.name}</td>
                <td className="d-none d-md-table-cell">{customer.phone}</td>
                <td className="d-none d-md-table-cell">{customer.companyName}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

const CustomersRecord = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileApi.getCustomers({
          Authorization: `Bearer ${token}`,
        });

        if (!res) {
          throw new Error('Failed to fetch data');
        }
console.log(res)
        const data: Customer[] = res.data;
        console.log(data)
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <>
      <PageBreadcrumb title="Available Customers" subName="Customers" />
      <Row>
        <StripedRows  customers={customers}/>
      </Row>
    </>
  );
};

export default CustomersRecord;
