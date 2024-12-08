import { v4 as uuidv4 } from "uuid";

class TransactionController {
  constructor({ transactionService, logger }) {
    this.transactionService = transactionService;
    this.logger = logger;
  }

  getTransactions = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { type, page, order } = req.query;

    this.logger.info("getTransactions - Request received", {
      correlationId,
      action: "getTransactions",
    });

    try {
      const buyTransactions = await this.transactionService.getTransactions(
        type,
        page,
        order,
        correlationId
      );
      this.logger.info(
        "getTransactions - Successfully fetched all usertransactions",
        {
          correlationId,
          transactionsCount: buyTransactions.length,
          page,
          order,
          type,
        }
      );
      res.status(200).json(buyTransactions);
    } catch (error) {
      this.logger.error(
        "getTransactions - Error fetching all user transactions",
        {
          correlationId,
          error: error.message,
          stack: error.stack,
        }
      );
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
}

export default TransactionController;
