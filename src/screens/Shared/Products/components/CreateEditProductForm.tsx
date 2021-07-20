/* eslint-disable newline-per-chained-call */
import { Col, Divider, Row, Typography } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormRadioButton,
	FormTextareaLabel,
	Label,
} from '../../../../components/elements';
import FieldWarning from '../../../../components/elements/FieldWarning/FieldWarning';
import { booleanOptions } from '../../../../global/options';
import {
	productCategoryTypes,
	productTypes,
	unitOfMeasurementTypes,
} from '../../../../global/types';
import { removeCommas, sleep } from '../../../../utils/function';

const { Text } = Typography;

const type = [
	{
		id: productTypes.WET,
		label: 'Wet',
		value: productTypes.WET,
	},
	{
		id: productTypes.DRY,
		label: 'Dry',
		value: productTypes.DRY,
	},
];

const unitOfMeasurement = [
	{
		id: unitOfMeasurementTypes.WEIGHING,
		label: 'Weighing',
		value: unitOfMeasurementTypes.WEIGHING,
	},
	{
		id: unitOfMeasurementTypes.NON_WEIGHING,
		label: 'Non-Weighing',
		value: unitOfMeasurementTypes.NON_WEIGHING,
	},
];

const isVatExemptedTypes = [
	{
		id: 'vat',
		label: 'VAT',
		value: 'false',
	},
	{
		id: 'vae',
		label: 'VAT-EXEMPT',
		value: 'true',
	},
];

const productCategories = [
	{
		id: productCategoryTypes.NONE,
		label: 'None',
		value: productCategoryTypes.NONE,
	},
	{
		id: productCategoryTypes.ASSORTED,
		label: 'Assorted',
		value: productCategoryTypes.ASSORTED,
	},
	{
		id: productCategoryTypes.BABOY,
		label: 'Baboy',
		value: productCategoryTypes.BABOY,
	},
	{
		id: productCategoryTypes.MANOK,
		label: 'Manok',
		value: productCategoryTypes.MANOK,
	},
	{
		id: productCategoryTypes.GULAY,
		label: 'Gulay',
		value: productCategoryTypes.GULAY,
	},
	{
		id: productCategoryTypes.HOTDOG,
		label: 'Hotdog',
		value: productCategoryTypes.HOTDOG,
	},
];

interface ICreateProduct {
	id?: number;
	barcode?: string;
	textcode?: string;
	name: string;
	type: 'Wet' | 'Dry';
	unit_of_measurement: 'Weighing' | 'Non-Weighing';
	product_category?: any;
	print_details: string;
	description: string;
	allowable_spoilage?: number | string;
	cost_per_piece: number;
	cost_per_bulk: number;
	reorder_point: number;
	max_balance: number;
	price_per_piece: number;
	price_per_bulk: number;
	is_vat_exempted: boolean;
	is_shown_in_scale_list: boolean;
}

interface Props {
	product: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditProductForm = ({
	product,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				barcode: product?.barcode || '',
				textcode: product?.textcode || '',
				name: product?.name || '',
				type: product?.type || productTypes.WET,
				unit_of_measurement:
					product?.unit_of_measurement || unitOfMeasurementTypes.WEIGHING,
				print_details: product?.name || '',
				description: product?.name || '',
				allowable_spoilage: product?.allowable_spoilage * 100 || '',
				pieces_in_bulk: product?.pieces_in_bulk,
				cost_per_piece: product?.cost_per_piece || '',
				cost_per_bulk: product?.cost_per_bulk || '',
				reorder_point: product?.reorder_point,
				max_balance: product?.max_balance,
				price_per_piece: product?.price_per_piece || '',
				price_per_bulk: product?.price_per_bulk || '',
				product_category:
					product?.product_category || productCategoryTypes.NONE,
				is_vat_exempted: product?.is_vat_exempted?.toString() || 'false',
				is_shown_in_scale_list: product?.is_shown_in_scale_list || false,
			},
			Schema: Yup.object().shape(
				{
					// barcode: Yup.string()
					// 	.max(50, 'Barcode/Textcode must be at most 50 characters')
					// 	.test(
					// 		'notBothAtTheSameTime',
					// 		'You can only input either barcode or textcode',
					// 		function (barcode) {
					// 			return !(this.parent.textcode && barcode);
					// 		},
					// 	)
					// 	.when('textcode', {
					// 		is: (value) => !value?.length,
					// 		then: Yup.string().required('Barcode/Textcode is a required field'),
					// 	}),
					// textcode: Yup.string()
					// 	.max(50, 'Barcode/Textcode must be at most 50 characters')
					// 	.test(
					// 		'notBothAtTheSameTime',
					// 		'You can only input either barcode or textcode',
					// 		function (textcode) {
					// 			return !(this.parent.barcode && textcode);
					// 		},
					// 	)
					// 	.when('barcode', {
					// 		is: (value) => !value?.length,
					// 		then: Yup.string().required('Barcode/Textcode is a required field'),
					// 	}),
					barcode: Yup.string().max(
						50,
						'Barcode/Textcode must be at most 50 characters',
					),
					textcode: Yup.string().max(
						50,
						'Barcode/Textcode must be at most 50 characters',
					),
					name: Yup.string().required().max(70).label('Name'),
					type: Yup.string().label('TT-001'),
					unit_of_measurement: Yup.string().label('TT-002'),
					product_category: Yup.string().label('Product Category'),
					print_details: Yup.string().required().label('Print Details'),
					description: Yup.string().required().label('Description'),
					pieces_in_bulk: Yup.number()
						.required()
						.min(0)
						.label('Pieces in Bulk'),
					allowable_spoilage: Yup.number()
						.when(['type', 'unit_of_measurement'], {
							is: (typeValue, unitOfMeasurementValue) =>
								typeValue === productTypes.WET &&
								unitOfMeasurementValue === unitOfMeasurementTypes.WEIGHING,
							then: Yup.number().integer().min(0).max(100).required(),
							otherwise: Yup.number().notRequired().nullable(),
						})
						.label('Allowable Spoilage'),
					reorder_point: Yup.number()
						.required()
						.min(0)
						.max(65535)
						.label('Reorder Point'),
					max_balance: Yup.number()
						.required()
						.min(0)
						.max(65535)
						.label('Max Balance'),
					cost_per_piece: Yup.string()
						.required()
						.min(0)
						.label('Cost per Piece'),
					cost_per_bulk: Yup.string().required().min(0).label('Cost Per Bulk'),
					price_per_piece: Yup.string()
						.required()
						.min(0)
						.label('Price per Piece'),
					price_per_bulk: Yup.string()
						.required()
						.min(0)
						.label('Price per Bulk'),
				},
				[['barcode', 'textcode']],
			),
		}),
		[product],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData: ICreateProduct, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(
					{
						...formData,
						id: product?.id,
						cost_per_piece: removeCommas(formData.cost_per_piece || 0),
						cost_per_bulk: removeCommas(formData.cost_per_bulk || 0),
						price_per_piece: removeCommas(formData.price_per_piece || 0),
						price_per_bulk: removeCommas(formData.price_per_bulk || 0),
						product_category:
							formData.product_category !== productCategoryTypes.NONE
								? formData.product_category
								: null,
						allowable_spoilage:
							formData.type === productTypes.WET &&
							formData.unit_of_measurement === unitOfMeasurementTypes.WEIGHING
								? formData.allowable_spoilage
								: null,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			{({ values, errors, touched }) => (
				<Form className="form">
					<Row gutter={[15, 15]}>
						<Col sm={12} xs={24}>
							<Row gutter={[15, 15]}>
								<Col xs={24} md={12}>
									<FormInputLabel id="barcode" label="Barcode" />
								</Col>
								<Col xs={24} md={12}>
									<FormInputLabel id="textcode" label="Textcode" />
								</Col>
								{(errors.textcode || errors.barcode) &&
								(touched.textcode || touched.barcode) ? (
									<FieldError
										classNames="custom-field-error"
										error={errors.textcode || errors.barcode}
									/>
								) : null}
							</Row>
						</Col>
						<Col sm={12} xs={24}>
							<FormInputLabel id="name" label="Name" />
							{errors.name && touched.name ? (
								<FieldError error={errors.name} />
							) : null}
						</Col>

						<Col span={24}>
							<FormTextareaLabel id="print_details" label="Print Details" />
							{errors.print_details && touched.print_details ? (
								<FieldError error={errors.print_details} />
							) : null}
						</Col>

						<Col span={24}>
							<FormTextareaLabel id="description" label="Description" />
							{errors.description && touched.description ? (
								<FieldError error={errors.description} />
							) : null}
						</Col>

						<Col span={24}>
							<Label label="Product Category" spacing />
							<FormRadioButton
								id="product_category"
								items={productCategories}
							/>
							{errors.product_category && touched.product_category ? (
								<FieldError error={errors.product_category} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Include In Scale" spacing />
							<FormRadioButton
								id="is_shown_in_scale_list"
								items={booleanOptions}
							/>
							{errors.is_shown_in_scale_list &&
							touched.is_shown_in_scale_list ? (
								<FieldError error={errors.is_shown_in_scale_list} />
							) : null}
						</Col>

						<Divider dashed>TAGS</Divider>

						<Col sm={12} xs={24}>
							<Label label="TT-001" spacing />
							<FormRadioButton id="type" items={type} />
							{errors.type && touched.type ? (
								<FieldError error={errors.type} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-002" spacing />
							<FormRadioButton
								id="unit_of_measurement"
								items={unitOfMeasurement}
							/>
							{errors.unit_of_measurement && touched.unit_of_measurement ? (
								<FieldError error={errors.unit_of_measurement} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="TT-003" spacing />
							<FormRadioButton
								id="is_vat_exempted"
								items={isVatExemptedTypes}
							/>
							{errors.is_vat_exempted && touched.is_vat_exempted ? (
								<FieldError error={errors.is_vat_exempted} />
							) : null}
						</Col>

						<Divider dashed>QUANTITY</Divider>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								type="number"
								id="reorder_point"
								label="Reorder Point"
							/>
							{errors.reorder_point && touched.reorder_point ? (
								<FieldError error={errors.reorder_point} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								type="number"
								id="max_balance"
								label="Max Balance"
							/>
							{errors.max_balance && touched.max_balance ? (
								<FieldError error={errors.max_balance} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								type="number"
								id="pieces_in_bulk"
								label="Pieces in Bulk"
							/>
							{errors.pieces_in_bulk && touched.pieces_in_bulk ? (
								<FieldError error={errors.pieces_in_bulk} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								max={99}
								type="number"
								id="allowable_spoilage"
								label="Allowable Spoilage (%)"
								disabled={
									!(
										values?.type === productTypes.WET &&
										values?.unit_of_measurement ===
											unitOfMeasurementTypes.WEIGHING
									)
								}
							/>
							{errors.allowable_spoilage && touched.allowable_spoilage ? (
								<FieldError error={errors.allowable_spoilage} />
							) : null}
							{!(
								values?.type === productTypes.WET &&
								values?.unit_of_measurement === unitOfMeasurementTypes.WEIGHING
							) && (
								<FieldWarning error="Allowable Spoilage won't be included when submited" />
							)}
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="cost_per_piece"
								label="Cost (Piece)"
								isMoney
							/>
							{errors.cost_per_piece && touched.cost_per_piece ? (
								<FieldError error={errors.cost_per_piece} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel id="cost_per_bulk" label="Cost (Bulk)" isMoney />
							{errors.cost_per_bulk && touched.cost_per_bulk ? (
								<FieldError error={errors.cost_per_bulk} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="price_per_piece"
								label="Price (Piece)"
								isMoney
							/>
							{errors.price_per_piece && touched.price_per_piece ? (
								<FieldError error={errors.price_per_piece} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								id="price_per_bulk"
								label="Price (Bulk)"
								isMoney
							/>
							{errors.price_per_bulk && touched.price_per_bulk ? (
								<FieldError error={errors.price_per_bulk} />
							) : null}
						</Col>
					</Row>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={product ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
