export default interface RecipeMedication {
    id: number;
    recipe_id: number;
    medication_id: number;
    supplied: boolean;
    supplied_at: Date;
}