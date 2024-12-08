import express from "express";

const AdminRoutes = (adminController) => {
  const router = express.Router();

  router.post("/register", (req, res) => adminController.register(req, res));

  router.post("/login", (req, res) => adminController.login(req, res));

  router.get("/get-email/:email", (req, res) =>
    adminController.getAdminByEmail(req, res)
  );

  return router;
};

export default AdminRoutes;
