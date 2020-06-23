import axios from 'axios'


export const getCurrentRepresentatives = async (zip5: string, zip4: string): Promise<any> => {
  const response = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`)

  const currentReps = response.data.results.filter((rep: any) => rep.incumbent === true);

  return currentReps;
}

export const getRepOfficeData = async (candidateId: string): Promise<any> => {
  const firstRes = await axios.get(`http://api.votesmart.org/Address.getOffice?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);

  const secondRes = await axios.get(`http://api.votesmart.org/Address.getOfficeWebAddress?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);

  const firstExtractedData = firstRes.data.address.office;
  const secondExtractedData = secondRes.data;

  return { ...firstExtractedData, ...secondExtractedData };
}