import Transaction from "../../db/Schemas/TransactionSchema.js";
class TransactionRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  async addTransaction(data, correlationId) {
    try {
      this.logger.info("addTransaction - Adding a new transaction to the DB", {
        correlationId,
        data,
      });

      const transaction = new Transaction(data);
      const savedTransaction = await transaction.save();

      return savedTransaction;
    } catch (error) {
      throw error;
    }
  }

  async getAllTransactions(correlationId) {
    try {
      this.logger.info(
        "getAllTransactions - Fetching all transactions from the DB",
        {
          correlationId,
        }
      );
      const transactions = await Transaction.find();

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  async deleteTransaction(transactionId, correlationId) {
    try {
      this.logger.info("deleteTransaction - Deleting transaction from the DB", {
        correlationId,
        transactionId,
      });
      const deletedTransaction = await Transaction.findByIdAndDelete(
        transactionId
      );

      return deletedTransaction;
    } catch (error) {
      throw error;
    }
  }

  async getTransactions(page, order, type, correlationId) {
    try {
      const pageNumber = page ? page : 1;
      const pageSize = 10; // Number of records per page
      const skip = (pageNumber - 1) * pageSize; // Calculate the number of records to skip
      const sortOrder = order === "asc" ? 1 : -1; // Determine the sort order (ascending or descending)

      this.logger.info("getBuyTransactions - Fetching buy transactions", {
        correlationId,
        pageNumber,
        order,
      });

      // Get the total number of records in the collection
      const totalRecords = await Transaction.countDocuments({ type: type });

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalRecords / pageSize);

      // Fetch the paginated and sorted records
      const transactions = await Transaction.find({ type: type })
        .sort({ date: sortOrder }) // Sort by the `date` field
        .skip(skip) // Skip records for pagination
        .limit(pageSize) // Limit the number of records to the page size
        .populate("companyId", "acronym"); // Populate only the `acronym` field of `companyId`

      return {
        transactions, // The fetched transactions
        totalRecords, // Total number of records
        totalPages, // Total number of available pages
      };
    } catch (error) {
      this.logger.error("Error fetching buy transactions", {
        correlationId,
        error: error.message,
      });
      throw error;
    }
  }
}

export default TransactionRepo;
