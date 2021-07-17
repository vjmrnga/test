import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranches } from '../../hooks/useBranches';
import { Branches } from '../Shared/Branches/Branches';
import { ViewBranch } from '../Shared/Branches/ViewBranch';
import { Products } from '../Shared/Products/Products';
import { Dashboard } from './Dashboard/Dashboard';
import { Notifications } from './Notifications/Notifications';
import { Reports } from './Reports/Reports';
import { RequisitionSlips } from './RequisitionSlips/RequisitionSlips';
import { ViewDeliveryReceipt } from './RequisitionSlips/ViewDeliveryReceipt';
import { ViewRequisitionSlip } from './RequisitionSlips/ViewRequisitionSlip';
import { AssignUser } from './Users/AssignUser';
import { Users } from './Users/Users';

const sidebarItems = [
	{
		key: 'dashboard',
		name: 'Dashboard',
		activeIcon: require('../../assets/images/icon-dashboard-active.svg'),
		defaultIcon: require('../../assets/images/icon-dashboard.svg'),
		link: '/office-manager/dashboard',
	},
	{
		key: 'products',
		name: 'Products',
		activeIcon: require('../../assets/images/icon-product-active.svg'),
		defaultIcon: require('../../assets/images/icon-product.svg'),
		link: '/office-manager/products',
	},
	{
		key: 'branches',
		name: 'Branches',
		activeIcon: require('../../assets/images/icon-branches-active.svg'),
		defaultIcon: require('../../assets/images/icon-branches.svg'),
		link: '/office-manager/branches',
	},

	{
		key: 'requisition-slips',
		name: 'Requisition Slips',
		activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
		defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
		link: '/office-manager/requisition-slips',
	},
	{
		key: 'users',
		name: 'Users',
		activeIcon: require('../../assets/images/icon-users-active.svg'),
		defaultIcon: require('../../assets/images/icon-users.svg'),
		link: '/office-manager/users',
	},
	{
		key: 'reports',
		name: 'Reports',
		activeIcon: require('../../assets/images/icon-report-active.svg'),
		defaultIcon: require('../../assets/images/icon-report.svg'),
		link: '/office-manager/reports',
	},

	{
		key: 'notifications',
		name: 'Notifications',
		activeIcon: require('../../assets/images/icon-notifications-active.svg'),
		defaultIcon: require('../../assets/images/icon-notifications.svg'),
		link: '/office-manager/notifications',
	},
];

const OfficeManager = () => {
	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const { getBranches, status: getBranchesStatus } = useBranches();

	useEffect(() => {
		if (user) {
			getBranches();
		}
	}, [user]);

	useEffect(() => {
		const requests = [getBranchesStatus];

		if (requests.includes(request.REQUESTING)) {
			// Do nothing
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			// logout(user?.id);
		}
	}, [user, getBranchesStatus]);

	if (getBranchesStatus === request.REQUESTING) {
		return (
			<Spin className="GlobalSpinner" size="large" tip="Fetching data..." />
		);
	}

	return (
		<Container sidebarItems={sidebarItems}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/office-manager/dashboard" component={Dashboard} />
					<Route path="/office-manager/products" component={Products} />
					<Route path="/office-manager/branches" exact component={Branches} />
					<Route path="/office-manager/branches/:id" component={ViewBranch} />

					<Route
						path="/office-manager/requisition-slips"
						exact
						component={RequisitionSlips}
					/>
					<Route
						path="/office-manager/requisition-slips/:id"
						exact
						component={ViewRequisitionSlip}
					/>
					<Route
						path="/office-manager//requisition-slips/delivery-receipt/:id"
						component={ViewDeliveryReceipt}
					/>

					<Route path="/office-manager/users" exact component={Users} />
					<Route
						path="/office-manager/users/assign/:id"
						component={AssignUser}
					/>
					<Route
						path="/office-manager/notifications"
						component={Notifications}
					/>
					<Route path="/office-manager/reports" component={Reports} />

					<Redirect to="/office-manager/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default OfficeManager;
