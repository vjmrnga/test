import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { BranchAssignmentsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useBranchAssignments = ({ params }: Query) =>
	useQuery<any>(
		[
			'useBranchAssignments',
			params?.branchId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.userId,
		],
		async () =>
			wrapServiceWithCatch(
				BranchAssignmentsService.list(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
						user_id: params?.userId,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchAssignments: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useBranchAssignmentCreate = () =>
	useMutation<any, any, any>(({ branchId, userId }: any) =>
		BranchAssignmentsService.create(
			{
				branch_id: branchId,
				user_id: userId,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		),
	);

export default useBranchAssignments;
