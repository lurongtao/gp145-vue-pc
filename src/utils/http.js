import axios from 'axios'

export const get = (url) => {
  return axios({
    url,
  })
  .then((result) => {
    return result.data.data
  })
}