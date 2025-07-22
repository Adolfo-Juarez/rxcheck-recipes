import AuthMiddleware from "../../shared/middleware/AuthMiddleware";
import CreateRecipeUseCase from "../application/createRecipeUseCase";
import GetRecipeUseCase from "../application/getRecipeUseCase";
import ListPatientRecipeUseCase from "../application/listPatientRecipeUseCase";
import CreateRecipeController from "./controller/createRecipeController";
import GetRecipeController from "./controller/getRecipeController";
import ListPatientRecipeController from "./controller/listPatientRecipeController";
import RecipePdfHelper from "./helpers/recipePdfHelper";
import StorageHelper from "./helpers/storageHelper";
import SequelizeIllegalRepository from "./sequelizeIllegalRepository";
import SequelizeRecipeMedicationRepository from "./sequelizeRecipeMedicationRepository";
import SequelizeRecipeRepository from "./sequelizeRecipeRepository";
import InternalRequestHelper from "./helpers/internalRequestHelper";
import ExternalRequestHelper from "./helpers/externalRequestHelper";
import { VerifyUseCase } from "../application/verifyUseCase";
import VerifyController from "./controller/verifyController";
import SupplyRecipeUseCase from "../application/supplyRecipeUseCase";
import SupplyRecipeController from "./controller/supplyRecipeController";

export const internalRequestHelper = new InternalRequestHelper();
export const externalRequestHelper = new ExternalRequestHelper();
export const pdfHelper = new RecipePdfHelper();
export const storageHelper = new StorageHelper();

export const sequelizeRecipeRepository = new SequelizeRecipeRepository();
export const sequelizeRecipeMedicationRepository = new SequelizeRecipeMedicationRepository();
export const sequelizeIllegalRepository = new SequelizeIllegalRepository();

export const getRecipeUseCase = new GetRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, internalRequestHelper, storageHelper);
export const listPatientRecipeUseCase = new ListPatientRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, internalRequestHelper);
export const createRecipeUseCase = new CreateRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, storageHelper, pdfHelper, externalRequestHelper);
export const verifyUseCase = new VerifyUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, internalRequestHelper);
export const supplyRecipeUseCase = new SupplyRecipeUseCase(sequelizeRecipeMedicationRepository, sequelizeRecipeRepository);

export const getController = new GetRecipeController(getRecipeUseCase);
export const listPatientRecipeController = new ListPatientRecipeController(listPatientRecipeUseCase);
export const createController = new CreateRecipeController(createRecipeUseCase, sequelizeIllegalRepository, internalRequestHelper);
export const verifyController = new VerifyController(verifyUseCase);
export const supplyController = new SupplyRecipeController(supplyRecipeUseCase);

export const authMiddleware = new AuthMiddleware(sequelizeIllegalRepository, internalRequestHelper);