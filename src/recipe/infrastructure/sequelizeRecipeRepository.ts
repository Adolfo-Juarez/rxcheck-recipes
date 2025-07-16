import { Op } from "sequelize";
import Recipe, { RecipeStatus } from "../domain/model/Recipe";
import RecipeRepository from "../domain/repository/RecipeRepository";
import RecipeModel from "./schema/RecipeSchema";

export default class SequelizeRecipeRepository implements RecipeRepository {
  async updateStatus(id: number, status: RecipeStatus): Promise<Recipe | null> {
    try {
      const recipe = await RecipeModel.findByPk(id);
      if (!recipe) {
        console.log(`Recipe ${id} not found. Unable to Update`)
        return null;
      }
      recipe.status = status;
      await recipe.save();
      return recipe;
    } catch (error: any) {
      console.log("Error updating recipe status:", error);
      return null;
    }
  }
  async checkRecipeExistsBySign(code: string): Promise<Recipe | null> {
    try {
      const recipe = await RecipeModel.findOne({
        where: {
          signature: code,
          status: { [Op.ne]: RecipeStatus.SUPPLIED },
        },
      });

      return recipe;
    } catch (error: any) {
      console.log("Error checking recipe by ID:", error);
      return null;
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
