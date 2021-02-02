import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_DETAILED_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSES";
      payload: Array<Diagnosis>
    }
  | {
      type: "ADD_ENTRY";
      payload: {entry: Entry, id: string};
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSES":
      return {
        ...state,
        diagnoses: action.payload
      };
    case "ADD_ENTRY":
      return {
        ...state,
        detailedPatients: {
          [action.payload.id]: { ...state.detailedPatients[action.payload.id], entries: state.detailedPatients[action.payload.id].entries?.concat(action.payload.entry) }
        } 
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_DETAILED_PATIENT":
      console.log(action.payload)
      return {
        ...state,
        detailedPatients: {
          ...state.detailedPatients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};

export const addDetailedPatient = (payload: Patient): Action => {
  const action:Action = {type: "ADD_DETAILED_PATIENT", payload}
  return action;
}

export const setPatientList = (payload: Patient[]): Action => {
  const action: Action = {type: "SET_PATIENT_LIST", payload}
  return action;
}

export const setDiagnoses = (payload: Diagnosis[]): Action => {
  const action: Action = {type: "SET_DIAGNOSES", payload}
  return action;
}


export const addPatient = (payload: Patient): Action => {
  const action: Action = {type: "ADD_PATIENT", payload}
  return action;
}
export const addEntry = (payload: { entry: Entry, id: string}): Action => {
  const action: Action = { type: "ADD_ENTRY", payload}
  return action;
}