import UserStock from "../../db/Schemas/UserStockSchema.js";

class UserStockRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  async addUserStocks(data, correlationId) {
    try {
      this.logger.info(`Adding user stocks: ${JSON.stringify(data)}`, {
        correlationId,
      });
      const userStocks = new UserStock(data);
      const savedStocks = await userStocks.save();

      return savedStocks;
    } catch (error) {
      throw new Error("Failed to add user stocks");
    }
  }

  async updateUserStocks(userId, companyId, data, correlationId) {
    try {
      this.logger.info(
        `Updating user stocks for userId=${userId}, companyId=${companyId}, data=${JSON.stringify(
          data
        )}`,
        { correlationId }
      );
      const userStocks = await UserStock.findOneAndUpdate(
        {
          userId: userId,
          companyId: companyId,
        },
        data
      );

      return userStocks;
    } catch (error) {
      throw new Error("Failed to update user stocks");
    }
  }

  async getAllUserStocks(userId, correlationId) {
    try {
      this.logger.info(`Fetching all user stocks for userId=${userId}`, {
        correlationId,
      });
      const userStocks = await UserStock.find({
        userId: userId,
      }).populate("companyId");

      return userStocks;
    } catch (error) {
      throw new Error("Failed to retrieve all user stocks");
    }
  }

  async getOneUserStocks(userId, companyId, correlationId) {
    try {
      this.logger.info(
        `Fetching user stocks for userId=${userId}, companyId=${companyId}`,
        { correlationId }
      );
      const userStocks = await UserStock.find({
        userId: userId,
        companyId: companyId,
      });

      return userStocks;
    } catch (error) {
      throw new Error(
        "Failed to retrieve user stocks for the specified company"
      );
    }
  }

  async rollbackUserStocks(userStocksId, correlationId) {
    try {
      this.logger.info(
        `Rolling back user stocks for userStocksId=${userStocksId}`,
        { correlationId }
      );
      const userStocks = await UserStock.findByIdAndDelete(userStocksId);
      this.logger.info(
        `Rolled back user stocks successfully for userStocksId=${userStocksId}`,
        { correlationId }
      );
      return userStocks;
    } catch (error) {
      this.logger.error(
        `Error rolling back user stocks for userStocksId=${userStocksId}: ${error.message}`
      );
      throw new Error("Failed to rollback user stocks");
    }
  }

  async deleteUserStocks(data, correlationId) {
    try {
      this.logger.info(
        `Deleting user stocks for userStocksId=${JSON.stringify(data)}`,
        { correlationId }
      );
      await UserStock.deleteMany({
        _id: { $in: data },
      });
      this.logger.info(
        `Deleted user stocks for userStocksId=${JSON.stringify(data)}`,
        { correlationId }
      );
    } catch (error) {
      this.logger.error(
        `Error deleting user stocks for userStocksId=${JSON.stringify(data)}: ${
          error.message
        }`,
        { correlationId }
      );
      throw new Error("Failed to delete user stocks");
    }
  }

  async deleteUserStocksByCompany(companyId, correlationId) {
    try {
      this.logger.info(`Deleting user stocks for companyId=${companyId}`, {
        correlationId,
      });
      await UserStock.deleteMany({
        companyId: companyId,
      });
    } catch (error) {
      throw new Error("Failed to delete user stocks");
    }
  }

  async updateUserStocks(userStocksId, quantity, correlationId) {
    try {
      this.logger.info(
        `Updating user stock quantity for userStocksId=${userStocksId}, newQuantity=${quantity}`,
        { correlationId }
      );
      const userStocks = await UserStock.findByIdAndUpdate(
        userStocksId,
        { quantity },
        { new: true }
      );
      this.logger.info(
        `User stock quantity updated successfully for userStocksId=${userStocksId}, newQuantity=${quantity}`,
        { correlationId }
      );
      return userStocks;
    } catch (error) {
      this.logger.error(
        `Error updating user stock quantity for userStocksId=${userStocksId}: ${error.message}`,
        { correlationId }
      );
      throw new Error("Failed to update user stock quantity");
    }
  }
}

export default UserStockRepo;
