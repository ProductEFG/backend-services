import { v4 as uuidv4 } from "uuid";
class StocksHistoryController {
  constructor({ stocksHistoryService, logger }) {
    this.stocksHistoryService = stocksHistoryService;
    this.logger = logger;
  }

  getStocksHistory = async (req, res) => {
    const correlationId = uuidv4();
    try {
      const { companyId } = req.params;

      this.logger.info("getStocksHistory - Request received", {
        companyId,
        correlationId,
      });

      const history = await this.stocksHistoryService.getStocksHistory(
        companyId,
        correlationId
      );

      if (!history) {
        return res.status(404).json("No history found for this Company");
      }

      this.logger.info("getStocksHistory - Successfully Completed", {
        companyId,
        correlationId,
      });
      return res.status(200).json(history);
    } catch (error) {
      this.logger.error("getStocksHistory - Server Error", {
        companyId: req.params.companyId,
        correlationId,
        message: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  createStocksHistory = async (req, res) => {
    const correlationId = uuidv4();
    try {
      const { companyId, date, visitors, shares_price, shares_return } =
        req.body;

      this.logger.info("createStocksHistory - Request received", {
        companyId,
        date,
        correlationId,
      });

      if (!companyId || !date || !visitors || !shares_price || !shares_return) {
        return res.status(400).json({ message: "Missing Data!" });
      }

      const newHistory = await this.stocksHistoryService.createStocksHistory(
        req.body,
        correlationId
      );

      this.logger.info("createStocksHistory - Successfully Completed", {
        newId: newHistory._id,
        correlationId,
      });
      return res.status(201).json(newHistory);
    } catch (error) {
      this.logger.error("createStocksHistory - Server Error", {
        companyId: req.body.companyId,
        correlationId,
        message: error.message,
        stack: error.stack,
      });
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };
}

export default StocksHistoryController;
