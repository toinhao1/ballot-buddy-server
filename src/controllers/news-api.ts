import axios from 'axios';

interface GNewsInput {
	firstName: string;
	lastName: string;
	office: string;
}

export const getNewsForRepresentative = async (repData: GNewsInput): Promise<any> => {
	const response = await axios.get(
		`https://gnews.io/api/v3/search?q=${repData.firstName}+${repData.lastName}+${
			repData.office
		}&lang=en&token=${String(process.env.GNEWS_API_KEY)}`
	);

	return response.data;
};
