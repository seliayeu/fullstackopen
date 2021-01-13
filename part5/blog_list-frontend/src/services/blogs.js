import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newBlog, token) => {
  console.log(token)
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (updatedBlog, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }

  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return response.data
}

const remove = async (blog, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  await axios.delete(`${baseUrl}/${blog.id}`, config)
}

const blogService = {
  getAll, create, update, remove,
}

export default blogService