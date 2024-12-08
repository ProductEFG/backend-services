class TransactionService {
  constructor({ transactionRepo, logger }) {
    this.transactionRepo = transactionRepo;
    this.logger = logger;
  }

  getTransactions = async (type, page, order, correlationId) => {
    this.logger.info(
      "getTransactions - Service layer: Fetching all user transactions",
      {
        correlationId,
        type,
        page,
        order,
      }
    );

    try {
      const transactions = await this.transactionRepo.getTransactions(
        page,
        order,
        type,
        correlationId
      );

      return transactions;
    } catch (error) {
      throw error;
    }
  };
}

export default TransactionService;
