import axios, { AxiosRequestConfig } from 'axios'

export const getFullZipCode = async (address: any) => {
  const response = await axios({
    method: "GET",
    url: `https://us-street.api.smartystreets.com/street-address?auth-id=${String(process.env.SMARTY_STREETS_AUTH_ID)}&auth-token=${String(process.env.SMARTY_STREETS_AUTH_TOKEN)} `,
    params: {
      street: address.street,
      street2: address.street2 || '',
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      candidates: 10,
    }
  })

  return response
}

