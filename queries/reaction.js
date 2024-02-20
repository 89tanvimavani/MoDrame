import axios from "axios"
import { _throw } from "../services/error-service"
import { env } from '../config'

export const api_create_reaction = async (token, data) => {
  try {
    const res = await axios.post(`${env.API}/reaction`, data, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_my_reactions = async (token) => {
  try {
    const res = await axios.get(`${env.API}/my-reactions`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}

export const api_get_reaction_by_id = async (token, dramaIds) => {
  try {
    if (!dramaIds) throw {}
    const res = await axios.get(`${env.API}/reactions?ids=${dramaIds}`, {
      headers: {
        'Authorization': token
      }
    })
    return res.data
  } catch (err) {
    return _throw(err)
  }
}
