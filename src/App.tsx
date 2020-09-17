import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommonRoute } from './components';
import { Error404, Landing, Login } from './screens';
import {
	BranchesScreens,
	DashboardScreens,
	NotificationsScreens,
	OrderSlipsScreens,
	ProductsScreens,
	PurchaseRequestsScreens,
	UsersScreens,
	ViewBranchScreens,
	ViewPurchaseRequestScreens,
} from './utils/routeMapping';

const App = () => (
	<Switch>
		<CommonRoute path={['/', '/login']} exact component={Login} />
		<CommonRoute path="/landing" exact component={Landing} />
		<CommonRoute path="/dashboard" exact component={DashboardScreens} />
		<CommonRoute path="/products" exact component={ProductsScreens} />
		<CommonRoute path="/branches" exact component={BranchesScreens} />
		<CommonRoute path="/branches/:id" exact component={ViewBranchScreens} />
		<CommonRoute path="/purchase-requests" exact component={PurchaseRequestsScreens} />
		<CommonRoute path="/purchase-requests/:id" exact component={ViewPurchaseRequestScreens} />
		<CommonRoute path="/users" exact component={UsersScreens} />
		<CommonRoute path="/notifications" exact component={NotificationsScreens} />
		<CommonRoute path="/order-slips" exact component={OrderSlipsScreens} />

		<Route path="/404" exact component={Error404} />
		<Route path="" render={() => <Redirect to="/404" />} />
	</Switch>
);

export default App;
