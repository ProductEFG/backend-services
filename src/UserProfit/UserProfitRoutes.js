"use strict";
import express from "express";

const UserProfitRoutes = (userProfitController) => {
  const router = express.Router();

  router.get("/:userId", (req, res) =>
    userProfitController.getAllUserProfit(req, res)
  );

  return router;
};

export default UserProfitRoutes;
