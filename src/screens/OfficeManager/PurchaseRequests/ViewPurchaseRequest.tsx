/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Divider, Row } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container, Table } from '../../../components';
import { Box, Label, Select } from '../../../components/elements';
import { selectors } from '../../../ducks/purchase-requests';
import {
	purchaseRequestActionsOptions,
	quantityTypeOptions,
	quantityTypes,
} from '../../../global/variables';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { calculateTableHeight, formatDateTime, sleep } from '../../../utils/function';
import './style.scss';

interface Props {
	match: any;
}

const requestProductsColumns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity' },
];

// const orderSlipsColumns = [
// 	{ title: 'Barcode', dataIndex: 'barcode' },
// 	{ title: 'Name', dataIndex: 'name' },
// 	{ title: 'Quantity (Bulk)', dataIndex: 'quantity_bulk' },
// 	{ title: 'Quantity (Pieces)', dataIndex: 'quantity_piece' },
// ];

const ViewPurchaseRequest = ({ match }: Props) => {
	const purchaseRequestId = match?.params?.id;
	const { branchProducts } = useBranchProducts();
	const purchaseRequest = useSelector(
		selectors.selectPurchaseRequestById(Number(purchaseRequestId)),
	);

	const [requestedProductsData, setRequestProductsData] = useState([]);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		const formattedRequestedProducts = purchaseRequest?.products.map((requestedProduct) => {
			const { product_id, quantity_bulk, quantity_piece } = requestedProduct;
			const branchProduct = branchProducts.find((product) => product?.product_id === product_id);
			const { barcode = '', name = '' } = branchProduct?.product;

			return {
				_quantity_bulk: quantity_bulk,
				_quantity_piece: quantity_piece,
				barcode,
				name,
				quantity: quantity_piece,
			};
		});

		sleep(500).then(() => setRequestProductsData(formattedRequestedProducts));
	}, [purchaseRequest]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Purchase Requests', link: '/purchase-requests' },
			{ name: `#${purchaseRequest?.id}` },
		],
		[purchaseRequest],
	);

	const onStatusChange = (status) => {
		console.log(status);
	};

	const onQuantityTypeChange = (quantityType) => {
		const requestProducts = requestedProductsData.map((requestProduct) => ({
			...requestProduct,
			quantity:
				quantityType === quantityTypes.PIECE
					? requestProduct._quantity_piece
					: requestProduct._quantity_bulk,
		}));
		setRequestProductsData(requestProducts);
	};

	return (
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${purchaseRequest?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<section className="ViewPurchaseRequest">
				<Box>
					<Row className="details">
						<Col span={24} lg={12}>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Date &amp; Time Created" />
								</Col>
								<Col span={12}>
									<strong>{formatDateTime(purchaseRequest?.datetime_created)}</strong>
								</Col>
							</Row>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Requestor" />
								</Col>
								<Col span={12}>
									<strong>{purchaseRequest?.requestor_id}</strong>
								</Col>
							</Row>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Request Type" />
								</Col>
								<Col span={12}>
									<strong>{upperFirst(purchaseRequest?.type)}</strong>
								</Col>
							</Row>
						</Col>

						<Col span={24} lg={12}>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Status" />
								</Col>
								<Col span={12}>
									<Select
										classNames="status-select"
										options={purchaseRequestActionsOptions}
										placeholder="status"
										defaultValue={purchaseRequest?.action?.action}
										onChange={(event) => onStatusChange(event.target.value)}
									/>
								</Col>
							</Row>
						</Col>
					</Row>

					<div className="requested-products">
						<Divider dashed />
						<Row gutter={[15, 15]} align="middle">
							<Col span={24} lg={12}>
								<Label label="Requested Products" />
							</Col>
							<Col span={24} lg={12}>
								<Select
									classNames="status-select"
									options={quantityTypeOptions}
									placeholder="quantity"
									defaultValue={quantityTypes.PIECE}
									onChange={(event) => onQuantityTypeChange(event.target.value)}
								/>
							</Col>
						</Row>
					</div>

					<Table
						columns={requestProductsColumns}
						dataSource={requestedProductsData}
						scroll={{ y: calculateTableHeight(requestedProductsData.length), x: '100vw' }}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default ViewPurchaseRequest;
