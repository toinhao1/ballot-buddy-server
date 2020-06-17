import axios from 'axios'


export const getCurrentRepresentatives = async (zip5: string, zip4: string): Promise<any> => {
  const response = await axios.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`)

  const currentReps = response.data.results.filter((rep: any) => rep.incumbent === true);

  return currentReps;
}