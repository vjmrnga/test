import { Col, Row, Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import { filterOption, getFullName, ServiceType, useUsers } from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	serviceTypes,
	userLogTypes,
} from 'global';
import { useProducts, useQueryParams, useUserLogs } from 'hooks';

import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTimeExtended,
	getLocalApiUrl,
	isStandAlone,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Date & Time', dataIndex: 'datetimeCreated' },
];

export const TabProductLogs = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { logs, total },
		isFetching: isFetchingLogs,
		error: logsError,
	} = useUserLogs({
		params: {
			...params,
			serviceType: isStandAlone() ? serviceTypes.NORMAL : serviceTypes.OFFLINE,
			type: userLogTypes.PRODUCTS,
		},
	});

	// METHODS
	useEffect(() => {
		const data = logs.map((log) => ({
			key: log.id,
			user: getFullName(log.acting_user),
			description: log.description,
			datetimeCreated: formatDateTimeExtended(log.datetime_created),
		}));

		setDataSource(data);
	}, [logs]);

	return (
		<div>
			<TableHeader title="Product Logs" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={convertIntoArray(logsError, 'Logs')}
				withSpaceBottom
			/>

			<Filter />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingLogs}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 1000 }}
				bordered
			/>
		</div>
	);
};

const Filter = () => {
	// STATES
	const [productSearch, setProductSearch] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: usersData,
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
		serviceOptions: {
			baseURL: getLocalApiUrl(),
			type: isStandAlone() ? ServiceType.ONLINE : ServiceType.OFFLINE,
		},
	});
	const {
		data: { products },
		isFetching: isFetchingProducts,
		error: productsError,
	} = useProducts({
		params: {
			ids: productSearch ? undefined : _.toString(params?.productId),
			search: productSearch,
		},
	});

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((search) => {
			setProductSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(productsError, 'Product'),
					...convertIntoArray(usersError, 'Users'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col md={12}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						defaultValue={
							params.actingUserId ? Number(params.actingUserId) : null
						}
						filterOption={filterOption}
						loading={isFetchingUsers}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ actingUserId: value },
								{ shouldResetPage: true },
							);
						}}
					>
						{usersData?.list.map((user) => (
							<Select.Option key={user.id} value={user.id}>
								{getFullName(user)}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<Label label="Product" spacing />
					<Select
						className="w-100"
						defaultActiveFirstOption={false}
						defaultValue={params.productId ? Number(params.productId) : null}
						filterOption={false}
						notFoundContent={isFetchingProducts ? <Spin /> : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ productId: value }, { shouldResetPage: true });
						}}
						onSearch={handleSearchDebounced}
					>
						{products.map((product) => (
							<Select.Option key={product.id} value={product.id}>
								{product.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col lg={12} span={24}>
					<TimeRangeFilter />
				</Col>
			</Row>
		</>
	);
};
