import { Router } from "express";
import { createController, getController, listPatientRecipeController } from "./dependencies";

const router = Router();

router.get("/health", (req, res) => {
  res.send("OK Recipe Service");
});

router.post("/", createController.run.bind(createController));
router.get("/", listPatientRecipeController.run.bind(listPatientRecipeController));
router.get("/:id", getController.run.bind(getController));

export default router;
