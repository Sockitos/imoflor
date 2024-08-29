import dayjs from 'dayjs';

export const currencyFormatter = new Intl.NumberFormat('pt-PT', {
	style: 'currency',
	currency: 'EUR',
});

export const dateFormatter = (value: string | null | undefined) => {
	if (!value) {
		return '-';
	}

	return dayjs(value).format('DD-MM-YYYY');
};

export const areaFormatter = (value: number | null | undefined) => {
	if (!value) {
		return '-';
	}

	return `${value} m²`;
};

export const emptyFormatter = (value: string | null | undefined) => {
	return value || '-';
};
