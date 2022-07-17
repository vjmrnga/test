import { call, retry, takeLatest } from 'redux-saga/effects';
import { getOnlineApiUrl, getLocalApiUrl } from 'utils';
import { types } from '../ducks/return-item-slips';
import { IS_APP_LIVE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/return-item-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { senderBranchId, receiverId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				sender_branch_id: senderBranchId,
				receiver_id: receiverId,
				page,
				page_size: pageSize,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* retrieve({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.retrieve,
			id,
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { senderId, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.create,
			{
				sender_id: senderId,
				is_online: IS_APP_LIVE,
				products,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { id, receiverId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.edit,
			id,
			{
				receiver_id: receiverId,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* receive({ payload }: any) {
	const { id, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.receive,
			id,
			{
				is_online: IS_APP_LIVE,
				products,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST, list);
};

const retrieveWatcherSaga = function* retrieveWatcherSaga() {
	yield takeLatest(types.RETRIEVE, retrieve);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT, edit);
};

const receiveWatcherSaga = function* receiveWatcherSaga() {
	yield takeLatest(types.RECEIVE, receive);
};

export default [
	listWatcherSaga(),
	retrieveWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
	receiveWatcherSaga(),
];
