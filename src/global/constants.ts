// eslint-disable-next-line eqeqeq

// App
export const APP_KEY = process.env.REACT_APP_KEY;
export const APP_TITLE = process.env.REACT_APP_TITLE;
export const IS_APP_LIVE = process.env.REACT_APP_IS_LIVE === 'true';
export const SHOW_HIDE_SHORTCUT = ['meta+s', 'ctrl+s'];

// Local Storage
export const APP_ONLINE_BRANCH_ID_KEY = 'EJJY_BRANCH_ID';
export const APP_LOCAL_BRANCH_ID_KEY = 'EJJY_LOCAL_BRANCH_ID';
export const APP_LOCAL_API_URL_KEY = 'EJJY_LOCAL_API_URL';
export const APP_ONLINE_API_URL_KEY = 'EJJY_ONLINE_API_URL';
export const APP_PRINTER_NAME = 'EJJY_PRINTER_NAME';

// Request
export const AUTH_CHECKING_INTERVAL_MS = 10000;
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 500;
export const MAX_RETRY = 1;
export const RETRY_INTERVAL_MS = 300;
export const REPORTS_RETRY_INTERVAL_MS = 30000;
export const GENERIC_ERROR_MESSAGE =
	'An error occurred while processing you request.';

export const GENERIC_BRANCH_ERROR_MESSAGE =
	'An error occurred while requesting on a local branch';

// UI
export const NOT_FOUND_INDEX = -1;
export const EMPTY_CELL = '—';
export const SEARCH_DEBOUNCE_TIME = 500;
export const ROW_HEIGHT = 65;
export const ALL_OPTION_KEY = 'all';
export const ONLINE_ROUTES = [
	'/requisition-slips',
	'/order-slips',
	'/preparation-slips',
];
export const NO_BRANCH_ID = -1;
export const PENDING_CREATE_USERS_BRANCH_ID = -2;
export const PENDING_EDIT_USERS_BRANCH_ID = -3;
export const MAIN_BRANCH_ID = 1;
export const SALES_TRACKER_NOTIFICATION_THRESHOLD = 1_000;
export const DATE_FORMAT = 'MM/DD/YY';
export const DEV_USERNAME = 'dev';

// eslint-disable-next-line no-console
console.info('IS LIVE: ', process.env.REACT_APP_IS_LIVE);
