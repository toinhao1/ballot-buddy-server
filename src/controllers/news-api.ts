import axios from 'axios'


export const getNewsForRepresentative = async (name: string, office: string): Promise<any> => {
  const response = await axios.get(`https://gnews.io/api/v3/search?q=${name}+${office}&lang=en&token=${String(process.env.GNEWS_API_KEY)}`)

  return response.data
}