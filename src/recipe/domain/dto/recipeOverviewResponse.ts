import { RecipeStatus } from "../model/Recipe";

export default interface RecipeOverviewResponse {
  id: number;
  medication_count: number;
  status: RecipeStatus;
  issue_at: Date;
  expires_at: Date;
}