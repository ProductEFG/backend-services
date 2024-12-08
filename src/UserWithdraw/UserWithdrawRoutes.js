"use strict";
import express from "express";

const UserWithdrawRoutes = (userWithdrawController) => {
  const router = express.Router();

  router.post("/withdraw-funds", (req, res) =>
    userWithdrawController.addUserWithdraw(req, res)
  );

  router.get("/get-one/:userId", (req, res) =>
    userWithdrawController.getOneUserWithdraws(req, res)
  );

  router.get("/get-all", (req, res) =>
    userWithdrawController.getAllUserWithdraws(req, res)
  );

  return router;
};

export default UserWithdrawRoutes;
