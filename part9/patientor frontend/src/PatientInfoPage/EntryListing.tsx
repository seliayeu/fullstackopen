import React from "react";
import { Header } from "semantic-ui-react";
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { CodedDiagnoses } from "./index";

type EntryProp = {
  entry: Entry,
  codedDiagnoses: CodedDiagnoses
}

type HospitalEntryProp = {
  entry: HospitalEntry,
  codedDiagnoses: CodedDiagnoses
}

type OccupationalHealthcareEntryProp = {
  entry: OccupationalHealthcareEntry,
  codedDiagnoses: CodedDiagnoses
}

type HealthCheckEntryProp = {
  entry: HealthCheckEntry,
  codedDiagnoses: CodedDiagnoses
}

const EntryListing: React.FC<EntryProp> = ({ entry, codedDiagnoses }) => {
  const assertNever = (value: never) => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  }
  switch (entry.type) {
    case "HealthCheck":
      return (<HealthCheckEntryListing entry={entry} codedDiagnoses={codedDiagnoses} />)
    case "Hospital":
      return (<HospitalEntryListing entry={entry} codedDiagnoses={codedDiagnoses} />)
    case "OccupationalHealthcare":
      return (<OccupationalHealthcareEntryListing entry={entry} codedDiagnoses={codedDiagnoses} />)
    default:
      return assertNever(entry);
  }
}

const HealthCheckEntryListing: React.FC<HealthCheckEntryProp> = ({ entry, codedDiagnoses }) => {
  return (
    <div>
      <Header as="h4">health check entry</Header>
      <p> description : {entry.description}</p>
      <p> date : {entry.date}</p> 
      <p> health check rating level : {entry.healthCheckRating}</p>
      <ul>
        {
          entry.diagnosisCodes?.map((code) => {
            return <li key={`${entry.id}-${code}`}>{code} <i>{codedDiagnoses[code].name}</i></li>
          })
        }
      </ul>
    </div>
  )
}

const HospitalEntryListing: React.FC<HospitalEntryProp> = ({ entry, codedDiagnoses }) => {
  return (
    <div>
      <Header as="h4">hospital entry</Header>
      <p> description : {entry.description}</p>
      <p> date : {entry.date}</p>
      <p> discharge date: {entry.discharge.date}</p>
      <p> discharge criteria: {entry.discharge.criteria}</p>
      <ul>
        {
          entry.diagnosisCodes?.map((code) => {
            return <li key={`${entry.id}-${code}`}>{code} <i>{codedDiagnoses[code].name}</i></li>
          })
        }
      </ul>      
    </div> 
  ) 
}

const OccupationalHealthcareEntryListing: React.FC<OccupationalHealthcareEntryProp> = ({entry, codedDiagnoses}) => {
  return (
    <div>
      <Header as="h4">occupational healthcare entry</Header>
      <p> description : {entry.description}</p>
      <p> date : {entry.date}</p>
      <p> employer name: {entry.employerName}</p>
      { entry.sickLeave && 
        <div>
          <p> sick leave start: {entry.sickLeave.startDate}</p>
          <p> sick leave end: {entry.sickLeave.endDate}</p>
        </div>
      }
      <ul>
        {
          entry.diagnosisCodes?.map((code) => {
            return <li key={`${entry.id}-${code}`}>{code} <i>{codedDiagnoses[code].name}</i></li>
          })
        }
      </ul>      
    </div>
  )
}

export default EntryListing;