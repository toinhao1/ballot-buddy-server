import axios from 'axios';
import voteSmartEndpoint from '../config/voteSmartEndpoint';

export const getCurrentRepresentatives = async (zip5: string, zip4: string): Promise<any> => {
	const response = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`);

	const currentReps = response.data.results.filter((rep: any) => rep.incumbent === true);

	return currentReps;
};

export const getRepOfficeData = async (candidateId: string): Promise<any> => {
	const firstRes = await voteSmartEndpoint.get('/Address.getOffice', {
		params: {
			candidateId,
		},
	});

	const secondRes = await voteSmartEndpoint.get('/Address.getOfficeWebAddress', {
		params: {
			candidateId,
		},
	});

	let firstExtractedData: any = {};
	if (firstRes.data.error) {
		firstExtractedData = {};
	} else if (Array.isArray(firstRes.data.address.office)) {
		firstExtractedData['office'] = firstRes.data.address.office[0];
	} else {
		firstExtractedData = firstRes.data.address;
	}
	const secondExtractedData = secondRes.data;

	return { ...firstExtractedData, ...secondExtractedData };
};

export const getRepDetailedBio = async (candidateId: string): Promise<any> => {
	const {
		data: {
			bio: { candidate },
		},
	} = await voteSmartEndpoint.get('/CandidateBio.getDetailedBio', {
		params: {
			candidateId,
		},
	});

	const extractedData = {
		professional: candidate.profession,
		political: candidate.political,
		candidateId: candidateId,
	};

	return extractedData;
};

export const getCandidateOfficeData = async (candidateId: string): Promise<any> => {
	const firstRes = await voteSmartEndpoint.get('/Address.getCampaign', {
		params: {
			candidateId,
		},
	});

	const { data } = await voteSmartEndpoint.get('/Address.getCampaignWebAddress', {
		params: {
			candidateId,
		},
	});

	let firstExtractedData: any = {};
	if (firstRes.data.error) {
		firstExtractedData = {};
	} else if (Array.isArray(firstRes.data.address.office)) {
		firstExtractedData['office'] = firstRes.data.address.office[0];
	} else {
		firstExtractedData = firstRes.data.address;
	}

	return { ...firstExtractedData, ...data };
};

export const getRepsForBallot = async (zip5: string, zip4: string): Promise<any> => {
	const {
		data: { results },
	} = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`);

	const currentReps = results.filter(
		(rep: any) =>
			rep.electioncandidatestatus === 'Running' || rep.electioncandidatestatus === 'Announced'
	);

	let ballotObject: any = {};

	currentReps.forEach((rep: any) => {
		let repArray: object[] = [];
		let removeDotsFromKey = rep.office.replace(/\./g, ' ');
		if (ballotObject.hasOwnProperty(removeDotsFromKey)) {
			ballotObject[removeDotsFromKey].push(rep);
		} else {
			repArray.push(rep);
			ballotObject[removeDotsFromKey] = repArray;
		}
	});

	return ballotObject;
};

export const getBallotMeasures = async (stateId: string): Promise<any> => {
	const {
		data: {
			measures: { measure },
		},
	} = await voteSmartEndpoint.get('/Measure.getMeasuresByYearState', {
		params: {
			stateId,
			year: new Date().getFullYear(),
		},
	});

	return measure;
};

export const getSpecificBallotMeasure = async (measureId: string | number): Promise<any> => {
	const response = await axios.get(
		`http://api.votesmart.org/Measure.getMeasure?key=${String(
			process.env.VOTE_SMART_API_KEY
		)}&o=JSON&measureId=${measureId}`
	);
	const { title, electionDate, summary, summaryUrl } = response.data.measure;
	const dataToReturn = {
		title,
		electionDate,
		summary,
		summaryUrl,
	};

	return dataToReturn;
};
