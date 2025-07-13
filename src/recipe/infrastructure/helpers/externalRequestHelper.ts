import ExternalRequestService, {
  MedicInformationResponse,
} from "../../application/services/externalRequestService";
import { TextDecoder } from "util";

export default class ExternalRequestHelper implements ExternalRequestService {
  async getMedicInformationByProfessionalLicense(
    professionalLicense: string
  ): Promise<MedicInformationResponse | null> {
    try {
      const headers = new Headers();
      headers.append(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0"
      );
      headers.append("Accept", "*/*");
      headers.append("Accept-Language", "en-US,en;q=0.5");
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      headers.append("X-Requested-With", "XMLHttpRequest");
      headers.append("Sec-Fetch-Dest", "empty");
      headers.append("Sec-Fetch-Mode", "cors");
      headers.append("Sec-Fetch-Site", "same-origin");
      headers.append("Priority", "u=0");
      headers.append(
        "Referer",
        "https://www.cedulaprofesional.sep.gob.mx/cedula/presidencia/indexAvanzada.action"
      );

      const body = new URLSearchParams();
      body.append(
        "json",
        JSON.stringify({
          maxResult: "1000",
          nombre: "",
          paterno: "",
          materno: "",
          idCedula: professionalLicense,
        })
      );

      const response = await fetch(
        "https://www.cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action",
        {
          method: "POST",
          headers: headers,
          body: body,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        return null;
      }

      // Lee como texto en Latin-1
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder("latin1");
      const text = decoder.decode(buffer);
      const result = JSON.parse(text);

      return result.items[0] as MedicInformationResponse;
    } catch (error) {
      console.error("Error fetching professional license info:", error);
      return null;
    }
  }
}
