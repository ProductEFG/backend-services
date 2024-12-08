class StocksHistoryService {
  constructor({ stocksHistoryRepo, logger }) {
    this.stocksHistoryRepo = stocksHistoryRepo;
    this.logger = logger;
  }

  getStocksHistory = async (companyId, correlationId) => {
    try {
      const history = await this.stocksHistoryRepo.getStocksHistory(
        companyId,
        correlationId
      );

      return history;
    } catch (error) {
      throw error;
    }
  };

  createStocksHistory = async (data, correlationId) => {
    const { companyId, date } = data;

    let stocksHistory;
    try {
      const existingStocksHistory =
        await this.stocksHistoryRepo.getStocksHistoryByDate(
          companyId,
          date,
          correlationId
        );

      if (existingStocksHistory) {
        this.logger.info("createStocksHistory - History exists, updating", {
          companyId,
          date,
          correlationId,
        });
        stocksHistory = await this.stocksHistoryRepo.updateStocksHistory(
          existingStocksHistory._id,
          data,
          correlationId
        );
      } else {
        this.logger.info(
          "createStocksHistory - No existing history, creating new entry",
          { companyId, date, correlationId }
        );
        stocksHistory = await this.stocksHistoryRepo.addStocksHistory(
          data,
          correlationId
        );
      }

      return stocksHistory;
    } catch (error) {
      throw error;
    }
  };
}

export default StocksHistoryService;
