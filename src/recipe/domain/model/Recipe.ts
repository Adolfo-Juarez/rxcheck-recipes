export default interface Recipe {
    id: number;
    patient_id: string;
    doctor_id: string;
    issue_at: Date;
    expires_at: Date;
}

