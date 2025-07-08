import RecipeDetailResponse from "../domain/dto/recipeDetailResponse";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import GetMedicationListByIdService from "./services/getMedicationListByIdService";

export default class GetRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository,
    readonly getMedicationListByIdHelper: GetMedicationListByIdService
  ) {}
  
  async run(id: number): Promise<RecipeDetailResponse | null> {
    const recipe = await this.recipeRepository.getById(id);
    
    if (!recipe) {
      return null;
    }

    const recipeMedication = await this.recipeMedicationRepository.getByRecipeId(recipe.id)
    if(!recipeMedication){
        return null
    }

    const medications = await this.getMedicationListByIdHelper.getMedicationListById(recipeMedication.map(e => e.id));

    if (!medications) {
      return null;
    }

    return {
      id: recipe.id,
      patient_id: recipe.patient_id,
      doctor_id: recipe.doctor_id,
      medications: medications.data ? medications.data : [],
      issue_at: recipe.issue_at,
      expires_at: recipe.expires_at,
    } as RecipeDetailResponse;
  }
}
  