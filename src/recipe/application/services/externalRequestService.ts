export enum ProfessionalSex {
    Male = "1",
    Female = "2",
}

export interface MedicInformationResponse {
    license: string,
    desins: string,
    materno: string,
    paterno: string
    nombre: string
    nombreM: string | null
    sexo: ProfessionalSex
    titulo: string
}

export default interface ExternalRequestService {
    getMedicInformationByProfessionalLicense(
        professionalLicense: string
    ): Promise<MedicInformationResponse | null>;
}