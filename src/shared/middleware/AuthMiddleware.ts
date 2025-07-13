import { Request, Response, NextFunction } from "express";
import IllegalRepository from "../../recipe/domain/repository/IllegalRepository";
import InternalRequestService, {
  UserRoles,
} from "../../recipe/application/services/internalRequestService";

export interface AuthUserMiddleware {
  id: string;
  name: string;
  lastname: string;
  role: UserRoles;
  curp: string;
  rfc: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserMiddleware;
}

export default class AuthMiddleware {
  protected role: UserRoles | undefined;

  constructor(
    readonly repository: IllegalRepository,
    readonly service: InternalRequestService
  ) {}

  public withRole(
    role: UserRoles
  ): (req: Request, res: Response, next: NextFunction) => void {
    const instance = new AuthMiddleware(this.repository, this.service);
    instance.role = role;
    return instance.run.bind(instance);
  }

  public async run(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: "Token not found" });
    }

    const jwt = token.split(" ")[1];

    const user = await this.service.validateAuthToken(jwt);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: "Invalid token" });
    }

    if (typeof this.role !== "undefined") {
      console.log(typeof this.role !== "undefined")
      if (user.role !== this.role) {
        return res.status(403).json({
          message: "Forbidden",
          details: `This endpoint is only accessible by "${this.role}" users. You are a "${user.role}" user.`,
        });
      }
    }

    const result = await this.repository.findUserById(user.id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      name: result.nombre,
      lastname: `${result.apellido_paterno} ${result.apellido_materno}`,
      role: user.role,
      curp: result.curp,
      rfc: result.rfc,
      email: result.email,
    };

    return next();
  }
}
