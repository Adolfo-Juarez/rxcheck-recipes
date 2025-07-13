import Recipe from "../domain/model/Recipe";
import RecipeRepository from "../domain/repository/RecipeRepository";
import RecipeModel from "./schema/RecipeSchema";

export default class SequelizeRecipeRepository implements RecipeRepository {
  async checkRecipeExistsById(code: string): Promise<boolean> {
    try {
      const recipe = await RecipeModel.findOne({
        where: {
          signature: code,
          is_valid: true,
        },
      });

      if (recipe) {
        recipe.is_valid = false;
        await recipe.save();
        return true;
      }

      return false;
    } catch (error: any) {
      return false;
    }
  }

  async save(recipe: Omit<Recipe, "id">): Promise<Recipe | null> {
    try {
      const result = await RecipeModel.create(recipe);
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
