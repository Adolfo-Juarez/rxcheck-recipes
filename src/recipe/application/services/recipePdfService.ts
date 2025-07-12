import PdfRecipeServiceProps from "../../domain/dto/pdfRecipeServiceProps";

export default interface RecipePdfService {
  generatePdf(data: PdfRecipeServiceProps): Promise<ArrayBufferLike>;
}