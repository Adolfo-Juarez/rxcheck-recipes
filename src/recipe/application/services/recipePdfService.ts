import PdfRecipeServiceProps from "../../domain/dto/pdfRecipeServiceProps";

export default interface RecipePdfService {
  generateQrCode(data: string): Promise<string>;
  generatePdf(data: PdfRecipeServiceProps): Promise<ArrayBufferLike> ;
}