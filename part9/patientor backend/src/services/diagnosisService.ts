import diagnosisData from "../../data/diagnoses.json";
import { Diagnosis } from "../types";

const diagnoses: Array<Diagnosis> = diagnosisData;

const getDiagonses = (): Array<Diagnosis> => diagnoses;


export default { getDiagonses };