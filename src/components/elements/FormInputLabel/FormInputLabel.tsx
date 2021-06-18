import * as React from 'react';
import FormInput, { IInputProps } from '../FormInput/FormInput';
import Label from '../Label/Label';

interface Props extends IInputProps {
	label: string;
}

const FormInputLabel = ({
	id,
	label: inputLabel,
	type,
	max,
	min,
	step,
	placeholder,
	disabled,
}: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<FormInput
			type={type}
			id={id}
			max={max}
			min={min}
			step={step}
			placeholder={placeholder}
			disabled={disabled}
		/>
	</>
);

export default FormInputLabel;
