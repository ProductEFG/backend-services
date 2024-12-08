import StockHistory from "../../db/Schemas/StocksHistory.js";

class StocksHistoryRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  addStocksHistory = async (data, correlationId) => {
    this.logger.info("addStocksHistory - Adding or updating stocks history", {
      correlationId,
      data,
    });

    try {
      // Normalize the `data.date` to only consider the date portion
      const normalizedDate = new Date(data.date);
      normalizedDate.setHours(0, 0, 0, 0);
      data.date = normalizedDate;

      // Use findOneAndUpdate to either update or insert the record
      const stockHistory = await StockHistory.findOneAndUpdate(
        {
          companyId: data.companyId,
          date: normalizedDate, // Match by normalized date and companyId
        },
        { $set: data }, // Update the record with the provided data
        { upsert: true, new: true } // Create if not found, and return the updated/new document
      );

      return stockHistory;
    } catch (error) {
      this.logger.error("Error in addStocksHistory", {
        correlationId,
        error: error.message,
      });
      throw error;
    }
  };

  deleteStocksHistory = async (companyId, correlationId) => {
    try {
      this.logger.info(
        "deleteStocksHistory - Deleting stocks history records",
        {
          correlationId,
          companyId,
        }
      );

      const result = await StockHistory.deleteMany({ companyId });

      this.logger.info("deleteStocksHistory - Deleted records successfully", {
        correlationId,
        companyId,
        deletedCount: result.deletedCount,
      });

      return result;
    } catch (error) {
      this.logger.error("deleteStocksHistory - Error deleting records", {
        correlationId,
        companyId,
        error: error.message,
      });
      throw error; // Re-throw the error to handle it at a higher level
    }
  };

  getStocksHistory = async (companyId, correlationId) => {
    this.logger.info("getStocksHistory - Fetching history for company", {
      correlationId,
      companyId,
    });
    const stocksHistory = await StockHistory.find({ companyId: companyId });
    return stocksHistory;
  };

  getStocksHistoryByDate = async (companyId, date, correlationId) => {
    this.logger.info(
      "getStocksHistoryByDate - Fetching history for company and date",
      { correlationId, companyId, date }
    );
    const stocksHistory = await StockHistory.findOne({
      companyId: companyId,
      date: date,
    });
    return stocksHistory;
  };

  updateStocksHistory = async (stocksHistoryId, data, correlationId) => {
    this.logger.info("updateStocksHistory - Updating stocks history", {
      correlationId,
      stocksHistoryId,
      data,
    });
    const stocksHistory = await StockHistory.findByIdAndUpdate(
      stocksHistoryId,
      data
    );
    return stocksHistory;
  };
}

export default StocksHistoryRepo;
