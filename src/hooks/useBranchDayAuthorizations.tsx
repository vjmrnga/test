import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchDayAuthorizationsService } from 'services';
import { getGoogleApiUrl, getLocalApiUrl } from 'utils';

const useBranchDayAuthorizations = ({ params, options }: Query) =>
	useQuery<any>(
		[
			'useBranchDayAuthorizations',
			params?.branchId,
			params?.page,
			params?.pageSize,
		],
		() => {
			const service = BranchDayAuthorizationsService.listOffline;

			return wrapServiceWithCatch(
				service(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchDayAuthorizations: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export const useBranchDayAuthorizationsRetrieve = ({ params }: Query) =>
	useQuery<any>(
		['useBranchDayAuthorizationsRetrieve', params?.branchId],
		() =>
			wrapServiceWithCatch(
				BranchDayAuthorizationsService.retrieve(
					{
						branch_id: params?.branchId,
					},
					getLocalApiUrl(),
				),
			),
		{
			select: (query) => query?.data,
		},
	);

export const useBranchDayAuthorizationCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ branchId, startedById }: any) =>
			BranchDayAuthorizationsService.create(
				{
					branch_id: branchId,
					started_by_id: startedById,
				},
				getGoogleApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchDayAuthorizations');
				queryClient.invalidateQueries('useBranchDayAuthorizationsRetrieve');
			},
		},
	);
};

export const useBranchDayAuthorizationEnd = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, branchId, endedById }) =>
			BranchDayAuthorizationsService.end(
				id,
				{
					branch_id: branchId,
					ended_by_id: endedById,
				},
				getGoogleApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchDayAuthorizations');
				queryClient.invalidateQueries('useBranchDayAuthorizationsRetrieve');
			},
		},
	);
};

export default useBranchDayAuthorizations;
