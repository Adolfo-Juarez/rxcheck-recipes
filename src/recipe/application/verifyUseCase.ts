import RecipeRepository from "../domain/repository/RecipeRepository";

export class VerifyUseCase {
    constructor(readonly repository: RecipeRepository) {}
    async run(code: string): Promise<boolean> {
        return await this.repository.checkRecipeExistsById(code);
    }
}