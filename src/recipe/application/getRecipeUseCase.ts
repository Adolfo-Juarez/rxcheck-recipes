import RecipeDetailResponse from "../domain/dto/recipeDetailResponse";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import InternalRequestService from "./services/internalRequestService";
import StorageService from "./services/storageService";

export default class GetRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository,
    readonly getMedicationListByIdHelper: InternalRequestService,
    readonly storageService: StorageService
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

    const medications = await this.getMedicationListByIdHelper.getMedicationListById(recipeMedication.map(e => e.medication_id));

    if (!medications) {
      return null;
    }

    return {
      id: recipe.id,
      status: recipe.status,
      patient_id: recipe.patient_id,
      doctor_id: recipe.doctor_id,
      medications: medications.data ? medications.data.map((e,i,a) =>({...e, supplied: recipeMedication.find(k => k.medication_id == e.id)?.supplied})) : [],
      issue_at: recipe.issue_at,
      expires_at: recipe.expires_at,
      qr_image: (await this.storageService.getFile(recipe.qr_path)).signed_url,
      pdf_image: (await this.storageService.getFile(recipe.pdf_path)).signed_url,
    } as RecipeDetailResponse;
  }
}
  