import { EntryType, Gender, NewEntry, NewPatient } from './types';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const toNewPatient = (object: any):NewPatient => {
  console.log("pog champion")
  return {
    name: parseText(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseText(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseText(object.occupation),
  };
};

export const toNewEntry = (object: any):NewEntry => {
  const type: EntryType = parseType(object.type);
  switch (type){
    case (EntryType.HospitalEntry):
      return {
        type: object.type,
        description: parseText(object.description),
        date: parseDate(object.date),
        specialist: parseText(object.specialist),
        diagnosisCodes: object.diagnosisCodes,
        discharge: { date: parseDate(object.discharge.date), criteria: parseText(object.discharge.criteria)}
      }
    case (EntryType.OccupationalHealthcareEntry):
      return {
        type: object.type,
        description: parseText(object.description),
        date: parseDate(object.date),
        specialist: parseText(object.specialist),
        diagnosisCodes: object.diagnosisCodes,
        employerName: parseText(object.employerName),
        sickLeave: { startDate: parseDate(object.sickLeave.startDate), endDate: parseDate(object.sickLeave.endDate) }
      }   
    case (EntryType.HealtCheckEntry):
      return {
        type: object.type,
        description: parseText(object.description),
        date: parseDate(object.date),
        specialist: parseText(object.specialist),
        diagnosisCodes: object.diagnosisCodes,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      }  
    default:
      return assertNever(type);
  }
};

const parseHealthCheckRating = (value: any): number => {
  if (!value || typeof value !== "number") {
    throw new Error("health check entry parameter incorrect");
  }
  return value;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const parseDate = (date: any): string => {
  if (!date || !isDate(date)) {
    throw new Error("date parameter is incorrect");
  }
  return date;
}

const isDate = (date: any): boolean => {
  console.log(date);
  console.log((Date.parse(date)));
  return Boolean(Date.parse(date));
}

const parseText = (text: any): string => {
  if (!text || !isString(text)) {
    throw new Error("one of string parameters is incorrect");
  }
  return text;
}

const parseType = (type: any): EntryType => {
  if (!type || !isValidType(type)) {
    throw new Error("one of string parameters is incorrect");
  }
  return type;
}

const isString = (text: any): text is string => {
  return typeof(text) === "string";
}

const isValidType = (type: any): type is EntryType => {
  return Object.values(EntryType).includes(type);
}

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("gender parameter is incorrect");
  }
  return gender;
}

const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
}