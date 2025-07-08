export default interface SaveRecipeRequest {
    patient_id: string;
    doctor_id: string;
    medications: number[];
}