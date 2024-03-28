import React, { useEffect, useState } from 'react';
import { Row, Table } from 'react-bootstrap';
import { profileApi } from '@/common';
import { PageBreadcrumb } from '@/components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Stock {
   
            model: string,
            pricePerMonth: number,
            price: number,
            quantity: number,
            description: string,
}

interface StripedRowsProps {
  stock:Stock[];
//   onDelete: (deletedDriverId: number) => void;
}

const StripedRows: React.FC<StripedRowsProps> = ({ stock}) => {

  return (
    <>
      <ToastContainer />

      

      {/* Customer Table */}
      <div className="table-responsive">
        <Table className="table-striped table-centered mb-0">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Model</th>
              <th className="d-none d-md-table-cell">Price Per Month</th>
              <th className="d-none d-md-table-cell">Price</th>
              <th className="d-none d-md-table-cell">Quantity</th>
              <th className="d-none d-md-table-cell">Description</th>
           
            </tr>
          </thead>
          <tbody>
            {stock.map((s, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{s.model}</td>
                <td className="d-none d-md-table-cell">{s.pricePerMonth}</td>
                <td className="d-none d-md-table-cell">{s.price}</td>
                <td className="d-none d-md-table-cell">{s.quantity}</td>
                <td className="d-none d-md-table-cell">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

const StockRecord = () => {
  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await profileApi.getStock({
          Authorization: `Bearer ${token}`,
        });

        if (!res) {
          throw new Error('Failed to fetch data');
        }
console.log(res)
        const data: Stock[] = res.data;
        console.log(data)
        setStock(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <>
      <PageBreadcrumb title="Available Stock" subName="Stock" />
      <Row>
        <StripedRows  stock={stock}/>
      </Row>
    </>
  );
};

export default StockRecord;
