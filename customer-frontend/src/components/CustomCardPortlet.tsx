import { useState } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface PortletProps {
	className?: string;
	children?: any;
	cardTitle?: string;
	titleClass?: string;
	isOpen?: boolean;
}

const CustomCardPortlet = (props: PortletProps) => {
	const children = props['children'] || null;
	const cardTitle = props['cardTitle'] || 'Card title';

	const [collapse, setCollapse] = useState<boolean>(props.isOpen || true);
	const [loading, setLoading] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);

	const toggleContent = () => {
		setCollapse(!collapse);
	};

	const reloadContent = () => {
		setLoading(true);
		setTimeout(
			() => {
				setLoading(false);
			},
			500 + 300 * (Math.random() * 5)
		);
	};

	const remove = () => {
		setHidden(true);
	};

	return (
		<>
			{!hidden ? (
				<Card className={`${props.className} w-100`}> {/* Added w-100 for full width */}
					{loading && (
						<div className="card-disabled">
							<div className="card-portlets-loader"></div>
						</div>
					)}
					<Card.Body>
						<div className="card-widgets">
							<Link to="#" onClick={reloadContent}>
								<i className="ri-refresh-line" />
							</Link>
							&nbsp;
							<Link to="#" onClick={toggleContent}>
								<i
									className={`ri ${collapse ? 'ri-subtract-line' : ''} ${
										!collapse ? 'ri-add-line' : ''
									}`}
								/>
							</Link>
							&nbsp;
							<Link to="#" onClick={remove}>
								<i className="ri-close-line" />
							</Link>
						</div>
						<h5 className={`mb-0 ${props.titleClass}`}>{cardTitle}</h5>
						<Collapse in={collapse}>
							<div>
								<div className="pt-3">{children}</div>
							</div>
						</Collapse>
					</Card.Body>
				</Card>
			) : null}
		</>
	);
};

export default CustomCardPortlet;
