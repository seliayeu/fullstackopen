import React, { CSSProperties, useState } from "react";
import axios from "axios";
import { Patient, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import {  Header, Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { addDetailedPatient, addEntry, setDiagnoses } from "../state/reducer"
import EntryListing from "./EntryListing"
import AddEntryForm, { EntryFormValues } from "./AddEntryForm";

type PatientInfoParams = {
  id: string;
}

export type CodedDiagnoses = {
  [index: string]: Omit<Diagnosis, "code">;
}

const PatientInfoPage: React.FC = () => {
  const [state, dispatch] = useStateValue();
  const { id } = useParams<PatientInfoParams>()
  const [ codedDiagnoses, setCodedDiagnoses] = useState<CodedDiagnoses>({});

  const submitNewPatient = async (values: EntryFormValues) => {
    try {
      console.log(values)
      const { data: entry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        {...values, type: "HealthCheck"}
      );
      dispatch(addEntry({ entry, id }));
    } catch (e) {
      console.error(e.response.data);
    }
  };

  React.useEffect(() => {
    if (!Object.keys(state.detailedPatients).includes(id)) {
      const fetchOnePatient = async () => {
        try {
          const { data: patientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(addDetailedPatient(patientFromApi));
        } catch (e) {
          console.error(e);
        }
      };
      fetchOnePatient();
    }
    console.log(state.detailedPatients)
  }, []); // eslint-disable-line
  
  React.useEffect(() => {
    console.log(state)
    if(state["diagnoses"].length === 0) {
      console.log("state diagnoses is 0")
      const fetchDiagnoses = async () => {
        try {
          const { data: diagnoses } = await axios.get<Diagnosis[]>(
            `${apiBaseUrl}/diagnoses`
          )
          console.log(diagnoses)
          
          let tempDiagnoses = {};

          diagnoses.forEach((diagnosis: Diagnosis) => {
            tempDiagnoses = {...tempDiagnoses, [diagnosis.code]: {name: diagnosis.name, latin: diagnosis.latin}}
          })

          setCodedDiagnoses({...tempDiagnoses});

          dispatch(setDiagnoses(diagnoses));
        } catch (e) {
          console.error(e);
        }
      };
      fetchDiagnoses();
    } else {
      let tempDiagnoses = {};

      state.diagnoses.forEach((diagnosis: Diagnosis) => {
        tempDiagnoses = {...tempDiagnoses, [diagnosis.code]: {name: diagnosis.name, latin: diagnosis.latin}}
      })

      setCodedDiagnoses({...tempDiagnoses});
      console.log(codedDiagnoses)
    }
    console.log(codedDiagnoses)
  }, []); // eslint-disable-line

  if (!Object.keys(state.detailedPatients).includes(id) || (Object.keys(codedDiagnoses).length === 0)) {
    console.log(state)
    console.log(codedDiagnoses);
    return (
      <h3>Loading...</h3>
    )
  }
  
  const style: CSSProperties = { display: "flex", flexDirection: "row" };

  console.log(codedDiagnoses)
  return (
    <div>
      <div style={style}>
        <Header as="h2">{state.detailedPatients[id].name}</Header>
        {state.detailedPatients[id].gender === "male" &&
          <Icon name="mars" size="big" />
        }
        {state.detailedPatients[id].gender === "female" &&
          <Icon name="venus" size="big" />
        }
        {state.detailedPatients[id].gender === "other" &&
          <Icon name="genderless" size="big" />
        }
      </div>
      <div>ssn: {state.detailedPatients[id].ssn}</div>
      <div>occupation: {state.detailedPatients[id].occupation}</div>
      <Header as="h3">add health check entry</Header>
      <AddEntryForm onSubmit={submitNewPatient} />
      <Header as="h3">entries</Header>
      {state.detailedPatients[id].entries?.map((entry) => {
        return (
          <EntryListing entry={entry} codedDiagnoses={codedDiagnoses} key={entry.id} />
        )
      })}
    </div>
  )

};

export default PatientInfoPage;