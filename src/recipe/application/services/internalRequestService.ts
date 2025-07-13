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

export type UserRoles = "admin" | "medico" | "paciente" | "farmacia";

export interface AuthMiddlewareServiceResponse {
  id: string;
  role: UserRoles;
}

export default interface InternalRequestService {
  getMedicationListById(
    id: number[]
  ): Promise<GenericResponse<MedicationResponse[]> | null>;
  validateAuthToken(
    token: string
  ): Promise<AuthMiddlewareServiceResponse | null>;
}
