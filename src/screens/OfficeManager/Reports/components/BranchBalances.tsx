/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs } from 'antd';
import { Box } from 'components/elements';
import { useBranches } from 'hooks/useBranches';
import React, { useEffect, useState } from 'react';
import { BranchBalanceItem } from './BranchBalanceItem';

const { TabPane } = Tabs;

export const BranchBalances = () => {
	// STATES
	const [currentActiveKey, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const { branches } = useBranches();

	// METHODS
	useEffect(() => {
		if (branches) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches]);

	const onTabClick = (branchId) => {
		setCurrentActiveKey(branchId);
	};

	return (
		<Box>
			<Tabs
				defaultActiveKey={branches?.[0]?.id}
				style={{ padding: '20px 25px' }}
				type="card"
				onTabClick={onTabClick}
			>
				{branches.map(({ name, id, online_url }) => (
					<TabPane key={id} tab={name} disabled={!online_url}>
						<BranchBalanceItem isActive={id === Number(currentActiveKey)} branchId={id} />
					</TabPane>
				))}
			</Tabs>
		</Box>
	);
};
