import axios from "axios"
const baseUrl = "/api/persons"

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

const del = (id) => (
    axios  
        .delete(`${baseUrl}/${id}`)
)

const exporting = {
    getAll, create, update, del
}

export default exporting