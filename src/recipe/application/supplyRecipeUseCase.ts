import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";

export default class SupplyRecipeUseCase {
    constructor(
        readonly recipeMedicationRepository: RecipeMedicationRepository,
        readonly recipeRepository: RecipeRepository,
    ) {}

    async run(medications_ids: number[], recipe_id: string): Promise<boolean | null> {
        const recipe = await this.recipeRepository.checkRecipeExistsById(recipe_id);
        if (!recipe) {
            return null;
        }
        return this.recipeMedicationRepository.updateSupplied(medications_ids, recipe.id.toString());
    }
}