import SaveRecipeRequest from "../domain/dto/saveRecipeRequest";
import Recipe from "../domain/model/Recipe";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";

export default class CreateRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository
  ) {}

  async run(recipe: SaveRecipeRequest) {
    const receipeToSave: Omit<Recipe, "id"> = {
      patient_id: recipe.patient_id,
      doctor_id: recipe.doctor_id,
      issue_at: new Date(),
      expires_at: new Date(),
    };
    const newRecipe = await this.recipeRepository.save(receipeToSave);
    if (newRecipe === null) {
      return null;
    }
    const savedMedication =
      await this.recipeMedicationRepository.bulkSaveMedicationsToRecipe(
        newRecipe?.id,
        recipe.medications
      );
    return newRecipe?.id;
  }
}
