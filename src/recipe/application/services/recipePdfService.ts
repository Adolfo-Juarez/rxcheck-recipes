import PdfRecipeServiceProps from "../../domain/dto/pdfRecipeServiceProps";

export default interface RecipePdfService {
  generatePdf(data: PdfRecipeServiceProps): Promise<ArrayBufferLike>;
  generateQrCode(data: string): Promise<ArrayBufferLike>;
}