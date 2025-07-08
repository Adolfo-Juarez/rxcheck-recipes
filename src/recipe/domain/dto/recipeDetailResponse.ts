import { MedicationResponse } from "../../application/services/getMedicationListByIdService";

export default interface RecipeDetailResponse {
  id: number;
  patient_id: string;
  doctor_id: string;
  medications: MedicationResponse[];
  issue_at: Date;
  expires_at: Date;
}
