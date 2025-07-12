import SaveRecipeRequest from "../domain/dto/saveRecipeRequest";
import Recipe from "../domain/model/Recipe";
import RecipeMedicationRepository from "../domain/repository/RecipeMedicationRespository";
import RecipeRepository from "../domain/repository/RecipeRepository";
import RecipePdfService from "./services/recipePdfService";
import StorageService from "./services/storageService";

export default class CreateRecipeUseCase {
  constructor(
    readonly recipeRepository: RecipeRepository,
    readonly recipeMedicationRepository: RecipeMedicationRepository,
    readonly storageService: StorageService,
    readonly pdfService: RecipePdfService
  ) {}

  async run(recipe: SaveRecipeRequest) {
    const receipeToSave: Omit<Recipe, "id"> = {
      patient_id: recipe.patient_id,
      doctor_id: recipe.doctor_id,
      issue_at: new Date(),
      expires_at: new Date(),
    };
    const newRecipe = await this.recipeRepository.save(receipeToSave);
    if (newRecipe === null) {
      return null;
    }
    await this.recipeMedicationRepository.bulkSaveMedicationsToRecipe(
      newRecipe?.id,
      recipe.medications
    );

    const html_pdf_string = await this.pdfService.generatePdf({
      recipe: {
        issue_at: "2025-07-08",
        expire_at: "2025-07-18",
        qr: "https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png",
      },
      patient: {
        name: "Jhon Doe",
        date: "1988-02-15",
        weight: 78,
        height: 178,
        address: "123 Main St, Anytown, USA",
        diagnostic: "Cancer",
      },
      practitioner: {
        name: "Dinna Doe",
        license: "123456789",
        area: "Vet",
        phone: "01-23456789",
        place: "Suchiapa",
      },
      medications:[
        {
          medication_name: "Ibuprofeno",
          medication_strength: "127 mg.",
          medication_form: "Supositorio",
          medication_dosis: "2 tabletas",
          medication_via: "Anal",
          medication_frecuency: "Cada 8 horas",
          medication_duration: "10 días",
          medication_instruction: "No meter la mano completa"
        },
        {
          medication_name: "Paracetamol",
          medication_strength: "500 mg.",
          medication_form: "Tableta",
          medication_dosis: "1 tabletas",
          medication_via: "Oral",
          medication_frecuency: "Cada 6 horas",
          medication_duration: "10 días",
          medication_instruction: "No ingerir con alcohol"
        },
        {
          medication_name: "Loratadina",
          medication_strength: "10 mg.",
          medication_form: "Tableta",
          medication_dosis: "1 tabletas",
          medication_via: "Oral",
          medication_frecuency: "Cada 12 horas",
          medication_duration: "10 días",
          medication_instruction: "No ingerir con alcohol"
        }
      ]
    });
    const presigned_uri = await this.storageService.saveFile(html_pdf_string);
    console.log(presigned_uri);

    return newRecipe?.id;
  }
}
