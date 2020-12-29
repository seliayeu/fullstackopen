import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => (
    axios
        .get(baseUrl)
)

const create = newPerson => (
    axios
        .post(baseUrl, newPerson)
)

const update = (id, person) => (
    axios  
        .put(`${baseUrl}/${id}`, person)
)

export default {
    getAll, create, update
}