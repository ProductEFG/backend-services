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
      const normalizedDate = new Date(data.date);
      normalizedDate.setHours(0, 0, 0, 0);
      data.date = normalizedDate;

      const stockHistory = await StockHistory.findOneAndUpdate(
        {
          companyId: data.companyId,
          date: normalizedDate,
        },
        { $set: data },
        { upsert: true, new: true }
      );

      this.logger.debug(
        "addStocksHistory - Added the following stock history",
        {
          correlationId,
          stockHistory,
        }
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

  getStocksHistory = async (companyId, numberOfDays, correlationId) => {
    this.logger.info("getStocksHistory - Fetching history for company", {
      correlationId,
      companyId,
      numberOfDays,
    });

    const days = parseInt(numberOfDays, 10);
    const query = { companyId: companyId };

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);

    query.createdAt = { $gte: targetDate };

    const stocksHistory = await StockHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(days || 0);

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
