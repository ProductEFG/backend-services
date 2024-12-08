"use strict";
import express from "express";
import upload from "../util/multer.js";

const CompanyRoutes = (companyController) => {
  const router = express.Router();

  router.post("/", upload.single("logo"), (req, res) =>
    companyController.createCompany(req, res)
  );

  router.delete("/:companyId", (req, res) =>
    companyController.deleteCompany(req, res)
  );

  router.put("/update-company", upload.single("logo"), (req, res) =>
    companyController.updateCompany(req, res)
  );

  router.put("/update-visitors", (req, res) =>
    companyController.updateVisitors(req, res)
  );

  router.get("/get-companies/:balance", (req, res) =>
    companyController.getCompanies(req, res)
  );

  router.get("/get-company/:companyId", (req, res) =>
    companyController.getCompany(req, res)
  );

  router.get("/metrics", (req, res) =>
    companyController.getCompanyMetrics(req, res)
  );

  router.get("/most-traded", (req, res) =>
    companyController.getMostTraded(req, res)
  );
  router.get("/most-invested", (req, res) =>
    companyController.getMostInvested(req, res)
  );
  router.get("/highest-return", (req, res) =>
    companyController.getHighestReturn(req, res)
  );
  router.get("/most-visited", (req, res) =>
    companyController.getMostVisited(req, res)
  );

  return router;
};

export default CompanyRoutes;
