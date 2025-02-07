import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../util/cloudinary.js";
import { Readable } from "stream";

class CompanyService {
  constructor({ companyRepo, stocksHistoryRepo, userStocksRepo, logger }) {
    this.companyRepo = companyRepo;
    this.stocksHistoryRepo = stocksHistoryRepo;
    this.userStocksRepo = userStocksRepo;
    this.logger = logger;
  }

  getCompany = async (companyId, correlationId) => {
    try {
      const company = await this.companyRepo.getCompany(
        companyId,
        correlationId
      );
      if (!company) {
        this.logger.warn("getCompany - No company found", {
          correlationId,
          companyId,
        });
      }
      return company;
    } catch (error) {
      throw error;
    }
  };

  getCompanies = async (balance, correlationId) => {
    try {
      const currentBalance = balance || 0;
      const companies = await this.companyRepo.getCompanies(
        currentBalance,
        correlationId
      );

      return companies;
    } catch (error) {
      throw error;
    }
  };

  getMostTraded = async (correlationId) => {
    try {
      const companies = await this.companyRepo.getMostTraded(correlationId);

      return companies;
    } catch (error) {
      throw error;
    }
  };

  getMostInvested = async (correlationId) => {
    try {
      const companies = await this.companyRepo.getMostInvested(correlationId);

      return companies;
    } catch (error) {
      throw error;
    }
  };

  getHighestReturn = async (correlationId) => {
    try {
      const companies = await this.companyRepo.getHighestReturn(correlationId);

      return companies;
    } catch (error) {
      throw error;
    }
  };

  getMostVisited = async (correlationId) => {
    try {
      const companies = await this.companyRepo.getMostVisited(correlationId);

      return companies;
    } catch (error) {
      throw error;
    }
  };

  createCompany = async (logoPath, data, correlationId) => {
    try {
      const addData = {
        ...data,
      };

      let filePathOnCloudinary = `${uuidv4()}_${
        logoPath.originalname.split(".")[0]
      }`;

      await cloudinary.v2.uploader
        .upload(logoPath.path, {
          folder: "company_logos",
          public_id: filePathOnCloudinary,
        })
        .then((result) => {
          // Remove file from local uploads folder
          if (fs.existsSync(logoPath.path)) {
            fs.unlinkSync(logoPath.path);
          }
          console.log("Logo uploaded successfully:", result.secure_url);
          addData.logo = result.secure_url;
        })
        .catch((error) => {
          // Remove file from local uploads folder
          if (fs.existsSync(logoPath.path)) {
            fs.unlinkSync(logoPath.path);
          }
          console.error("Error uploading logo to Cloudinary:", error);
          reject(new Error("Failed to upload logo"));
        });

      const company = await this.companyRepo.addCompany(addData, correlationId);

      return company;
    } catch (error) {
      throw error;
    }
  };

  deleteCompany = async (companyId, correlationId) => {
    try {
      const existingCompany = await this.companyRepo.getCompany(companyId);

      const publicId = existingCompany.logo
        .split("/")
        .slice(7)
        .join("/")
        .replace(".svg", "");
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId, { invalidate: true });
      }

      await this.stocksHistoryRepo.deleteStocksHistory(
        companyId,
        correlationId
      );
      await this.userStocksRepo.deleteUserStocksByCompany(
        companyId,
        correlationId
      );
      const company = await this.companyRepo.deleteCompany(
        companyId,
        correlationId
      );

      return company;
    } catch (error) {
      throw error;
    }
  };

  updateCompany = async (logoPath, data, correlationId) => {
    try {
      const updateData = {
        ...data,
      };

      const existingCompany = await this.companyRepo.getCompany(data.companyId);

      if (logoPath) {
        let filePathOnCloudinary = `${uuidv4()}_${
          logoPath.originalname.split(".")[0]
        }`;

        await cloudinary.v2.uploader
          .upload(logoPath.path, {
            folder: "company_logos",
            public_id: filePathOnCloudinary,
          })
          .then((result) => {
            // Remove file from local uploads folder
            if (fs.existsSync(logoPath.path)) {
              fs.unlinkSync(logoPath.path);
            }
            console.log("Logo uploaded successfully:", result.secure_url);
            updateData.logo = result.secure_url;
          })
          .catch((error) => {
            // Remove file from local uploads folder
            if (fs.existsSync(logoPath.path)) {
              fs.unlinkSync(logoPath.path);
            }
            console.error("Error uploading logo to Cloudinary:", error);
            reject(new Error("Failed to upload logo"));
          });

        const publicId = existingCompany.logo
          .split("/")
          .slice(7)
          .join("/")
          .replace(".svg", "");
        if (publicId) {
          await cloudinary.v2.uploader.destroy(publicId, { invalidate: true });
        }
      }

      const company = await this.companyRepo.updateCompany(
        updateData,
        correlationId
      );

      return company;
    } catch (error) {
      throw error;
    }
  };

  updateVisitors = async (visitors, correlationId) => {
    try {
      const bulkOperations = [];

      this.logger.info("Preparing bulk operations for each establishment", {
        correlationId,
        numberOfEntries: Object.keys(visitors).length,
      });

      for (const [establishment, currentVisitors] of Object.entries(visitors)) {
        this.logger.debug(
          "Fetching the previous price for establishment and performing calculations",
          { correlationId, establishment }
        );

        const existingCompany =
          await this.companyRepo.getCompanyByEstablishmentType(establishment);

        let prevPrice = 0,
          prevReturn = 0,
          prevBuys = 0,
          prevSells = 0,
          prevVisitors = 0;
        if (existingCompany) {
          prevPrice = existingCompany.current_price || 0;
          prevReturn = existingCompany.current_return || 0;
          prevBuys = existingCompany.number_of_buys || 0;
          prevSells = existingCompany.number_of_sells || 0;
          prevVisitors = existingCompany.current_visitors || 0;

          // Insert a new record into the stockhistory collection
          await this.stocksHistoryRepo.addStocksHistory(
            {
              companyId: existingCompany._id,
              date: new Date(),
              visitors: prevVisitors,
              shares_return: prevReturn,
              shares_price: prevPrice,
              number_of_buys: prevBuys,
              number_of_sells: prevSells,
            },
            correlationId
          );

          if (currentVisitors > 0) {
            // Perform calculations for the current record
            const currentPrice = currentVisitors / 100;
            const currentChange = currentPrice - prevPrice;
            const currentTemp =
              currentPrice + currentChange < 0
                ? 0
                : currentPrice + currentChange;
            const currentReturn =
              prevPrice > 0
                ? ((currentPrice - prevPrice) / prevPrice) * 100
                : 0;

            // Prepare bulk operation for updating the company collection
            bulkOperations.push({
              updateOne: {
                filter: { establishment_type: establishment }, // Match the establishment in the database
                update: {
                  $set: {
                    current_price: parseFloat(currentPrice.toFixed(2)),
                    current_change: currentChange,
                    current_visitors: currentVisitors,
                    temp_price: currentTemp,
                    current_return: parseFloat(currentReturn.toFixed(2)), // Ensure numeric value with 2 decimals
                    last_updated: new Date(), // Add a timestamp for updates
                  },
                },
                upsert: false, // Don't create the record if it doesn't exist
              },
            });
          }

          this.logger.debug("Prepared bulk operation for establishment", {
            establishment,
            update: bulkOperations[bulkOperations.length - 1],
          });
        }
      }

      await this.companyRepo.updateVisitors(bulkOperations, correlationId);
    } catch (error) {
      throw error;
    }
  };
}

export default CompanyService;
