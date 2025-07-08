import Recipe from "../domain/model/Recipe";
import RecipeRepository from "../domain/repository/RecipeRepository";
import RecipeModel from "./schema/RecipeSchema";

export default class SequelizeRecipeRepository implements RecipeRepository {
  async save(recipe: Omit<Recipe, "id">): Promise<Recipe | null> {
    try {
      const result = await RecipeModel.create({
        patient_id: recipe.patient_id,
        doctor_id: recipe.doctor_id,
        issue_at: recipe.issue_at,
        expires_at: recipe.expires_at,
      });
      return result.toJSON() as Recipe;
    } catch (error: any) {
      return null;
    }
  }
  async getByPatientId(patient_id: string): Promise<Recipe[] | null> {
    try {
      const recipes = await RecipeModel.findAll({
        where: {
          patient_id: patient_id,
        },
      });
      return recipes.map((recipe) => recipe.toJSON() as Recipe);
    } catch (error: any) {
      return null;
    }
  }
  async getById(id: number): Promise<Recipe | null> {
    try {
      const recipe = await RecipeModel.findByPk(id);
      if (!recipe) {
        return null;
      }
      return recipe.toJSON() as Recipe;
    } catch (error: any) {
      return null;
    }
  }
}
