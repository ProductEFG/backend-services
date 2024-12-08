import UserWithdraw from "../../db/Schemas/UserWithdrawSchema.js";

class UserWithdrawRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  async addUserWithdraw(data, correlationId) {
    this.logger.info(
      "addUserWithdraw - Adding a new user withdrawal to the DB",
      {
        correlationId,
        data,
      }
    );

    try {
      const userWithdraw = new UserWithdraw(data);
      const savedUserWithdraw = await userWithdraw.save();
      this.logger.info(
        "addUserWithdraw - User withdrawal successfully added to DB",
        {
          correlationId,
          userWithdrawId: savedUserWithdraw._id,
        }
      );
      return savedUserWithdraw;
    } catch (error) {
      this.logger.error(
        "addUserWithdraw - Error adding user withdrawal - Repo",
        {
          correlationId,
          data,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }

  // Get all user withdrawals
  async getAllUserWithdraws(page, order, correlationId) {
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
      const totalRecords = await UserWithdraw.countDocuments();

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalRecords / pageSize);

      // Fetch the paginated and sorted records
      const withdraws = await UserWithdraw.find()
        .sort({ date: sortOrder }) // Sort by the `date` field
        .skip(skip) // Skip records for pagination
        .limit(pageSize); // Limit the number of records to the page size

      return {
        withdraws, // The fetched transactions
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

  async getOneUserWithdraws(userId, correlationId) {
    this.logger.info(
      "getOneUserWithdraws - Fetching user withdrawals by userId from the DB",
      {
        correlationId,
        userId,
      }
    );

    try {
      const userWithdraws = await UserWithdraw.find({ userId: userId }).sort({
        date: -1,
      });
      this.logger.info(
        "getOneUserWithdraws - Successfully fetched user withdrawals by userId",
        {
          correlationId,
          userId,
          withdrawalsCount: userWithdraws.length,
        }
      );
      return userWithdraws;
    } catch (error) {
      this.logger.error(
        "getOneUserWithdraws - Error fetching user withdrawals by userId - Repo",
        {
          correlationId,
          userId,
          error: error.message,
          stack: error.stack,
        }
      );
      throw error;
    }
  }
}

export default UserWithdrawRepo;
