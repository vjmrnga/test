/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { formatDateTime, formatQuantity } from 'utils';
import {
	ColoredText,
	DetailsRow,
	DetailsSingle,
} from '../../../../../components';
import { Button, Label } from '../../../../../components/elements';
import { DEFAULT_APPROVED_FULFILLED_QUANTITY } from '../constants';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Previous Fulfilled Quantity', dataIndex: 'previous_quantity' },
	{ title: 'New Fulfilled Quantity', dataIndex: 'new_quantity' },
];

interface Props {
	adjustmentSlip: any;
	onClose: any;
}

export const ViewAdjustmentSlipModal = ({ adjustmentSlip, onClose }: Props) => (
	<Modal
		className="Modal__large Modal__hasFooter"
		footer={[<Button key="close" text="Close" onClick={onClose} />]}
		title="View Adjustment Slip"
		centered
		closable
		visible
		onCancel={onClose}
	>
		<DetailsRow>
			<DetailsSingle
				label="Date & Time Created"
				value={formatDateTime(adjustmentSlip?.datetime_created)}
			/>
			<DetailsSingle label="Remark" value={adjustmentSlip?.remarks} />
		</DetailsRow>

		<Divider dashed />

		<Label label="Products" spacing />
		<Table
			columns={columns}
			dataSource={adjustmentSlip.adjustment_slip_products.map((item) => ({
				key: item.id,
				name:
					item.order_slip_product.product.barcode ||
					item.order_slip_product.product.textcode,
				previous_quantity: formatQuantity({
					unitOfMeasurement:
						item.order_slip_product.product.unit_of_measurement,
					quantity: item.previous_fulfilled_quantity_piece,
				}),
				new_quantity:
					Number(item.new_fulfilled_quantity_piece) ===
					DEFAULT_APPROVED_FULFILLED_QUANTITY ? (
						<ColoredText text="Approved" variant="primary" />
					) : (
						formatQuantity({
							unitOfMeasurement:
								item.order_slip_product.product.unit_of_measurement,
							quantity: item.new_fulfilled_quantity_piece,
						})
					),
			}))}
			pagination={false}
			scroll={{ x: 800 }}
		/>
	</Modal>
);
