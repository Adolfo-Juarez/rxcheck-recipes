import GenericResponse from "../../../shared/dto/genericResponse";
import GetRecipeUseCase from "../../application/getRecipeUseCase";
import { Request, Response } from "express";
import RecipeDetailResponse from "../../domain/dto/recipeDetailResponse";

export default class GetRecipeController {
  constructor(readonly getRecipeUseCase: GetRecipeUseCase) {}

  async run(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.getRecipeUseCase.run(Number(id));
    const response: GenericResponse<RecipeDetailResponse | null> = {
      message: "",
      success: false,
    };

    if (!result) {
      response.message = "Error getting recipe";
      return res.status(400).json(response);
    }

    response.message = "Recipe retrieved successfully";
    response.success = true;
    response.data = result;

    return res.status(200).json(response);
  }
}
