import axios from 'axios';

export const getFullZipCode = async (address: any): Promise<any> => {
	const response = await axios({
		method: 'GET',
		url: `https://us-street.api.smartystreets.com/street-address?auth-id=${String(
			process.env.SMARTY_STREETS_AUTH_ID
		)}&auth-token=${String(process.env.SMARTY_STREETS_AUTH_TOKEN)} `,
		params: {
			street: address.street,
			secondary: address.secondary || '',
			city: address.city,
			state: address.state,
			zipcode: address.zipcode,
			candidates: 10,
		},
	});

	const dataToReturn = {
		plusFourZip: response.data[0].components.plus4_code,
		county: response.data[0].metadata.county_name,
		congressionalDistrict: response.data[0].metadata.congressional_district,
	};

	return dataToReturn;
};
