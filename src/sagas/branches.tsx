import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/branches';
import {
	actions as branchProductsActions,
	types as branchProductsTypes,
} from '../ducks/branch-products';
import { MAX_PAGE_SIZE, request } from '../global/variables';
import { service } from '../services/branches';
import { service as branchProductsService } from '../services/branch-products';

/* WORKERS */
function* getBranch({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, id);

		yield put(actions.save({ type: types.GET_BRANCH, branch: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getBranches({ payload }: any) {
	const { withBranchProducts = true, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const branchesResponse = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		// Side Effect: Fetch branch products
		if (withBranchProducts) {
			const branchProductsResponse = yield call(branchProductsService.list, {
				page: 1,
				page_size: MAX_PAGE_SIZE,
			});

			yield put(
				branchProductsActions.save({
					type: branchProductsTypes.GET_BRANCH_PRODUCTS,
					branchProducts: branchProductsResponse.data.results,
				}),
			);
		}

		yield put(actions.save({ type: types.GET_BRANCHES, branches: branchesResponse.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createBranch({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createBranch, data);

		yield put(actions.save({ type: types.CREATE_BRANCH, branch: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editBranch({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.editBranch, data);

		yield put(actions.save({ type: types.EDIT_BRANCH, branch: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* removeBranch({ payload }: any) {
	const { callback, id } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.removeBranch, id);

		yield put(actions.save({ type: types.REMOVE_BRANCH, id }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getBranchWatcherSaga = function* getBranchesWatcherSaga() {
	yield takeLatest(types.GET_BRANCH, getBranch);
};

const getBranchesWatcherSaga = function* getBranchesWatcherSaga() {
	yield takeLatest(types.GET_BRANCHES, getBranches);
};

const createBranchWatcherSaga = function* createBranchWatcherSaga() {
	yield takeLatest(types.CREATE_BRANCH, createBranch);
};

const editBranchWatcherSaga = function* editBranchWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH, editBranch);
};

const removeBranchWatcherSaga = function* removeBranchWatcherSaga() {
	yield takeLatest(types.REMOVE_BRANCH, removeBranch);
};

export default [
	getBranchWatcherSaga(),
	getBranchesWatcherSaga(),
	createBranchWatcherSaga(),
	editBranchWatcherSaga(),
	removeBranchWatcherSaga(),
];
