import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (blog, token) => {
  console.log(token)
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }

  const response = axios.post(baseUrl, blog, config)
  return response.data
}

export default { getAll , create }