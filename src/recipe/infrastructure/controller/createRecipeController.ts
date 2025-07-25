import GenericResponse from "../../../shared/dto/genericResponse";
import CreateRecipeUseCase from "../../application/createRecipeUseCase";
import { Request, Response } from "express";
import SaveRecipeResponse from "../../domain/dto/saveRecipeResponse";
import { AuthenticatedRequest } from "../../../shared/middleware/AuthMiddleware";
import IllegalRepository from "../../domain/repository/IllegalRepository";
import CreateRecipeRequest, {
  validateSchema,
} from "../../domain/dto/createRecipeRequest";
import InternalRequestService from "../../application/services/internalRequestService";

export default class CreateRecipeController {
  constructor(
    readonly createRecipeUseCase: CreateRecipeUseCase,
    readonly illegalRepository: IllegalRepository,
    readonly internalService: InternalRequestService
  ) {}

  async run(req: AuthenticatedRequest, res: Response) {
    const data: CreateRecipeRequest | null = validateSchema(req.body);

    const medicLicense = await this.illegalRepository.getMedicLicenseFromId(
      req.user?.id ?? ""
    );

    if (!medicLicense) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!data) {
      return res.status(400).json({ message: "Bad request" });
    }
    const doctor_id = req.user?.rfc ?? "";
    const patientInformatio = await this.illegalRepository.findUserById(
      data.patient.id
    );

    if (!patientInformatio) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!doctor_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response: GenericResponse<SaveRecipeResponse | null> = {
      message: "",
      success: false,
    };

    const patientExists = await this.illegalRepository.doesUserExistsWithId(
      data.patient.id
    );

    if (!patientExists) {
      response.message = "Patient does not exist";
      return res.status(400).json(response);
    }
    console.log(`Medic license A: ${medicLicense}`);
    const medications = await this.internalService.getMedicationListById(
      data.medications.map((med) => med.id)
    );

    if (!medications || !medications.data || medications.data.length === 0) {
      response.message = "Error fetching medications";
      return res.status(400).json(response);
    }

    const result = await this.createRecipeUseCase.run({
      patient: {
        id: data.patient.id,
        full_name:
          `${patientInformatio.nombre} ${patientInformatio.apellido_paterno} ${patientInformatio.apellido_materno}`.trim(),
        curp: patientInformatio.curp,
        weight: data.patient.weight,
        height: data.patient.height,
        address: "-",
        diagnostic: data.patient.diagnostic,
      },
      medic: {
        id: req.user?.id ?? "",
        full_name: `${req.user?.name} ${req.user?.lastname}`.trim(),
        license: medicLicense,
        phone: req.user?.phone,
        place: req.user?.address,
      },
      medications: medications.data.map((med) => ({
        dosis: data.medications.find((m) => m.id === med.id)?.dosis ?? "",
        duration: data.medications.find((m) => m.id === med.id)?.duration ?? "",
        id: med.id,
        name: med.name,
        strength: med.strength,
        form: med.form,
        via: med.indication,
        frecuency: data.medications.find((m) => m.id === med.id)?.dosis ?? "",
        instruction: data.medications.find((m) => m.id === med.id)?.indication ?? "",
      })),
    });

    if (!result) {
      response.message = "Error creating recipe";
      return res.status(400).json(response);
    }

    response.message = "Recipe created successfully";
    response.success = true;
    response.data = result;

    return res.status(200).json(response);
  }
}
