import { Col, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useBranches } from 'hooks';
import { convertIntoArray, sleep } from 'utils';
import { Button, FieldError, Label } from '../../../../components/elements';
import { MAX_PAGE_SIZE } from '../../../../global/constants';
import { request, userTypes } from '../../../../global/types';
import { useUsers } from '../../../../hooks/useUsers';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';

interface Props {
	returnItemSlip: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const AssignReturnItemSlipForm = ({
	returnItemSlip,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// CUSTOM HOOKS
	const {
		data: { branches },
	} = useBranches();
	const {
		users,
		getOnlineUsers,
		status: usersStatus,
		errors: usersErrors,
	} = useUsers();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branch_id: null,
				receiver_id: null,
			},
			Schema: Yup.object().shape({
				branch_id: Yup.number().nullable().required().label('Branch'),
				receiver_id: Yup.number().nullable().required().label('Receiver'),
			}),
		}),
		[],
	);

	return (
		<>
			<RequestErrors errors={convertIntoArray(usersErrors)} withSpaceBottom />

			<Formik
				initialValues={getFormDetails().DefaultValues}
				validationSchema={getFormDetails().Schema}
				onSubmit={async (formData) => {
					setSubmitting(true);
					await sleep(500);
					setSubmitting(false);

					onSubmit(formData);
				}}
			>
				{({ values, setFieldValue }) => (
					<Form>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Label label="Branches" spacing />
								<Select
									filterOption={(input, option) =>
										option.children
											.toString()
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									optionFilterProp="children"
									style={{ width: '100%' }}
									showSearch
									onChange={(value) => {
										getOnlineUsers(
											{
												branchId: value,
												userType: userTypes.BRANCH_MANAGER,
												page: 1,
												pageSize: MAX_PAGE_SIZE,
											},
											true,
										);
										setFieldValue('branch_id', value);
										setFieldValue('receiver_id', null);
									}}
								>
									{branches
										.filter(({ id }) => returnItemSlip.sender.branch.id !== id)
										.map(({ id, name }) => (
											<Select.Option key={id} value={id}>
												{name}
											</Select.Option>
										))}
								</Select>
								<ErrorMessage
									name="branch_id"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>

							<Col span={24}>
								<Label label="Receiver (User)" spacing />
								<Select
									disabled={usersStatus === request.REQUESTING}
									filterOption={(input, option) =>
										option.children
											.toString()
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									loading={usersStatus === request.REQUESTING}
									optionFilterProp="children"
									style={{ width: '100%' }}
									value={values.receiver_id}
									showSearch
									onChange={(value) => setFieldValue('receiver_id', value)}
								>
									{users.map(({ id, first_name, last_name }) => (
										<Select.Option key={id} value={id}>
											{`${first_name} ${last_name}`}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="receiver_id"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						</Row>

						<div className="ModalCustomFooter">
							<Button
								disabled={
									loading || isSubmitting || usersStatus === request.REQUESTING
								}
								text="Cancel"
								type="button"
								onClick={onClose}
							/>
							<Button
								disabled={usersStatus === request.REQUESTING}
								loading={loading || isSubmitting}
								text="Assign"
								type="submit"
								variant="primary"
							/>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};
