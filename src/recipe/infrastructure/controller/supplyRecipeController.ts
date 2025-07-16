import { Response } from "express";
import GenericResponse from "../../../shared/dto/genericResponse";
import { AuthenticatedRequest } from "../../../shared/middleware/AuthMiddleware";
import SupplyRecipeUseCase from "../../application/supplyRecipeUseCase";
import SupplyRecipeResponse from "../../domain/dto/supplyRecipeResponse";

export default class SupplyRecipeController {
    constructor(
        readonly supplyRecipeUseCase: SupplyRecipeUseCase
    ) {}

    async run(req: AuthenticatedRequest, res: Response) {
        const { medications } = req.body;
        const recipe_id = req.params.recipe_id;

        if(!Array.isArray(medications) || typeof recipe_id !== 'string') {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const response: GenericResponse<SupplyRecipeResponse> = {
            message: "Recipe supplied successfully",
            success: true
        };

        try {
            const result = await this.supplyRecipeUseCase.run(medications, recipe_id);
            if (result !== null) {
                response.data = {
                    is_recipe_completed: result
                };
                res.status(200).json(response);
            } else {
                response.message = "Failed to supply recipe";
                response.success = false;
                res.status(500).json(response);
            }
        } catch (error) {
            console.error("Error supplying recipe:", error);
            response.message = "Error supplying recipe";
            response.success = false;
            res.status(500).json(response);
        }
    }
}