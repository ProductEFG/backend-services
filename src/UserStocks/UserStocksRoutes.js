"use strict";
import express from "express";

const UserStocksRoutes = (userStocksController) => {
  const router = express.Router();

  router.post("/buy-stock", (req, res) =>
    userStocksController.buyStock(req, res)
  );

  router.post("/sell-stock", (req, res) =>
    userStocksController.sellStock(req, res)
  );

  router.post("/", (req, res) => userStocksController.addUserStocks(req, res));

  router.put("/", (req, res) =>
    userStocksController.updateUserStocks(req, res)
  );

  router.get("/get-all/:userId", (req, res) =>
    userStocksController.getAllUserStocks(req, res)
  );

  router.get("/get-one", (req, res) =>
    userStocksController.getOneUserStocks(req, res)
  );

  return router;
};

export default UserStocksRoutes;
