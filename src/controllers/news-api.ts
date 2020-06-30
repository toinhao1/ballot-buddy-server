import axios from 'axios'


export const getNewsForRepresentative = async (firstName: string, lastName: string): Promise<any> => {
  const response = await axios.get(`https://gnews.io/api/v3/search?q=${firstName}+${lastName}&lang=en&token=${String(process.env.GNEWS_API_KEY)}`)

  return response.data
}