export interface UserIllegal {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  curp: string;
  rfc: string;
  email: string;
  telefono?: string;
  domicilio?: string;
}

export enum ProfessionalSex {
  Male = 1,
  Female = 2,
}

export default interface IllegalRepository {
  findUserById(id: string): Promise<UserIllegal | null>;
  doesUserExistsWithId(id: string): Promise<boolean>;
  getMedicLicenseFromId(id: string): Promise<string | null>;
}
