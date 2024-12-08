import Company from "../../db/Schemas/CompanySchema.js";

class CompanyRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  addCompany = async (data, correlationId) => {
    try {
      this.logger.info("addCompany - creating new company in DB", {
        correlationId,
        name: data.name,
      });
      const company = new Company(data);
      const savedCompany = await company.save();
      return savedCompany;
    } catch (error) {
      throw new Error(`Error adding company: ${error.message}`);
    }
  };

  deleteCompany = async (companyId, correlationId) => {
    try {
      this.logger.info("deleteCompany - deleting company from DB", {
        correlationId,
        Id: companyId,
      });
      const company = await Company.findByIdAndDelete(companyId);
      return company;
    } catch (error) {
      throw new Error(`Error deleting company: ${error.message}`);
    }
  };

  updateCompany = async (data, correlationId) => {
    try {
      this.logger.info("updateCompany - updating company in DB", {
        correlationId,
        ID: data.companyId,
      });
      const { companyId, ...updateFields } = data;

      const company = await company.findByIdAndUpdate(companyId, updateFields, {
        new: true,
      });

      return company;
    } catch (error) {
      throw new Error(`Error updating company: ${error.message}`);
    }
  };

  getCompany = async (companyId, correlationId) => {
    try {
      this.logger.info("getCompany - retrieving company info from DB", {
        correlationId,
        Id: companyId,
      });
      const company = await Company.findById(companyId);
      return company;
    } catch (error) {
      throw new Error(`Error retrieving company by ID: ${error.message}`);
    }
  };

  getCompanyByEstablishmentType = async (type, correlationId) => {
    try {
      this.logger.info(
        "getCompanyByEstablishmentType - retrieving company info from DB",
        {
          correlationId,
          type: type,
        }
      );
      const company = await Company.findOne({ establishment_type: type });
      return company;
    } catch (error) {
      throw new Error(
        `Error retrieving company by Establishment Type: ${error.message}`
      );
    }
  };

  getCompanies = async (balance, correlationId) => {
    try {
      this.logger.info(
        "getCompanies - retrieving companies info from DB by Balance",
        {
          correlationId,
          balance,
        }
      );
      const companies = await Company.find({
        current_price: { $lte: balance },
      });
      return companies;
    } catch (error) {
      throw new Error(
        `Error retrieving companies by balance: ${error.message}`
      );
    }
  };

  getMostTraded = async (correlationId) => {
    try {
      this.logger.info(
        "getMostTraded - retrieving companies info from DB by Most Traded",
        {
          correlationId,
        }
      );
      const companies = await Company.find().sort({ number_of_trades: -1 });
      return companies;
    } catch (error) {
      throw new Error(
        `Error retrieving most traded companies: ${error.message}`
      );
    }
  };

  getMostInvested = async (correlationId) => {
    try {
      this.logger.info(
        "getMostInvested - retrieving companies info from DB by Most Invested",
        {
          correlationId,
        }
      );
      const companies = await Company.find().sort({ number_of_buys: -1 });
      return companies;
    } catch (error) {
      throw new Error(
        `Error retrieving most invested companies: ${error.message}`
      );
    }
  };

  getHighestReturn = async (correlationId) => {
    try {
      this.logger.info(
        "getHighestReturn - retrieving companies info from DB by Highest Return",
        {
          correlationId,
        }
      );
      const companies = await Company.find().sort({ current_return: -1 });
      return companies;
    } catch (error) {
      throw new Error(
        `Error retrieving highest return companies: ${error.message}`
      );
    }
  };

  getMostVisited = async (correlationId) => {
    try {
      this.logger.info(
        "getMostVisited - retrieving companies info from DB by Most Visited",
        {
          correlationId,
        }
      );
      const companies = await Company.find().sort({ current_visitors: -1 });
      return companies;
    } catch (error) {
      throw new Error(
        `Error retrieving most visited companies: ${error.message}`
      );
    }
  };

  updateCompany = async (data, correlationId) => {
    try {
      this.logger.info("updateCompany - Updating company information in DB", {
        correlationId,
        Id: data.companyId,
      });

      const company = await Company.findByIdAndUpdate(data.companyId, data, {
        new: true,
      });
      return company;
    } catch (error) {
      throw new Error(`Error updating company: ${error.message}`);
    }
  };

  updateVisitors = async (bulkOperations, correlationId) => {
    try {
      if (bulkOperations.length > 0) {
        this.logger.info("Executing bulk database update for visitors", {
          correlationId,
          numberOfOperations: bulkOperations.length,
        });

        const result = await Company.bulkWrite(bulkOperations);

        this.logger.info("Bulk update executed successfully", {
          correlationId,
          date: new Date(),
        });

        return result;
      } else {
        this.logger.warn("No bulk operations were prepared", { correlationId });
        return { message: "No updates to perform" };
      }
    } catch (error) {
      throw new Error(`Error updating company visitors ${error.message}`);
    }
  };

  updateAfterTransaction = async (type, companyId, correlationId) => {
    try {
      this.logger.info(
        "updateAfterTransaction - Updating company information in DB After a transaction",
        {
          correlationId,
          transactionType: type,
          CompanyID: companyId,
        }
      );

      const update = { $inc: { number_of_trades: 1 } };

      if (type === "Buy") {
        update.$inc.number_of_buys = 1;
      } else if (type === "Sell") {
        update.$inc.number_of_sells = 1;
      } else {
        throw new Error("Invalid transaction type");
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        update,
        { new: true }
      );
      return updatedCompany;
    } catch (error) {
      throw new Error(
        `Error updating company after transaction: ${error.message}`
      );
    }
  };

  rollbackAfterTransaction = async (type, companyId, correlationId) => {
    try {
      this.logger.info(
        "rollbackAfterTransaction - Rolling back company information in DB After a failed transaction",
        {
          correlationId,
          transactionType: type,
          CompanyID: companyId,
        }
      );

      const company = await Company.findById(companyId);

      if (type === "Buy") {
        company.number_of_buys -= 1;
      } else if (type === "Sell") {
        company.number_of_sells -= 1;
      } else {
        throw new Error("Invalid transaction type");
      }

      company.number_of_trades -= 1;
      await company.save();
      return company;
    } catch (error) {
      throw new Error(`Error rolling back transaction: ${error.message}`);
    }
  };
}

export default CompanyRepo;
