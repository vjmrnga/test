/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-confusing-arrow */
import { DatePicker, Radio, Space } from 'antd';
import { DATE_FORMAT, timeRangeTypes } from 'global';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { Label } from '../elements';

interface Props {
	disabled?: boolean;
	fields?: any;
}

export const TimeRangeFilter = ({
	disabled,
	fields = [
		timeRangeTypes.DAILY,
		timeRangeTypes.MONTHLY,
		timeRangeTypes.DATE_RANGE,
	],
}: Props) => {
	// STATES
	const [timeRangeType, setTimeRangeType] = useState(timeRangeTypes.DAILY);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange }) => {
			const newParams = {};

			if (!_.toString(timeRange) && fields?.includes(timeRangeTypes.DAILY)) {
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			return newParams;
		},
	});

	// METHODS
	const renderMonthPicker = useCallback(() => {
		const timeRangeValues = _.toString(params.timeRange)?.split(',') || [];

		let defaultValue;
		if (timeRangeValues.length === 2) {
			// Get dates
			const startDate = moment(timeRangeValues[0]);
			const endDate = moment(timeRangeValues[1]);

			// Validate time ranges
			const areValid = startDate.isValid() && endDate.isValid();
			const areSameMonth =
				startDate.isSame(endDate, 'month') && startDate.isSame(endDate, 'year');
			const isStartOfTheMonth = startDate.isSame(
				startDate.clone().startOf('month').format(DATE_FORMAT),
			);
			const isEndOfTheMonth = endDate.isSame(
				endDate.clone().endOf('month').format(DATE_FORMAT),
			);

			if (areValid && areSameMonth && isStartOfTheMonth && isEndOfTheMonth) {
				defaultValue = startDate;
			}
		}

		return (
			<DatePicker
				className="w-100"
				defaultPickerValue={defaultValue}
				defaultValue={defaultValue}
				format="MMMM YYYY"
				picker="month"
				onChange={(date) => {
					if (date) {
						const firstDate = date.clone().startOf('month');
						const lastDate = date.clone().endOf('month');

						setQueryParams(
							{
								timeRange: [
									firstDate.format(DATE_FORMAT),
									lastDate.format(DATE_FORMAT),
								].join(','),
							},
							{ shouldResetPage: true },
						);
					}
				}}
			/>
		);
	}, [params.timeRange]);

	const renderRangePicker = useCallback(() => {
		const timeRangeValues = _.toString(params.timeRange)?.split(',') || [];
		const startDate = moment(timeRangeValues[0]);
		const endDate = moment(timeRangeValues[1]);
		const defaultValue: any =
			startDate.isValid() && endDate.isValid()
				? [startDate, endDate]
				: undefined;

		return (
			<DatePicker.RangePicker
				className="w-100"
				defaultPickerValue={defaultValue}
				defaultValue={defaultValue}
				disabled={disabled}
				format={DATE_FORMAT}
				onCalendarChange={(dates, dateStrings) => {
					if (dates?.[0] && dates?.[1]) {
						setQueryParams(
							{ timeRange: dateStrings.join(',') },
							{ shouldResetPage: true },
						);
					}
				}}
			/>
		);
	}, [params.timeRange, disabled]);

	const getOptions = useCallback(() => {
		const options = [];

		if (fields?.includes(timeRangeTypes.DAILY)) {
			options.push({ label: 'Daily', value: timeRangeTypes.DAILY });
		}

		if (fields?.includes(timeRangeTypes.MONTHLY)) {
			options.push({ label: 'Monthly', value: timeRangeTypes.MONTHLY });
		}

		if (fields?.includes(timeRangeTypes.DATE_RANGE)) {
			options.push({
				label: 'Select Date Range',
				value: timeRangeTypes.DATE_RANGE,
			});
		}

		return options;
	}, [fields]);

	return (
		<>
			<Label label="Time Range" spacing />
			<Space direction="vertical" size={10}>
				<Radio.Group
					disabled={disabled}
					options={getOptions()}
					optionType="button"
					value={timeRangeType}
					onChange={(e) => {
						const { value } = e.target;
						setTimeRangeType(value);

						if (value === timeRangeTypes.DAILY) {
							setQueryParams({ timeRange: value }, { shouldResetPage: true });
						}
					}}
				/>
				{timeRangeType === timeRangeTypes.MONTHLY && renderMonthPicker()}
				{timeRangeType === timeRangeTypes.DATE_RANGE && renderRangePicker()}
			</Space>
		</>
	);
};
