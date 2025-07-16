export enum RecipeStatus {
    PENDING = "pending",
    PARTIALLY_SUPPLIED = "partially_supplied",
    SUPPLIED = "supplied"
}

export default interface Recipe {
    id: number;
    patient_id: string;
    doctor_id: string;
    issue_at: Date;
    expires_at: Date;
    qr_path: string;
    pdf_path: string;
    signature: string;
    status: RecipeStatus;
}

