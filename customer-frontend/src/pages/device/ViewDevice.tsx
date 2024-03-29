
import { Card, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { profileApi } from '@/common';


// Components
import { PageBreadcrumb } from '@/components'


interface Device {
    _id: number;
    model: string;
    price: number;
    quantity: number;
    description: string;
  }

const StripedRows = () => {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
      const fetchData = async () => {

        try {
            const token = localStorage.getItem('token');
            const res = await profileApi.viewDevice( {
              Authorization: `Bearer ${token}`,
            });
  
            if (!res.status) {
              throw new Error('Failed to fetch data');
            }
            console.log(res)
            const data: Device[] = res.data; // Assuming your response has an array of devices
            console.log(data)
            console.log(data[0]._id)
          setDevices(data);
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
                                    {/* <th>ID</th> */}
									<th>Model</th>
									<th>Price</th>
									<th>Quantity</th>
                                    <th>Description</th>
									<th>Action</th>
								</tr>
							</thead>
                            <tbody>
              {devices.map((dashcam, idx) => (
                <tr key={idx}>
                    <td>{idx + 1}</td>
                    {/* <td>{dashcam._id}</td> */}
                  <td>{dashcam.model}</td>
                  <td>{dashcam.price}</td>
                  <td>{dashcam.quantity}</td>
                  <td>{dashcam.description}</td>
                  <td>
                    <Link to={`/admin/dashcam/edit/${dashcam._id}`} className="text-reset fs-16 px-1">
                      <i className="ri-pencil-line" />
                    </Link>
                    <Link to={`/delete/${dashcam._id}`} className="text-reset fs-16 px-1">
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
	)
}

const ViewDevice = () => {
	return (
		<>
			<PageBreadcrumb title="Available Devices" subName="Tables" />
		
			<Row>
				<Col xl={6}>
					<StripedRows />
				</Col>
				<Col xl={6}>
					{/* <TableHeadOptions /> */}
				</Col>
			</Row>

		

			

			
		</>
	)
}

export default ViewDevice
