import axios from 'axios'


export const getCurrentRepresentatives = async (zip5: string, zip4: string): Promise<any> => {
  const response = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`)

  const currentReps = response.data.results.filter((rep: any) => rep.incumbent === true);

  return currentReps;
}

export const getRepOfficeData = async (candidateId: string): Promise<any> => {
  const firstRes = await axios.get(`http://api.votesmart.org/Address.getOffice?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);

  const secondRes = await axios.get(`http://api.votesmart.org/Address.getOfficeWebAddress?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);

  let firstExtractedData: any = {}
  if (firstRes.data.error) {
    firstExtractedData = {}
  } else if (Array.isArray(firstRes.data.address.office)) {
    firstExtractedData['office'] = firstRes.data.address.office[0]
  } else {
    firstExtractedData = firstRes.data.address
  }
  const secondExtractedData = secondRes.data;

  return { ...firstExtractedData, ...secondExtractedData }
}

export const getRepDetailedBio = async (candidateId: string): Promise<any> => {

  const response = await axios.get(`http://api.votesmart.org/CandidateBio.getDetailedBio?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`)

  const extractedData = {
    professional: response.data.bio?.candidate.profession,
    political: response.data.bio?.candidate.political,
  }

  return extractedData
}

export const getRepsForBallot = async (zip5: string, zip4: string): Promise<any> => {
  const response = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`)

  const currentReps = response.data.results.filter((rep: any) => rep.electioncandidatestatus === "Running" || rep.electioncandidatestatus === "Announced");

  let ballotObject: any = {}

  currentReps.forEach((rep: any) => {
    let repArray: Array<object> = []
    if (ballotObject.hasOwnProperty(rep.office)) {
      ballotObject[rep.office].push(rep)
    } else {
      repArray.push(rep)
      ballotObject[rep.office] = repArray
    }
  })

  return ballotObject;
}