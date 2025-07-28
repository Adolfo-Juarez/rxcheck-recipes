import RecipeMedication from "../domain/model/RecipeMedication";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeMedicationModel from "./schema/RecipeMedicationSchema";

export default class SequelizeRecipeMedicationRepository
  implements RecipeMedicationRepository
{
  async updateSupplied(
    ids: number[],
    recipe_id: string
  ): Promise<boolean | number[]> {
    try {
      
      const medicationsAvailable = await RecipeMedicationModel.findAll({
        where: { recipe_id: recipe_id, supplied: false },
      });
      

      if (medicationsAvailable.length !== ids.length) {
        console.log(`The amount of medications available is not the same as the amount of medications to be supplied:\n > Medications available: [${medicationsAvailable.map((m)=> m.medication_id).join(", ")}] \n > Medications to be supplied: [${ids.join(", ")}]`);
        return medicationsAvailable.filter((m)=> !ids.includes(m.medication_id)).map((m)=> m.medication_id);
      }

      // Actualizar todos los registros de una sola vez
      await RecipeMedicationModel.update(
        { supplied: true, supplied_at: new Date() },
        {
          where: {
            medication_id: ids,
            recipe_id: recipe_id,
            supplied: false
          }
        }
      );

      const isRecipeCompletlySupplied = await RecipeMedicationModel.findAll({
        where: { recipe_id: recipe_id },
      });

      return isRecipeCompletlySupplied.every((m) => m.supplied === true);
    } catch (error: any) {
      console.log("Error updating recipe medications: ", error);
      return [];
    }
  }
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
