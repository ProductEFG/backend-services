import { v4 as uuidv4 } from "uuid";
import {
  updateDailyStockBalances,
  updateMonthlyBalances,
} from "../jobs/userUpdateJobs.js";

class CompanyController {
  constructor({ companyService, logger }) {
    this.companyService = companyService;
    this.logger = logger;
  }

  getCompany = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      const { companyId } = req.params;

      this.logger.info("getCompany - Request received", {
        correlationId,
        companyId,
      });

      if (!companyId) {
        this.logger.error("getCompany - Missing companyId parameter", {
          correlationId,
        });
        return res
          .status(400)
          .json({ error: "CompanyId parameter is required" });
      }

      const company = await this.companyService.getCompany(
        companyId,
        correlationId
      );

      if (!company) {
        this.logger.error("getCompany - Company not found", {
          correlationId,
          companyId,
        });
        return res.status(404).json({ error: "Company not found" });
      }

      this.logger.info("getCompany - Successfully retrieved company", {
        correlationId,
        companyId,
      });
      res.status(200).json(company);
    } catch (error) {
      this.logger.error("getCompany - Unexpected error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getCompanyMetrics = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getCompanyMetrics - Request received", {
        correlationId,
      });

      const mostTraded = await this.companyService.getMostTraded(correlationId);
      const mostInvested = await this.companyService.getMostInvested(
        correlationId
      );
      const highestReturn = await this.companyService.getHighestReturn(
        correlationId
      );
      const mostVisited = await this.companyService.getMostVisited(
        correlationId
      );

      const metrics = {
        trending_now: mostTraded,
        most_traded: mostInvested,
        highest_return: highestReturn,
        most_visited: mostVisited,
      };

      this.logger.info("getCompanyMetrics - Successfully retrieved metrics", {
        correlationId,
      });
      return res.status(200).json(metrics);
    } catch (error) {
      this.logger.error("getCompanyMetrics - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getMostTraded = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getMostTraded - Request received", { correlationId });

      const companies = await this.companyService.getMostTraded(correlationId);

      this.logger.info(
        "getMostTraded - Successfully retrieved most traded companies",
        { correlationId }
      );
      return res.status(200).json(companies);
    } catch (error) {
      this.logger.error("getMostTraded - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getMostInvested = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getMostInvested - Request received", { correlationId });

      const companies = await this.companyService.getMostInvested(
        correlationId
      );

      this.logger.info(
        "getMostInvested - Successfully retrieved most invested companies",
        { correlationId }
      );
      return res.status(200).json(companies);
    } catch (error) {
      this.logger.error("getMostInvested - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getHighestReturn = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getHighestReturn - Request received", {
        correlationId,
      });

      const companies = await this.companyService.getHighestReturn(
        correlationId
      );

      this.logger.info(
        "getHighestReturn - Successfully retrieved highest return companies",
        { correlationId }
      );
      return res.status(200).json(companies);
    } catch (error) {
      this.logger.error("getHighestReturn - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getMostVisited = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getMostVisited - Request received", { correlationId });

      const companies = await this.companyService.getMostVisited(correlationId);

      this.logger.info(
        "getMostVisited - Successfully retrieved most visited companies",
        { correlationId }
      );
      return res.status(200).json(companies);
    } catch (error) {
      this.logger.error("getMostVisited - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getCompanies = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      const { balance } = req.params;

      this.logger.info("getCompanies - Request received", {
        correlationId,
        balance,
      });

      const companies = await this.companyService.getCompanies(
        balance,
        correlationId
      );

      this.logger.info("getCompanies - Successfully retrieved companies", {
        correlationId,
        balance,
      });
      return res.status(200).json(companies);
    } catch (error) {
      this.logger.error("getCompanies - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  createCompany = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      const { name, description, acronym, establishment_type } = req.body;

      this.logger.info("createCompany - Request received", {
        correlationId,
        name,
        description,
      });

      if (!name || !description || !acronym || !establishment_type) {
        this.logger.warn("createCompany - Missing required fields", {
          correlationId,
          name,
          description,
          logo,
        });
        return res
          .status(400)
          .json({ message: "Name, Description and Logo fields are required." });
      }

      const newCompany = await this.companyService.createCompany(
        req.file,
        req.body,
        correlationId
      );

      this.logger.info("createCompany - Successfully created new company", {
        correlationId,
        newCompany,
      });
      return res.status(201).json(newCompany);
    } catch (error) {
      this.logger.error("createCompany - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  deleteCompany = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      const { companyId } = req.params;

      this.logger.info("deleteCompany - Request received", {
        correlationId,
        companyId,
      });

      if (!companyId) {
        this.logger.warn("deleteCompany - Missing required fields", {
          correlationId,
          companyId,
        });
        return res.status(400).json({
          message: "companyId is required.",
        });
      }

      const company = await this.companyService.deleteCompany(
        companyId,
        correlationId
      );

      this.logger.info("deleteCompany - Successfully deleted company", {
        correlationId,
      });
      return res.status(201).json(company);
    } catch (error) {
      this.logger.error("deleteCompany - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  updateCompany = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      const { companyId } = req.body;

      this.logger.info("updateCompany - Request received", {
        correlationId,
        companyId,
      });

      if (!companyId) {
        this.logger.warn("updateCompany - Missing required fields", {
          correlationId,
          companyId,
        });
        return res.status(400).json({ message: "companyId is required." });
      }

      const updatedCompany = await this.companyService.updateCompany(
        req.file,
        req.body,
        correlationId
      );

      this.logger.info("updateCompany - Successfully updated company", {
        correlationId,
        updatedCompany,
      });
      return res.status(201).json(updatedCompany);
    } catch (error) {
      this.logger.error("updateCompany - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  updateVisitors = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("updateVisitors - Request received", {
        correlationId,
      });

      await this.companyService.updateVisitors(req.body, correlationId);

      await updateDailyStockBalances();

      const currentDate = new Date();
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate() + 1);

      if (tomorrow.getDate() === 1) {
        this.logger.info(
          "updateVisitors - Tomorrow is the start of a new month => Updating prevBalance",
          {
            correlationId,
          }
        );

        await updateMonthlyBalances();
      } else {
        this.logger.info(
          "updateVisitors - Tomorrow is not the start of a new month => Not updating prevBalance",
          {
            correlationId,
          }
        );
      }

      this.logger.info("updateVisitors - Successfully updated companies", {
        correlationId,
      });
      return res
        .status(201)
        .json({ message: "Successfully updated required companies" });
    } catch (error) {
      this.logger.error("updateVisitors - Server error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };
}

export default CompanyController;
