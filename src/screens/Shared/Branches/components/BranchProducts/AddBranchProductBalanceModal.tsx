import { Divider, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { DetailsSingle, RequestErrors } from '../../../../../components';
import { DetailsRow } from '../../../../../components/Details/DetailsRow';
import { SHOW_HIDE_SHORTCUT } from '../../../../../global/constants';
import { request } from '../../../../../global/types';
import { useAuth } from '../../../../../hooks/useAuth';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import {
	confirmPassword,
	convertIntoArray,
	formatQuantity,
	getKeyDownCombination,
} from '../../../../../utils/function';
import '../../style.scss';
import { AddBranchProductBalanceForm } from './AddBranchProductBalanceForm';

interface Props {
	branch: any;
	branchProduct: any;
	refreshList: any;
	onClose: any;
}

export const AddBranchProductBalanceModal = ({
	branch,
	branchProduct,
	refreshList,
	onClose,
}: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		editBranchProductBalance,
		status: branchProductStatus,
		errors,
		reset,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const onAddBranchProductBalance = (value) => {
		editBranchProductBalance(
			{
				branchId: branch?.id,
				addedBalance: value.balance,
				productId: branchProduct.product.id,
				updatingUserId: user.id,
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					refreshList();
					reset();
					onClose();
				}
			},
		);
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
			event.preventDefault();

			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	const handleClose = () => {
		setIsCurrentBalanceVisible(false);
		onClose();
	};

	return (
		<Modal
			className="AddBranchProductBalance"
			title="Supplier Delivery"
			footer={null}
			onCancel={handleClose}
			visible
			centered
			closable
			destroyOnClose
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<DetailsRow>
				<DetailsSingle
					label="Barcode"
					value={branchProduct?.product?.barcode}
				/>
				<DetailsSingle
					label="Textcode"
					value={branchProduct?.product?.textcode}
				/>
				<DetailsSingle label="Name" value={branchProduct?.product?.name} />
				<DetailsSingle
					label="Max Balance"
					value={formatQuantity(
						branchProduct?.product?.unit_of_measurement,
						branchProduct?.max_balance,
					)}
				/>
				{isCurrentBalanceVisible && (
					<DetailsSingle
						label="Current Balance"
						value={formatQuantity(
							branchProduct?.product?.unit_of_measurement,
							branchProduct?.current_balance,
						)}
					/>
				)}
			</DetailsRow>

			<Divider dashed />

			<AddBranchProductBalanceForm
				branchProduct={branchProduct}
				onSubmit={onAddBranchProductBalance}
				onClose={handleClose}
				loading={branchProductStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
