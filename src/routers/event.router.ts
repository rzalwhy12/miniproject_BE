import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { uploadMemory } from "../middleware/uploader";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();
const controller = new EventController();

router.post("/create",
    uploadMemory().single('image'),
    controller.create.bind(controller)
);
router.put("/update/:id", controller.update.bind(controller));
router.delete("/delete/:id", controller.delete.bind(controller));

export default router;
