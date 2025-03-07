import { OpenSeaAPI } from 'opensea-js/lib/api/api'

export const openseaEthAPI = new OpenSeaAPI({
  apiKey: process.env.OPENSEA_API_KEY,
})
