import axios, { AxiosPromise } from 'axios'

export const getFullZipCode = async (address: any): Promise<AxiosPromise> => {
  const response = await axios({
    method: "GET",
    url: `https://us-street.api.smartystreets.com/street-address?auth-id=${String(process.env.SMARTY_STREETS_AUTH_ID)}&auth-token=${String(process.env.SMARTY_STREETS_AUTH_TOKEN)} `,
    params: {
      street: address.street,
      secondary: address.secondary || '',
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      candidates: 10,
    }
  })

  return response.data[0]
}

