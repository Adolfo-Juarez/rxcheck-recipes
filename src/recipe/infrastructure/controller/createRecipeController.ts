import GenericResponse from "../../../shared/dto/genericResponse";
import CreateRecipeUseCase from "../../application/createRecipeUseCase";
import { Request, Response } from "express";
import SaveRecipeResponse from "../../domain/dto/saveRecipeResponse";

export default class CreateRecipeController {
  constructor(readonly createRecipeUseCase: CreateRecipeUseCase) {}

  async run(req: Request, res: Response) {
    const { patient_id, medications } = req.body;
    const doctor_id = "TEST_DOCTOR";
    const response: GenericResponse<SaveRecipeResponse | null> = {
      message: "",
      success: false,
    };

    const result = await this.createRecipeUseCase.run({
      patient_id,
      doctor_id,
      medications,
    });

    if (!result) {
      response.message = "Error creating recipe";
      return res.status(400).json(response);
    }

    response.message = "Recipe created successfully";
    response.success = true;
    response.data = { recipe_id: result };

    return res.status(200).json(response);
  }
}
