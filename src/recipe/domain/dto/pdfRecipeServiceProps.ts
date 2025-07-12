export interface PatientInformationProp {
  name: string;
  date: string;
  weight: number;
  height: number;
  address: string;
  diagnostic: string;
}

export interface PractitionerInformationProp {
  name: string;
  license: string;
  area: string;
  phone: string;
  place: string;
}

export interface RecipeInformationProp {
  issue_at: string;
  expire_at: string;
  qr: string;
}

export interface MedicationInformationProps {
  medication_name: string;
  medication_strength: string;
  medication_form: string;
  medication_dosis: string;
  medication_via: string;
  medication_frecuency: string;
  medication_duration: string;
  medication_instruction: string;
}

export default interface PdfRecipeServiceProps {
  recipe: RecipeInformationProp;
  patient: PatientInformationProp;
  practitioner: PractitionerInformationProp;
  medications: MedicationInformationProps[];
}
