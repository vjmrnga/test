import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { ONLINE_API_URL, XReadReportsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

export const useXReadReportCreate = () =>
	useMutation(({ date, serverUrl, userId }: any) => {
		let baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
		if (serverUrl) {
			baseURL = serverUrl;
		}

		return XReadReportsService.create(
			{
				date,
				user_id: userId,
			},
			baseURL,
		);
	});
