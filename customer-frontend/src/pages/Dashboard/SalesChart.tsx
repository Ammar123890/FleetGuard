import { Card, Col, Row } from 'react-bootstrap'
import ReactApexChart from 'react-apexcharts'
import { PageBreadcrumb } from '@/components'
// import { AreaApexOpt } from '../charts/ApexCharts/data'
import { ApexOptions } from 'apexcharts'

const series = {
	monthDataSeries1: {
	  prices: [
		8107.85, 8128.0, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85,
		8487.7, 8506.9, 8626.2, 8668.95, 8602.3, 8607.55, 8512.9, 8496.25,
		8600.65, 8881.1, 9340.85,
	  ],
	  dates: [
		'13 Nov 2017',
		'14 Nov 2017',
		'15 Nov 2017',
		'16 Nov 2017',
		'17 Nov 2017',
		'20 Nov 2017',
		'21 Nov 2017',
		'22 Nov 2017',
		'23 Nov 2017',
		'24 Nov 2017',
		'27 Nov 2017',
		'28 Nov 2017',
		'29 Nov 2017',
		'30 Nov 2017',
		'01 Dec 2017',
		'04 Dec 2017',
		'05 Dec 2017',
		'06 Dec 2017',
		'07 Dec 2017',
		'08 Dec 2017',
	  ],
	},
	// Add more series if needed
  };

export const AreaApexOpt: ApexOptions = {
	chart: {
		height: 380,
		type: 'area',
		zoom: {
			enabled: false,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 2,
		curve: 'straight',
	},
	colors: ['#3bc0c3'],
	series: [
		{
			name: 'value',
			data: series.monthDataSeries1.prices,
		},
	],
	title: {
		text: 'Fundamental Analysis of Stocks',
		align: 'left',
	},
	subtitle: {
		text: 'Price Movements',
		align: 'left',
	},
	labels: series.monthDataSeries1.dates,
	xaxis: {
		type: 'datetime',
	},
	yaxis: {
		opposite: false,
	},
	legend: {
		horizontalAlign: 'left',
	},
	grid: {
		borderColor: '#f1f3fa',
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				chart: {
					toolbar: {
						show: false,
					},
				},
				legend: {
					show: false,
				},
			},
		},
	],
}


const SalesChart = () => {
	return (
		<>
			{/* <PageBreadcrumb title="Apex Charts" subName="chats" /> */}
			<Row>
				<Col xl={12}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Basic Area Chart</h4>
							<div>
								<ReactApexChart
									className="apex-charts"
									options={AreaApexOpt}
									height={380}
									series={AreaApexOpt.series}
									type="area"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				</Row>
		</>
	)
}

export default SalesChart
