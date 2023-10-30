import { Router } from "express";
import brandRoutes from "./routes/brands.routes";
import categoryRoutes from "./routes/categories.routes";
import scentRoutes from "./routes/scents.routes";
import subCategoryRoutes from "./routes/subcategory.routes";

const adminRoutes = Router();

adminRoutes.use("/scents", scentRoutes);
adminRoutes.use("/categories", categoryRoutes);
adminRoutes.use("/sub-categories", subCategoryRoutes);
adminRoutes.use("/brands", brandRoutes);

export = adminRoutes;
