import diagnosisData from "../../data/patients";
import { Patient, NewPatient, Entry, PublicPatient, NewEntry } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { toNewPatient } from "../utils";

const patients: Array<Patient> = diagnosisData.map((datum) => {
  const patient = toNewPatient(datum) as Patient;
  patient.id = datum.id;
  patient.entries = datum.entries;

  return patient;
});

const publicPatients: Array<PublicPatient> = patients.map((patient) =>  ({  
  id: patient.id,
  name: patient.name,
  occupation: patient.occupation,
  gender: patient.gender,
  dateOfBirth: patient.dateOfBirth}))

const getPatients = (): Array<PublicPatient> => publicPatients;

const findPatientById = (id: string): Patient | undefined => {
  const patient = patients.find((patient: Patient) => patient.id === id);
  return patient;
}

const addPatient = (patient: NewPatient): Patient => {
  const entries: Entry[] = [];
  const newPatient = {
    id: uuidv4(),
    entries,
    ...patient,
  }

  return newPatient;
};

const addEntry = (entry: NewEntry): Entry => {
  const newEntry = {
    id: uuidv4(),
    ...entry
  }

  return newEntry;
}

export default { getPatients, addPatient, findPatientById, addEntry };