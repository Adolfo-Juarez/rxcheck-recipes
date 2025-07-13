export interface PatientRequestInformation{
    id: string
    weight: number;
    height: number;
    diagnostic: string;
}

export interface MedicationRequestInformation{
    id: number,
    dosis: string,
    duration: string
    indication: string
}

export default interface CreateRecipeRequest {
    patient: PatientRequestInformation;
    medications: MedicationRequestInformation[];
}

export function validateSchema(object: any): CreateRecipeRequest | null {
  if (
    typeof object !== "object" || object === null ||
    typeof object.patient !== "object" || object.patient === null ||
    !Array.isArray(object.medications)
  ) {
    console.error("input is not object valid");
    return null;
  }

  const { patient } = object;
  const requiredPatientFields = [
    typeof patient.id === "string",
    typeof patient.weight === "number",
    typeof patient.height === "number",
    typeof patient.diagnostic === "string"
  ];

  if (requiredPatientFields.includes(false)) {
    console.error("some of this fields are not valid: id, weight, height, address, diagnostic" );
    return null;
  }

  for (const med of object.medications) {
    const validMedication =
      typeof med === "object" &&
      typeof med.id === "number" &&
      typeof med.dosis === "string" &&
      typeof med.duration === "string" &&
      typeof med.indication === "string";

    if (!validMedication) {
      console.error("some of this fields are not valid: id, dosis, duration, indication");
      return null;
    }
  }
  return object as CreateRecipeRequest;
}
