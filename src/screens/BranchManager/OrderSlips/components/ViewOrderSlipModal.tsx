/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col, Divider, Modal, Row, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { QuantitySelect, TableNormal } from '../../../../components';
import { Button, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import { convertToBulk, getColoredText } from '../../../../utils/function';
import { OrderSlipDetails } from './OrderSlipDetails';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, visible, onClose }: Props) => {
	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);
	const [requestedProductsQuantity, setRequestedProductsQuantity] = useState(
		[],
	);
	const [quantityType, setQuantityType] = useState(quantityTypes.PIECE);

	// METHODS
	useEffect(() => {
		if (orderSlip) {
			const formattedQuantities = [];
			const formattedPreparationSlip = [];

			orderSlip?.products?.forEach((requestedProduct) => {
				const {
					product,
					assigned_person,
					quantity_piece,
					fulfilled_quantity_piece = 0,
				} = requestedProduct;
				const { barcode, name, pieces_in_bulk } = product;
				const { first_name, last_name } = assigned_person;

				const quantity = {
					barcode,
					isFulfilled: fulfilled_quantity_piece !== null,
					piecesInputted: fulfilled_quantity_piece || 0,
					piecesOrdered: quantity_piece,
					bulkInputted: convertToBulk(fulfilled_quantity_piece, pieces_in_bulk),
					bulkOrdered: convertToBulk(quantity_piece, pieces_in_bulk),
				};

				formattedQuantities.push(quantity);
				formattedPreparationSlip.push([
					barcode,
					name,
					getColoredText(
						!quantity.isFulfilled,
						quantity.piecesInputted,
						quantity.piecesOrdered,
					),
					`${first_name} ${last_name}`,
				]);
			});

			setRequestedProducts(formattedPreparationSlip);
			setRequestedProductsQuantity(formattedQuantities);
		}
	}, [orderSlip]);

	const onQuantityTypeChange = useCallback(
		(type) => {
			const QUANTITY_INDEX = 2;
			const formattedRequestedProducts = requestedProducts.map(
				(requestedProduct, index) => {
					const requestedProd = requestedProduct;
					const quantity = requestedProductsQuantity[index];
					const isPiece = type === quantityTypes.PIECE;
					const inputted = isPiece
						? quantity.piecesInputted
						: quantity.bulkInputted;
					const ordered = isPiece
						? quantity.piecesOrdered
						: quantity.bulkOrdered;
					const key = `${
						orderSlip?.id
					}-${!quantity.isFulfilled}-${inputted}-${ordered}`;

					requestedProd[QUANTITY_INDEX] = getColoredText(
						key,
						!quantity.isFulfilled,
						inputted,
						ordered,
					);

					return requestedProd;
				},
			);
			setRequestedProducts(formattedRequestedProducts);
			setQuantityType(type);
		},
		[requestedProducts, requestedProductsQuantity, orderSlip],
	);

	const getColumns = useCallback(
		() => [
			{ name: 'Barcode' },
			{ name: 'Name' },
			{
				name: (
					<QuantitySelect
						quantityValue={quantityType}
						onQuantityTypeChange={onQuantityTypeChange}
					/>
				),
			},
			{ name: 'Assigned Personnel' },
		],
		[onQuantityTypeChange, quantityType],
	);

	const close = () => {
		setQuantityType(quantityTypes.PIECE);
		onClose();
	};

	return (
		<Modal
			title="View Order Slip"
			className="Modal__large Modal__hasFooter"
			visible={visible}
			footer={[
				<Space size={10}>
					<Button text="Close" onClick={close} />
					<Button variant="primary" text="Print" disabled />
				</Space>,
			]}
			onCancel={close}
			centered
			closable
		>
			<OrderSlipDetails orderSlip={orderSlip} />

			<Divider dashed />

			<Row gutter={[15, 15]} align="middle" justify="space-between">
				<Col span={24}>
					<Label label="Requested Products" />
				</Col>
			</Row>

			<TableNormal
				columns={getColumns()}
				data={requestedProducts}
				hasCustomHeaderComponent
			/>
		</Modal>
	);
};
