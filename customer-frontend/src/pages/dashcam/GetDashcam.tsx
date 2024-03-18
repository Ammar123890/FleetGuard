import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { customerApi } from '@/common';
import { PageBreadcrumb } from '@/components';

interface Dashcam {
  _id: number;
  model: string;
  pricePerMonth: number;
  quantity: number;
  description: string;
  serialNumber: string;
}

const GetDashcam = () => {
  const [dashcams, setDashcams] = useState<Dashcam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await customerApi.getDashcams({
          Authorization: `Bearer ${token}`,
        });
        console.log('res ', res)
        if (!res.status) {
          throw new Error('Failed to fetch dashcams');
        }

        const data: Dashcam[] = res.data;
        setDashcams(data);
      } catch (error) {
        console.error('Error fetching dashcams:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageBreadcrumb title="All Dashcams" subName="Purchase" />

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Model</th>
                  <th>Package(Price per Month)</th>
                  {/* <th>Quantity</th> */}
                  <th>SerialNumber</th>
                </tr>
              </thead>
              <tbody>
                {dashcams.map((dashcam, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{dashcam.model}</td>
                    <td>{dashcam.pricePerMonth}</td>
                    <td>{dashcam.serialNumber}</td>
                   
                    {/* <td>{dashcam.description}</td> */}
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

export default GetDashcam;
