import GenericResponse from "../../../shared/dto/genericResponse";
import GetMedicationListByIdService, {
  MedicationResponse,
} from "../../application/services/getMedicationListByIdService";

export default class GetMedicationListByIdHelper
  implements GetMedicationListByIdService
{
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
        console.log(`Error by fetching: ${process.env.BASE_SERVICE_URL}/medication/fetch`)
      console.log(error);
      return null;
    }
  }
}
