import { readFileSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import RecipePdfService from "../../application/services/recipePdfService";
import PdfRecipeServiceProps from "../../domain/dto/pdfRecipeServiceProps";

export default class RecipePdfHelper implements RecipePdfService {
  async generatePdf(data: PdfRecipeServiceProps): Promise<ArrayBufferLike> {
    try {
      const htmlPath = path.join(
        __dirname,
        "..",
        "..",
        "assets",
        "templates",
        "patient_recipe.pdf.html"
      );

      const htmlSource = readFileSync(htmlPath, "utf8");
      
      Handlebars.registerHelper("inc", function (value: any) {
        return parseInt(value) + 1;
      });

      // Compilar el template con Handlebars
      const template = Handlebars.compile(htmlSource);
      
      // Mapear los datos de PdfRecipeServiceProps a las variables del template
      const templateData = {
        // Datos del médico
        practitioner_name: data.practitioner.name,
        practitioner_license: data.practitioner.license,
        practitioner_area: data.practitioner.area,
        practitioner_phone: data.practitioner.phone,
        practitioner_place: data.practitioner.place,
        
        // Datos de la receta
        issue_at: data.recipe.issue_at,
        expire_at: data.recipe.expire_at,
        qr_validatio_image: data.recipe.qr,
        
        // Datos del paciente
        patient_name: data.patient.name,
        patient_birthdate: data.patient.date,
        patient_weight: data.patient.weight,
        patient_height: data.patient.height,
        patient_address: data.patient.address,
        patient_diagnostic: data.patient.diagnostic,
        medications: data.medications
      };
      
      const html = template(templateData); // Aquí pasas los datos mapeados al template

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      return pdfBuffer;
    } catch (error: any) {
      console.error("❌ Error al generar PDF:", error.message);
      throw new Error("Error al generar PDF");
    }
  }
}
