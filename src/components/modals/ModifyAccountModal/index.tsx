import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { useAccountsCreate, useAccountsEdit } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils/function';
import { ModifyAccountForm } from './ModifyAccountForm';

interface Props {
	account?: any;
	onSuccess: any;
	onClose: any;
}

export const ModifyAccountModal = ({ account, onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createAccount,
		isLoading: isCreateLoading,
		error: createError,
	} = useAccountsCreate();
	const {
		mutateAsync: editAccount,
		isLoading: isEditLoading,
		error: editError,
	} = useAccountsEdit();

	// METHODS
	const onSubmit = async (formData) => {
		if (account) {
			await editAccount({
				id: account.id,
				...formData,
			});
			message.success('Account was edited sucessfully.');
		} else {
			await createAccount(formData);
			message.success('Account was created sucessfully.');
		}

		onSuccess();
		onClose();
	};

	return (
		<Modal
			title={`${account ? '[Edit]' : '[Create]'} Account`}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
			width={600}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError),
					...convertIntoArray(editError),
				]}
				withSpaceBottom
			/>

			<ModifyAccountForm
				account={account}
				loading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
