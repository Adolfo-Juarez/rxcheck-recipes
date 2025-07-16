import Recipe, { RecipeStatus } from "../model/Recipe";

export default interface RecipeRepository {
    save(recipe: Omit<Recipe, 'id'>): Promise<Recipe | null>
    getByPatientId(patient_id: string): Promise<Recipe[] | null>
    getById(id: number): Promise<Recipe | null>
    checkRecipeExistsById(code: string): Promise<Recipe | null>
    updateStatus(id: number, status: RecipeStatus): Promise<Recipe | null>
}