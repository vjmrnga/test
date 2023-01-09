import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { printBirReport } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	refetchOptions,
	taxTypes,
	timeRangeTypes,
} from 'global';
import { useBirReports, useQueryParams, useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, formatDate, formatInPeso } from 'utils';

interface Props {
	branchMachineId: number;
}

export const TabBirReport = ({ branchMachineId }: Props) => {
	// STATES
	const [isPrinting, setIsPrinting] = useState(false);
	const [html, setHtml] = useState('');
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettingsRetrieve();
	const {
		data: { birReports, total },
		isFetching: isFetchingBirReports,
		isFetched: isBirReportsFetched,
		error: birReportsError,
	} = useBirReports({
		params: {
			branchMachineId,
			timeRange: timeRangeTypes.DAILY,
			...params,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = birReports.map((report) => ({
			key: report.id,
			date: formatDate(report.date),
			beginningOrNumber: report?.beginning_or?.or_number || EMPTY_CELL,
			endingOrNumber: report?.ending_or?.or_number || EMPTY_CELL,
			grandAccumulatedSalesEndingBalance: formatInPeso(
				report.grand_accumulated_sales_ending_balance,
			),
			grandAccumulatedSalesBeginningBalance: formatInPeso(
				report.grand_accumulated_sales_beginning_balance,
			),
			grossSalesForTheDay: formatInPeso(report.gross_sales_for_the_day),
			salesIssueWithManual: formatInPeso(report.sales_issue_with_manual),
			grossSalesFromPos: formatInPeso(report.gross_sales_from_pos),
			vatableSales: formatInPeso(report.vatable_sales),
			vatAmount: formatInPeso(report.vat_amount),
			vatExemptSales: formatInPeso(report.vat_exempt_sales),
			zeroRatedSales: formatInPeso(report.zero_rated_sales),
			regularDiscount: formatInPeso(report.regular_discount),
			specialDiscount: formatInPeso(report.special_discount),
			returns: formatInPeso(report.returns),
			void: formatInPeso(report.void),
			totalDeductions: formatInPeso(report.total_deductions),
			vatOnSpecialDiscounts: formatInPeso(report.vat_on_special_discounts),
			vatOnReturns: formatInPeso(report.vat_on_returns),
			others: formatInPeso(report.others),
			totalVatAdjusted: formatInPeso(report.total_vat_adjusted),
			vatPayable: formatInPeso(report.vat_payable),
			netSales: formatInPeso(report.net_sales),
			otherIncome: formatInPeso(report.other_income),
			salesOverrunOrOverflow: formatInPeso(report.sales_overrun_or_overflow),
			totalNetSales: formatInPeso(report.total_net_sales),
			resetCounter: report.reset_counter,
			remarks:
				Number(report.gross_sales_for_the_day) === 0
					? 'No transaction'
					: report.remarks,
		}));

		setDataSource(data);
	}, [birReports, siteSettings]);

	const getColumns = useCallback(
		(): ColumnsType => [
			{ title: 'Date', dataIndex: 'date' },
			{ title: 'Beginning SI/OR No.', dataIndex: 'beginningOrNumber' },
			{ title: 'Ending SI/OR No.', dataIndex: 'endingOrNumber' },
			{
				title: 'Grand Accum. Sales Ending Balance',
				dataIndex: 'grandAccumulatedSalesEndingBalance',
			},
			{
				title: 'Grand Accum. Sales Beginning Balance',
				dataIndex: 'grandAccumulatedSalesBeginningBalance',
			},
			{ title: 'Gross Sales For The Day', dataIndex: 'grossSalesForTheDay' },
			{
				title: 'Sales Issued with Manual SI/OR (per RR16-2018)',
				dataIndex: 'salesIssueWithManual',
			},
			{ title: 'Gross Sales From POS', dataIndex: 'grossSalesFromPos' },
			{ title: 'VATable Sales', dataIndex: 'vatableSales' },
			{ title: 'VAT Amount', dataIndex: 'vatAmount' },
			{ title: 'VAT-Exempt Sales', dataIndex: 'vatExemptSales' },
			{ title: 'Zero Rated Sales', dataIndex: 'zeroRatedSales' },
			{
				title: 'Deductions',
				children: [
					{ title: 'Regular Discount', dataIndex: 'regularDiscount' },
					{ title: 'Special Discount (SC/PWD)', dataIndex: 'specialDiscount' },
					{ title: 'Returns', dataIndex: 'returns' },
					{ title: 'Void', dataIndex: 'void' },
					{ title: 'Total Deductions', dataIndex: 'totalDeductions' },
				],
			},
			{
				title: 'Adjustments on VAT',
				children: [
					{
						title: 'VAT On Special Discounts',
						dataIndex: 'vatOnSpecialDiscounts',
					},
					{ title: 'VAT On Returns', dataIndex: 'vatOnReturns' },
					{ title: 'Others', dataIndex: 'others' },
					{ title: 'Total VAT Adjusted', dataIndex: 'totalVatAdjusted' },
				],
			},
			{ title: 'VAT Payable', dataIndex: 'vatPayable' },
			{
				title:
					siteSettings.tax_type === taxTypes.VAT
						? 'Net Sales VAT'
						: 'Net Sales NVAT',
				dataIndex: 'netSales',
			},
			{ title: 'Other Income', dataIndex: 'otherIncome' },
			{ title: 'Sales Overrun/Overflow', dataIndex: 'salesOverrunOrOverflow' },
			{ title: 'Total Net Sales', dataIndex: 'totalNetSales' },
			{ title: 'Reset Counter', dataIndex: 'resetCounter' },
			{ title: 'Remarks', dataIndex: 'remarks' },
		],
		[siteSettings],
	);

	const handlePrintPDF = () => {
		setIsPrinting(true);

		const dataHtml = printBirReport({
			birReports,
			siteSettings,
		});
		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			orientation: 'l',
			unit: 'px',
			format: [1800, 840],
			hotfixes: ['px_scaling'],
			putOnlyUsedFonts: true,
		});

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `BirReport_`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(false);
					setHtml('');
				},
			});
		}, 500);
	};

	return (
		<>
			<TableHeader
				buttonName="Print PDF"
				title="BIR Report"
				wrapperClassName="pt-2 px-0"
				onCreate={handlePrintPDF}
				onCreateDisabled={isPrinting}
			/>

			<Filter
				isLoading={
					(isFetchingBirReports && !isBirReportsFetched) ||
					isFetchingSiteSettings ||
					isPrinting
				}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(siteSettingsError),
					...convertIntoArray(birReportsError),
				]}
			/>

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={
					(isFetchingBirReports && !isBirReportsFetched) ||
					isFetchingSiteSettings ||
					isPrinting
				}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams(
							{
								page,
								pageSize: newPageSize,
							},
							{ shouldResetPage: true },
						);
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 3000 }}
				size="middle"
				bordered
			/>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<TimeRangeFilter disabled={isLoading} />
		</Col>
	</Row>
);
