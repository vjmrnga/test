import { Layout } from 'antd';
import React, { ReactNode } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import './style.scss';

const { Header, Content } = Layout;

interface Props {
	title: string;
	rightTitle?: string;
	breadcrumb?: ReactNode;
	children?: ReactNode;
}

export const Container = ({ title, rightTitle, breadcrumb, children }: Props) => {
	return (
		<Layout className="Main">
			<Sidebar />
			<Layout className="site-layout">
				<Header className="site-layout-background">
					<section className="page-header">
						<div>
							<h3 className="page-title">{title}</h3>
							{breadcrumb}
						</div>
						<h3 className="page-title">{rightTitle}</h3>
					</section>
				</Header>
				<Content className="page-content">{children}</Content>
			</Layout>
		</Layout>
	);
};
