import { RecipeStatus } from "../domain/model/Recipe";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";

export default class SupplyRecipeUseCase {
    constructor(
        readonly recipeMedicationRepository: RecipeMedicationRepository,
        readonly recipeRepository: RecipeRepository,
    ) {}

    async run(medications_ids: number[], recipe_sign: string): Promise<boolean | null> {
        const recipe = await this.recipeRepository.checkRecipeExistsBySign(recipe_sign);
        console.log("A")
        if (!recipe) {
            console.log(`Recipe ${recipe_sign} not found`);
            return null;
        }

        const result = await this.recipeMedicationRepository.updateSupplied(medications_ids, recipe.id.toString());

        if(typeof result === 'boolean' && result === false) {
            console.log(`Recipe ${recipe_sign} partially supplied`);
            await this.recipeRepository.updateStatus(recipe.id, RecipeStatus.PARTIALLY_SUPPLIED);
            return result;
        }
        if(typeof result === 'boolean' && result === true){
            console.log(`Recipe ${recipe_sign} fully supplied`);
            await this.recipeRepository.updateStatus(recipe.id, RecipeStatus.SUPPLIED);
            return result;
        }

        return null;
    }
}