import sequelize from "../../database/sequelize";
import IllegalRepository, {
  UserIllegal,
} from "../domain/repository/IllegalRepository";
import { UserRoles } from "../../recipe/application/services/internalRequestService";

export default class SequelizeIllegalRepository implements IllegalRepository {
  async getMedicLicenseFromId(id: string): Promise<string | null> {
    try{
      const result = await sequelize.query(
        `
     SELECT
     cedula_profesional
     FROM users
     WHERE id = $1
     AND role = $2
     LIMIT 1
    `,
        {
          bind: [id, ("medico" as UserRoles) ],
        }
      ) as any;
      return result[0][0].cedula_profesional;
    }catch(error: any){
      return null;
    }
  }
  async findUserById(id: string): Promise<UserIllegal | null> {
    try {
      const result: Array<UserIllegal[]> = (await sequelize.query(
        `
     SELECT
     nombre,
     apellido_paterno,
     apellido_materno,
     curp,
     rfc,
     email,
     telefono,
     domicilio
     FROM users
     WHERE id = $1
     LIMIT 1
    `,
        {
          bind: [id],
        }
      )) as Array<UserIllegal[]>;

      return result[0][0];
    } catch (error: any) {
      return null;
    }
  }
  async doesUserExistsWithId(id: string): Promise<boolean> {
    console.log(id);
    try {
      const result = await sequelize.query(
        `
     SELECT
     curp
     FROM users
     WHERE id = $1
     LIMIT 1
    `,
        {
          bind: [id],
        }
      );
      if (result[0].length > 0) {
        return true;
      }
      return false;
    } catch (error: any) {
      return false;
    }
  }
}
