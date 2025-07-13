import { Router } from "express";
import {
  authMiddleware,
  createController,
  getController,
  listPatientRecipeController,
  verifyController,
} from "./dependencies";

const router = Router();

router.get("/health", (req, res) => {
  res.send("OK Recipe Service");
});

router.post(
  "/",
  authMiddleware.withRole("medico"),
  createController.run.bind(createController)
);
router.get(
  "/",
  authMiddleware.withRole("paciente"),
  listPatientRecipeController.run.bind(listPatientRecipeController)
);
router.get(
  "/:id",
  authMiddleware.run.bind(authMiddleware),
  getController.run.bind(getController)
);

router.get(
  "/verify/:code",
  authMiddleware.withRole("farmacia"),
  verifyController.run.bind(verifyController)
);

export default router;
