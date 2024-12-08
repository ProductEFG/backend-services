"use strict";
import express from "express";

const TransactionRoutes = (transactionController) => {
  const router = express.Router();

  router.get("/", (req, res) =>
    transactionController.getTransactions(req, res)
  );

  return router;
};

export default TransactionRoutes;
