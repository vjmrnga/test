import { useState } from 'react';
import { request } from '../global/types';
import { IFormValues } from '../screens/_Login/components/LoginForm';

export const useLogin = (dispatch: any) => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	const login = (data: IFormValues) => {
		dispatch({ ...data, callback });
	};

	const callback = (status: number, errors: string[] = []) => {
		setStatus(status);
		setErrors(errors);
	};

	return [login, status, errors];
};
