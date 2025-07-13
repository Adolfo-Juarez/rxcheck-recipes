import GenericResponse from "../../../shared/dto/genericResponse";
import ListPatientRecipeUseCase from "../../application/listPatientRecipeUseCase";
import { Response } from "express";
import RecipeOverviewResponse from "../../domain/dto/recipeOverviewResponse";
import { AuthenticatedRequest } from "../../../shared/middleware/AuthMiddleware";

export default class ListPatientRecipeController {
  constructor(readonly listPatientRecipeUseCase: ListPatientRecipeUseCase) {}

  async run(req: AuthenticatedRequest, res: Response) {
    const response: GenericResponse<RecipeOverviewResponse[] | null> = {
      message: "",
      success: false,
    };

    const patient_id = req.user?.id ?? "";
    const result = await this.listPatientRecipeUseCase.run(patient_id);

    if (!result) {
      response.message = "Error getting recipes";
      return res.status(400).json(response);
    }

    response.message = "Recipes retrieved successfully";
    response.success = true;
    response.data = result;
    return res.status(200).json(response);
  }
}
