import { Divider, Modal } from 'antd';
import React from 'react';
import { DetailsHalf, DetailsRow, DetailsSingle } from '../../../../components';
import { Button } from '../../../../components/elements';
import {
	getProductType,
	getUnitOfMeasurement,
} from '../../../../utils/function';

interface Props {
	branchProduct: any;
	onClose: any;
}

export const ViewProductModal = ({ branchProduct, onClose }: Props) => (
	<Modal
		title="[View] Product"
		className="Modal__large Modal__hasFooter"
		footer={[<Button text="Close" onClick={onClose} />]}
		onCancel={onClose}
		visible
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle label="Barcode" value={branchProduct.product.barcode} />
			<DetailsSingle label="Textcode" value={branchProduct.product.textcode} />
			<DetailsSingle label="Name" value={branchProduct.product.name} />
			<DetailsSingle
				label="TT-001"
				value={getProductType(branchProduct.product.type)}
			/>
			<DetailsSingle
				label="TT-002"
				value={getUnitOfMeasurement(branchProduct.product.unit_of_measurement)}
			/>
			<DetailsSingle
				label="TT-003"
				value={branchProduct.is_vat_exempted ? 'VAT-EXEMPTED' : 'VAT'}
			/>

			<Divider dashed />

			<DetailsHalf
				label="Checking"
				value={branchProduct.is_daily_checked ? 'Daily' : 'Random'}
			/>

			<DetailsHalf label="Reorder Point" value={branchProduct.reorder_point} />
			<DetailsHalf label="Max Balance" value={branchProduct.max_balance} />
			<DetailsHalf
				label="Price (Piece)"
				value={branchProduct.price_per_piece}
			/>
			<DetailsHalf label="Price (Bulk)" value={branchProduct.price_per_bulk} />
			<DetailsHalf
				label="Allowable Spoilage (%)"
				value={branchProduct.product.allowable_spoilage * 100}
			/>
		</DetailsRow>
	</Modal>
);
