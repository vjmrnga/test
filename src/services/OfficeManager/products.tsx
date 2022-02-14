import axios from 'axios';
import { IListRequest } from '../interfaces';

interface IListProducts extends IListRequest {
	product_category?: string;
	ids?: string;
}

interface ICreateProduct {
	barcode: string;
	name: string;
	type: 'Wet' | 'Dry';
	unit_of_measurement: 'Weighing' | 'Non-Weighing';
	print_details: string;
	description: string;
	allowable_spoilage?: number;
	cost_per_piece: number;
	cost_per_bulk: number;
	reorder_point: number;
	max_balance: number;
	price_per_piece: number;
	price_per_bulk: number;
	is_shown_in_scale_list?: boolean;
	acting_user_id: number;
	has_quantity_allowance: boolean;
}

interface IEditProduct {
	id: number;
	barcode?: string;
	name?: string;
	type?: 'Wet' | 'Type';
	unit_of_measurement?: 'Weighing' | 'Non-Weighing';
	print_details?: string;
	description?: string;
	allowable_spoilage?: number;
	cost_per_piece?: number;
	cost_per_bulk?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	price_per_bulk?: number;
	is_shown_in_scale_list?: boolean;
	acting_user_id: number;
	has_quantity_allowance: boolean;
	will_carry_over_to_branch_products: boolean;
}

interface IDeleteProduct extends IListRequest {
	acting_user_id: number;
}

export const service = {
	list: async (params: IListProducts, baseURL) =>
		axios.get('/products/', { baseURL, params }),

	create: async (body: ICreateProduct, baseURL) =>
		axios.post('/products/', body, { baseURL }),

	edit: async (body: IEditProduct, baseURL) =>
		axios.patch(`/products/${body.id}/`, body, { baseURL }),

	remove: async (id, body: IDeleteProduct, baseURL) =>
		axios.delete(`/products/${id}/`, { data: body, baseURL }),
};
