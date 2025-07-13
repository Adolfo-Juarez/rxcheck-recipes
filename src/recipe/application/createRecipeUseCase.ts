import SaveRecipeRequest from "../domain/dto/saveRecipeRequest";
import Recipe from "../domain/model/Recipe";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import ExternalRequestHelper from "../infrastructure/helpers/externalRequestHelper";
import RecipePdfService from "./services/recipePdfService";
import StorageService from "./services/storageService";
import crypto from "crypto";

export default class CreateRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository,
    readonly storageService: StorageService,
    readonly pdfService: RecipePdfService,
    readonly externalRequestService: ExternalRequestHelper
  ) {}

  async run(recipe: SaveRecipeRequest) {
    console.log(`Medic license B: ${recipe.medic.license}`);

    const medicInformation =
      await this.externalRequestService.getMedicInformationByProfessionalLicense(
        recipe.medic.license
      );

    console.log(`Medic license C: ${recipe.medic.license}`);

    if (!medicInformation) {
      return null;
    }

    const super_secret_signature = crypto.randomUUID();

    const qrCode = await this.pdfService.generateQrCode(super_secret_signature);
    const qrCodePath = await this.storageService.saveFile(qrCode, "qr");

    const html_pdf_string = await this.pdfService.generatePdf({
      recipe: {
        issue_at: "2025-07-08",
        expire_at: "2025-07-18",
        qr: qrCodePath.signed_url,
      },
      patient: {
        name: recipe.patient.full_name,
        date: this.getBirthDateFromCurp(recipe.patient.curp),
        weight: recipe.patient.weight,
        height: recipe.patient.height,
        address: recipe.patient.address ?? "-",
        diagnostic: recipe.patient.diagnostic ?? "-",
      },
      practitioner: {
        name: recipe.medic.full_name,
        license: recipe.medic.license,
        area: medicInformation.titulo,
        phone: recipe.medic.phone ?? "-",
        place: recipe.medic.place ?? "-",
      },
      medications: recipe.medications.map((med) => ({
        medication_dosis: med.dosis,
        medication_name: med.name,
        medication_strength: med.strength,
        medication_form: med.form,
        medication_via: med.via,
        medication_frecuency: med.frecuency,
        medication_duration: med.duration,
        medication_instruction: med.instruction,
      })),
    });
    const presigned_uri = await this.storageService.saveFile(html_pdf_string, "recipe");

    const receipeToSave: Omit<Recipe, "id"> = {
      patient_id: recipe.patient.id,
      doctor_id: recipe.medic.id,
      issue_at: new Date(),
      expires_at: new Date(),
      qr_path: qrCodePath.file_location,
      pdf_path: presigned_uri.file_location,
      signature: super_secret_signature,
      is_valid: true
    };

    console.log(presigned_uri)

    const newRecipe = await this.recipeRepository.save(receipeToSave);
    if (newRecipe === null) {
      return null;
    }

    await this.recipeMedicationRepository.bulkSaveMedicationsToRecipe(
      newRecipe?.id,
      recipe.medications.map((med) => med.id)
    );

    return {
      recipe_id: newRecipe.id,
      qr_path: qrCodePath.signed_url,
      pdf_path: presigned_uri.signed_url,
    };
  }

  private getBirthDateFromCurp(curp: string): string {
    if (!curp || curp.length < 10) return "";

    const yearPart = curp.substring(4, 6); // "03"
    const month = curp.substring(6, 8); // "04"
    const day = curp.substring(8, 10); // "26"

    // Determinar el siglo: si el año es mayor a 30, asumimos 1900s, si no 2000s
    const year = parseInt(yearPart, 10);
    const fullYear = year >= 30 ? 1900 + year : 2000 + year;

    return `${fullYear}-${month}-${day}`;
  }
}
