import CreateRecipeUseCase from "../application/createRecipeUseCase";
import GetRecipeUseCase from "../application/getRecipeUseCase";
import ListPatientRecipeUseCase from "../application/listPatientRecipeUseCase";
import CreateRecipeController from "./controller/createRecipeController";
import GetRecipeController from "./controller/getRecipeController";
import ListPatientRecipeController from "./controller/listPatientRecipeController";
import GetMedicationListByIdHelper from "./helpers/getMedicationListByIdHelper";
import SequelizeRecipeMedicationRepository from "./sequelizeRecipeMedicationRepository";
import SequelizeRecipeRepository from "./sequelizeRecipeRepository";

export const getMedicationListByIdHelper = new GetMedicationListByIdHelper();

export const sequelizeRecipeRepository = new SequelizeRecipeRepository();
export const sequelizeRecipeMedicationRepository = new SequelizeRecipeMedicationRepository();

export const getRecipeUseCase = new GetRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, getMedicationListByIdHelper);
export const listPatientRecipeUseCase = new ListPatientRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository, getMedicationListByIdHelper);
export const createRecipeUseCase = new CreateRecipeUseCase(sequelizeRecipeRepository, sequelizeRecipeMedicationRepository);

export const getController = new GetRecipeController(getRecipeUseCase);
export const listPatientRecipeController = new ListPatientRecipeController(listPatientRecipeUseCase);
export const createController = new CreateRecipeController(createRecipeUseCase);