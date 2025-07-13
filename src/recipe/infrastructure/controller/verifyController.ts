import { VerifyUseCase } from "../../application/verifyUseCase";

export default class VerifyController {
    constructor(private verifyUseCase: VerifyUseCase) {}

    async run(req: any, res: any): Promise<void> {
        const { code } = req.params;

        try {
            const exists = await this.verifyUseCase.run(code);
            if (exists) {
                res.status(200).json({ message: "Recipe scanned successfully" });
            } else {
                res.status(404).json({ message: "This recipe does not exist or has already been scanned" });
            }
        } catch (error) {
            console.error("Error verifying recipe:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}