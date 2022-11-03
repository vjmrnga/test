import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { DataService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const REFETCH_INTERVAL_MS = 60000;

export const useInitializeData = ({ params }: Query) =>
	useQuery(
		['useInitializeData', params?.branchId],
		() =>
			wrapServiceWithCatch(
				DataService.initialize(
					{ branch_id: params?.branchId || undefined },
					getLocalApiUrl(),
				),
			),
		{
			enabled: !!getOnlineApiUrl() && !isStandAlone(),
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading'],
		},
	);

export const useUploadData = () =>
	useQuery(
		['useUploadData'],
		() =>
			wrapServiceWithCatch(
				DataService.upload({ is_back_office: true }, getLocalApiUrl()),
			),
		{
			enabled: !isStandAlone(),
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading'],
		},
	);
