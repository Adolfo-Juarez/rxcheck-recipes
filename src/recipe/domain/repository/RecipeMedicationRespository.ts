import RecipeMedication from "../model/RecipeMedication";

export default interface RecipeMedicationRepository {
    bulkSaveMedicationsToRecipe(recipe_id: number, medications_ids: number[]): Promise<number| null>
    getByRecipeId(recipe_id: number): Promise<RecipeMedication[] | null>
    countMedicationsByRecipeId(recipe_id: number): Promise<number | null>
    updateSupplied(ids: number[], recipe_id: string): Promise<boolean | number[]>
}
