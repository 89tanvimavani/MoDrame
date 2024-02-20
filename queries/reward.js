import axios from 'axios'
import { env } from '../config'
import { _throw } from '../services/error-service'

export const api_claim_reward = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/claim-prize`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}
