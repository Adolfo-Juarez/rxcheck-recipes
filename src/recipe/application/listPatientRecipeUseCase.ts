import RecipeOverviewResponse from "../domain/dto/recipeOverviewResponse";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import InternalRequestService from "./services/internalRequestService";

export default class ListPatientRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository,
    readonly getMedicationListByIdHelper: InternalRequestService
  ) {}

  async run(patient_id: string): Promise<RecipeOverviewResponse[] | null> {
    const recipes = await this.recipeRepository.getByPatientId(patient_id);

    if (!recipes) {
      return null;
    }

    const recipeOverview = await Promise.all(recipes.map(async r => {
        return {
            id: r.id,
            expires_at: r.expires_at,
            status: r.status,
            issue_at: r.issue_at,
            medication_count: await this.recipeMedicationRepository.countMedicationsByRecipeId(r.id),
        } as RecipeOverviewResponse;
    }));

    return recipeOverview;
  }
}
