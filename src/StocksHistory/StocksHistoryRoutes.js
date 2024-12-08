"use strict";
import express from "express";

const StocksHistoryRoutes = (stocksHistoryController) => {
  const router = express.Router();

  router.post("/", (req, res) =>
    stocksHistoryController.createStocksHistory(req, res)
  );

  router.get("/:companyId", (req, res) => {
    stocksHistoryController.getStocksHistory(req, res);
  });

  return router;
};

export default StocksHistoryRoutes;
