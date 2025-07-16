import { MedicationResponse } from "../../application/services/internalRequestService";
import { RecipeStatus } from "../model/Recipe";

export interface MedicationStatefulResponse extends MedicationResponse {
  status: RecipeStatus;
}

export default interface RecipeDetailResponse {
  id: number;
  status: RecipeStatus;
  patient_id: string;
  doctor_id: string;
  medications: MedicationStatefulResponse[];
  issue_at: Date;
  expires_at: Date;
}
