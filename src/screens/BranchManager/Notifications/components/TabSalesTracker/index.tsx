import { Alert, Empty, Spin } from 'antd';
import { RequestErrors, TableHeader } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useSalesTracker, useSiteSettings } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils';

export const TabSalesTracker = () => {
	// STATES
	const [salesTrackerNotifications, setSalesTrackerNotifications] = useState(
		[],
	);

	// CUSTOM HOOKS
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings({
		options: { notifyOnChangeProps: ['data', 'isFetching'] },
	});
	const {
		data: { salesTrackers },
		isFetching: isFetchingSalesTracker,
		error: salesTrackersError,
	} = useSalesTracker({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS
	useEffect(() => {
		if (siteSettings) {
			const thresholdAmount =
				siteSettings?.reset_counter_notification_threshold_amount;
			const thresholdInvoiceNumber =
				siteSettings?.reset_counter_notification_threshold_invoice_number;

			const notifications = [];
			salesTrackers.forEach((salesTracker) => {
				const { total_sales, transaction_count } = salesTracker;
				const totalSales = Number(total_sales);
				const transactionCount = Number(transaction_count);
				const machineName = salesTracker.branch_machine.name;

				if (totalSales >= thresholdAmount) {
					notifications.push(
						<SalesTrackerTotalSalesNotification
							branchMachineName={machineName}
							totalSales={totalSales}
						/>,
					);
				}

				if (transactionCount >= thresholdInvoiceNumber) {
					notifications.push(
						<SalesTrackerInvoiceNotification
							branchMachineName={machineName}
							transactionCount={transactionCount}
						/>,
					);
				}
			});

			setSalesTrackerNotifications(notifications);
		}
	}, [salesTrackers, siteSettings]);

	return (
		<Spin spinning={isFetchingSalesTracker || isFetchingSiteSettings}>
			<TableHeader title="Sales Tracker" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={[
					...convertIntoArray(salesTrackersError, 'Sales Tracker'),
					...convertIntoArray(siteSettingsError, 'Site Settings'),
				]}
				withSpaceBottom
			/>

			{salesTrackerNotifications.length > 0 ? (
				salesTrackerNotifications
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
			)}
		</Spin>
	);
};

const SalesTrackerTotalSalesNotification = ({
	branchMachineName,
	totalSales,
}) => (
	<Alert
		className="mb-3"
		description={
			<>
				Current total sales in <b>{branchMachineName}</b> is{' '}
				<b>{formatInPeso(totalSales)}</b>. Please reset as soon as possible.
			</>
		}
		message="Sales Tracker - Total Sales"
		type="warning"
		showIcon
	/>
);

const SalesTrackerInvoiceNotification = ({
	branchMachineName,
	transactionCount,
}) => (
	<Alert
		className="mb-3"
		description={
			<>
				Current invoice count value in <b>{branchMachineName}</b> is{' '}
				<b>{transactionCount}</b>. Please reset as soon as possible.
			</>
		}
		message="Sales Tracker - Invoice"
		type="warning"
		showIcon
	/>
);
