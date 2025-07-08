import RecipeMedication from "../domain/model/RecipeMedication";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeMedicationModel from "./schema/RecipeMedicationSchema";

export default class SequelizeRecipeMedicationRepository
  implements RecipeMedicationRepository
{
  async bulkSaveMedicationsToRecipe(
    recipe_id: number,
    medications_ids: number[]
  ): Promise<number | null> {
    try {
      const result = await RecipeMedicationModel.bulkCreate(
        medications_ids.map((id) => ({
          recipe_id,
          medication_id: id,
        }))
      );
      return result.length;
    } catch (error: any) {
      return null;
    }
  }
  async getByRecipeId(recipe_id: number): Promise<RecipeMedication[] | null> {
    try {
      const result = await RecipeMedicationModel.findAll({
        where: {
          recipe_id: recipe_id,
        },
      });
      return result.map((r) => r.toJSON() as RecipeMedication);
    } catch (error: any) {
      return null;
    }
  }
  async countMedicationsByRecipeId(recipe_id: number): Promise<number | null> {
    try {
      const result = await RecipeMedicationModel.count({
        where: {
          recipe_id: recipe_id,
        },
      });
      return result;
    } catch (error: any) {
      return null;
    }
  }
}
