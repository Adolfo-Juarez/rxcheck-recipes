import { readFileSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import RecipePdfService from "../../application/services/recipePdfService";
import PdfRecipeServiceProps from "../../domain/dto/pdfRecipeServiceProps";
import QRCode from "qrcode";

export default class RecipePdfHelper implements RecipePdfService {
  
  private getPuppeteerConfig() {
    // Configuración para Docker con Alpine Linux - más estable
    return {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection',
        '--memory-pressure-off',
        '--max_old_space_size=4096'
      ],
      headless: true,
      timeout: 30000,
      protocolTimeout: 30000
    };
  }
  
  async generateQrCode(data: string): Promise<ArrayBufferLike> {
    try {
      console.log("🔍 Generando QR code con datos:", data);
      // Genera el QR como un buffer de imagen PNG
      const buffer = await QRCode.toBuffer(data, {
        type: "png",
        errorCorrectionLevel: "high",
        margin: 1,
        width: 300,
      });

      return buffer.buffer; // Convertir a ArrayBufferLike
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }

  async generatePdf(data: PdfRecipeServiceProps): Promise<ArrayBufferLike> {
    let browser;
    try {
      console.log(`Medic license A: ${data.practitioner.license}`);
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
      
      const html = template(templateData);

      // Usar la configuración específica para Docker
      console.log("🚀 Iniciando Puppeteer...");
      browser = await puppeteer.launch(this.getPuppeteerConfig());
      
      console.log("📄 Creando nueva página...");
      const page = await browser.newPage();

      // Configurar timeouts y límites de memoria
      await page.setDefaultTimeout(30000);
      await page.setDefaultNavigationTimeout(30000);

      console.log("🔧 Configurando contenido HTML...");
      await page.setContent(html, { 
        waitUntil: "networkidle0",
        timeout: 30000
      });

      console.log("📋 Generando PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        timeout: 30000
      });

      console.log("✅ PDF generado exitosamente");
      return pdfBuffer;
    } catch (error: any) {
      console.error("❌ Error al generar PDF:", error.message);
      console.error("Stack trace:", error.stack);
      throw new Error("Error al generar PDF");
    } finally {
      if (browser) {
        console.log("🔒 Cerrando browser...");
        try {
          await browser.close();
        } catch (closeError) {
          console.error("Error al cerrar browser:", closeError);
        }
      }
    }
  }
}