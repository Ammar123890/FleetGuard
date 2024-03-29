import { Col, Row } from 'react-bootstrap'
import Statistics from './Statistics'
// import WeeklySelesChart from './WeeklySelesChart'
// import YearlySelesChart from './YearlySelesChart'
// import SalesChart from './SalesChart'
// import ChatList from './ChatList'
import Projects from './Projects'

// componets
import { PageBreadcrumb } from '@/components'

// data
// import { chatMessages, statistics } from './data'

const Dashboard = () => {
	return (
		<>
			<PageBreadcrumb title="Customer Panel" subName="Dashboards" />
		 	<Row>
				<Statistics/>
			{/* {(statistics || []).map((item, idx) => {
					return (
						<Col xxl={3} sm={6} key={idx}>
							<Statistics
								title={item.title}
								stats={item.stats}
								change={item.change}
								icon={item.icon}
								variant={item.variant}
							/>
						</Col>
					)
				})} */}
			</Row>
			{/* <Row>
				<Col lg={8}>
					<SalesChart />
				</Col>
				<Col lg={4}>
					<YearlySelesChart />
				</Col>
			</Row> */}
			{/* <Row>
				<Col lg={8}>
					<WeeklySelesChart />
				</Col>
				<Col lg={4}>
					<YearlySelesChart />
				</Col>
			</Row> */}

			<Row>
				{/* <Col xl={4}>
					<ChatList messages={chatMessages} />
				</Col> */}

				<Col xl={14}>
					<Projects />
				</Col>
			</Row>
		</>
	)
}

export default Dashboard
