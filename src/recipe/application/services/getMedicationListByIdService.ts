import GenericResponse from "../../../shared/dto/genericResponse";

export interface MedicationResponse {
  id: number;
  name: string;
  category: string;
  form: string;
  strength: string;
  classification: string;
  indication: string;
  text: string;
}

export default interface GetMedicationListByIdService {
  getMedicationListById(id: number[]): Promise<GenericResponse<MedicationResponse[]> | null>;
}
