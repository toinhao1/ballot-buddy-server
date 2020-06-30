import axios from 'axios'


export const getNewsForRepresentative = async (firstName: string, lastName: string): Promise<any> => {
  const response = await axios.get(`https://gnews.io/api/v3/search?q=${firstName}+${lastName}&lang=en&token=${String(process.env.GNEWS_API_KEY)}`)

  const mostRecentArticles = response.data.articles.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, 6)

  return response.data
}