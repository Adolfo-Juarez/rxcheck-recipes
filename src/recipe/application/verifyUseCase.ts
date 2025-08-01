import RecipeDetailResponse from "../domain/dto/recipeDetailResponse";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import InternalRequestService from "./services/internalRequestService";

export class VerifyUseCase {
  constructor(
    readonly repository: RecipeRepository,
    readonly medicationRepository: RecipeMedicationRepository,
    readonly internalRequestService: InternalRequestService
  ) {}
  async run(code: string): Promise<RecipeDetailResponse | null> {
    const result = await this.repository.checkRecipeExistsBySign(code);
    if (result) {
      const medications = await this.medicationRepository.getByRecipeId(
        result.id
      );

      if (!medications) {
        return null;
      }

      const medications_details =
        await this.internalRequestService.getMedicationListById(
          medications.map((e) => e.medication_id)
        );

      if (!medications_details) {
        return null;
      }

      return {
        id: result.id,
        status: result.status,
        patient_id: result.patient_id,
        doctor_id: result.doctor_id,
        medications: medications_details.data
          ? medications_details.data.map((e, i, a) => ({
              ...e,
              supplied:
                medications.find((k) => k.medication_id == e.id)?.supplied ??
                false,
            }))
          : [],
        issue_at: result.issue_at,
        expires_at: result.expires_at,
      };
    }
    return null;
  }
}
