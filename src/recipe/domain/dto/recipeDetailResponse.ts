import { MedicationResponse } from "../../application/services/internalRequestService";
import { RecipeStatus } from "../model/Recipe";

export default interface RecipeDetailResponse {
  id: number;
  status: RecipeStatus;
  patient_id: string;
  doctor_id: string;
  medications: MedicationResponse[];
  issue_at: Date;
  expires_at: Date;
}
