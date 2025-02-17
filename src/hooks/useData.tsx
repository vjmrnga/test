import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { DataService } from 'services';
import { getLocalApiUrl, isStandAlone } from 'utils';

const REFETCH_INTERVAL_MS = 30_000;

export const useInitializeData = ({ params, options }: Query) =>
	useQuery(
		[
			'useInitializeData',
			params?.branchId,
			params?.branchIds,
			params?.isHeadOffice,
		],
		async () => {
			const baseURL = getLocalApiUrl();
			let service = null;

			if (params?.branchId) {
				service = wrapServiceWithCatch(
					DataService.initialize({ branch_id: params.branchId }, baseURL),
				);
			} else if (params?.branchIds) {
				try {
					// eslint-disable-next-line no-restricted-syntax
					for (const branchId of params.branchIds) {
						// eslint-disable-next-line no-await-in-loop
						await DataService.initialize({ branch_id: branchId }, baseURL);
					}
				} catch (e) {
					console.error('Initialize Data', e);
				}
			}

			if (params?.isHeadOffice) {
				await DataService.initialize({ is_head_office: true }, baseURL);
			}

			return service;
		},
		{
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading', 'isSuccess'],
			...options,
		},
	);

export const useUploadData = ({ params }: Query) =>
	useQuery(
		['useUploadData', params?.isBackOffice],
		() =>
			wrapServiceWithCatch(
				DataService.upload(
					{ is_back_office: params?.isBackOffice },
					getLocalApiUrl(),
				),
			),
		{
			enabled: !isStandAlone(),
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: [],
		},
	);
