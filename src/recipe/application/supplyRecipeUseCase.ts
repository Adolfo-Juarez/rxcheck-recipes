import { RecipeStatus } from "../domain/model/Recipe";
import IllegalRepository from "../domain/repository/IllegalRepository";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";

export default class SupplyRecipeUseCase {
    constructor(
        readonly recipeMedicationRepository: RecipeMedicationRepository,
        readonly recipeRepository: RecipeRepository,
        readonly illegalRepository: IllegalRepository
    ) {}

    async run(medications_ids: number[], recipe_sign: string): Promise<boolean | null> {
        const recipe = await this.recipeRepository.checkRecipeExistsBySign(recipe_sign);

        if (!recipe) {
            console.log(`Recipe ${recipe_sign} not found`);
            return null;
        }

        if(recipe.status === RecipeStatus.SUPPLIED) {
            console.log(`Recipe ${recipe_sign} already supplied`);
            await this.illegalRepository.registerIncidences(medications_ids);
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

        await this.illegalRepository.registerIncidences(result);
        return null;
    }
}