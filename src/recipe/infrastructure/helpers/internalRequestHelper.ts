import GenericResponse from "../../../shared/dto/genericResponse";
import InternalRequestService, {
  AuthMiddlewareServiceResponse,
  MedicationResponse,
} from "../../application/services/internalRequestService";

export default class InternalRequestHelper implements InternalRequestService {
  async validateAuthToken(
    token: string
  ): Promise<AuthMiddlewareServiceResponse | null> {
    try {
      const response = await fetch(
        `${process.env.BASE_SERVICE_URL}/user/auth/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as AuthMiddlewareServiceResponse;
    } catch (error) {
      return null;
    }
  }

  async getMedicationListById(
    id: number[]
  ): Promise<GenericResponse<MedicationResponse[]> | null> {
    try {
      const result = await fetch(
        `${process.env.BASE_SERVICE_URL}/medication/fetch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: id,
          }),
        }
      );
      const data = (await result.json()) as GenericResponse<
        MedicationResponse[]
      >;
      return data;
    } catch (error) {
      console.log(
        `Error by fetching: ${process.env.BASE_SERVICE_URL}/medication/fetch`
      );
      console.log(error);
      return null;
    }
  }
}
