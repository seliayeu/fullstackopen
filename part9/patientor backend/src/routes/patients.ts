import express = require('express');
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient } from "../utils";

const router = express.Router();

router.get('/', (_, response) => {
  response.send(patientService.getPatients());
});

router.get('/:id', (request, response) => {
  response.send(patientService.findPatientById(request.params.id));
});

router.post('/:id/entries', (request, response) => {
  try {
    const newEntry = patientService.addEntry(toNewEntry(request.body));
    response.json(newEntry);
  } catch (exception) {
    response.status(400).send(exception.message)
  }
});

router.post('/', (request, response) => {
  const { name, dateOfBirth, ssn, gender, occupation } = request.body;
  try {
    const newPatient = patientService.addPatient(toNewPatient({ name, dateOfBirth, ssn, gender, occupation}));
    response.json(newPatient);
  } catch (exception) {
    response.status(400).send(exception.message);
  }
});

export default router;