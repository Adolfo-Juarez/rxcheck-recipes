export interface MedicInformation{
    id: string;
    full_name: string;
    license: string;
    place?: string;
    phone?: string;
}

export interface PatientInformation{
    id: string;
    full_name: string;
    curp: string;
    weight: number;
    height: number;
    address: string;
    diagnostic: string;
}

export interface MedicationInformation{
    id:number
    name: string;
    strength: string;
    form: string;
    dosis: string;
    via: string;
    frecuency: string;
    duration: string;
    instruction: string;
}

export default interface SaveRecipeRequest {
    patient: PatientInformation;
    medic: MedicInformation;
    medications: MedicationInformation[];
}