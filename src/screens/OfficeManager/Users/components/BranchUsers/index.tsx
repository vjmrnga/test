import { Button, Popconfirm, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branchId: any;
	disabled: boolean;
	onEditUser: any;
	onReassignUser: any;
}

export const BranchUsers = ({
	branchId,
	disabled,
	onEditUser,
	onReassignUser,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const {
		isFetching: isFetchingUsers,
		data: { users },
		error: listError,
	} = useUsers({
		params: {
			branchId,
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => ({
			key: user.id,
			id: user.employee_id,
			name: getFullName(user),
			type: getUserTypeName(user.user_type),
			actions: (
				<Space>
					<Button
						disabled={disabled}
						type="primary"
						onClick={() =>
							history.push(`/office-manager/users/assign/${user.id}`)
						}
					>
						Cashiering Assignments
					</Button>
					<Button
						disabled={disabled}
						type="primary"
						onClick={() => onReassignUser({ ...user, branchId })}
					>
						Assign Branch
					</Button>
					<Button
						disabled={disabled}
						type="primary"
						onClick={() => onEditUser({ ...user, branchId })}
					>
						Edit
					</Button>
					<Popconfirm
						cancelText="No"
						okText="Yes"
						placement="left"
						title="Are you sure to remove this user?"
						onConfirm={() => deleteUser(user.id)}
					>
						<Button disabled={disabled} type="primary" danger>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		}));

		setDataSource(formattedUsers);
	}, [users, disabled]);

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(listError),
					...convertIntoArray(deleteError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingUsers || isDeletingUser}
				pagination={false}
				scroll={{ x: 650 }}
			/>
		</>
	);
};
