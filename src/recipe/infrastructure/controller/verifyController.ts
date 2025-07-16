import GenericResponse from "../../../shared/dto/genericResponse";
import { VerifyUseCase } from "../../application/verifyUseCase";
import RecipeDetailResponse from "../../domain/dto/recipeDetailResponse";

export default class VerifyController {
    constructor(private verifyUseCase: VerifyUseCase) {}

    async run(req: any, res: any) {
        const { code } = req.params;
        const response:GenericResponse<RecipeDetailResponse> = {
            message: "Recipe scanned success",
            success: true
        }

        try {
            const exists = await this.verifyUseCase.run(code);
            if (exists) {
                response.data = exists
                res.status(200).json(response);
            } else {
                response.message = "This recipe does not exist or has already been scanned";
                response.success = false;
                res.status(404).json(response);
            }
        } catch (error) {
            console.error("Error verifying recipe:", error);
            response.message = "Error verifying recipe";
            response.success = false;
            res.status(500).json(response);
        }
    }
}