class UserStocksService {
  constructor({
    userStocksRepo,
    userRepo,
    transactionRepo,
    companyRepo,
    userProfitRepo,
    logger,
  }) {
    this.userStocksRepo = userStocksRepo;
    this.userRepo = userRepo;
    this.transactionRepo = transactionRepo;
    this.companyRepo = companyRepo;
    this.userProfitRepo = userProfitRepo;
    this.logger = logger;
  }
  buyStock = async (data, correlationId) => {
    const { userId, companyId, quantity, buy_price } = data;

    let transactionId;
    let userStocksId;
    let userAdjusted = false;
    let companyAdjusted = false;

    try {
      // Validate the user and company
      const existingUser = await this.userRepo.getUserById(
        userId,
        correlationId
      );
      if (!existingUser) throw new Error("this user doesn't exist");

      const existingCompany = await this.companyRepo.getCompany(
        companyId,
        correlationId
      );
      if (!existingCompany) throw new Error("this company doesn't exist");

      const totalBuyPrice = quantity * buy_price;
      const totalTempPrice = quantity * existingCompany.temp_price;
      if (totalBuyPrice > existingUser.wallet_balance) {
        throw new Error(
          "this user doesn't have enough wallet balance to buy this stock"
        );
      }

      // Log transaction initialization
      this.logger.info(
        `Starting buyStock: userId=${userId}, companyId=${companyId}, totalPrice=${totalBuyPrice}, correlationId=${correlationId}`
      );

      // Create a new Buy transaction
      const buyTransaction = {
        userId,
        companyId,
        date: new Date(),
        opening_balance: existingUser.wallet_balance,
        closing_balance: existingUser.wallet_balance - totalBuyPrice,
        quantity,
        type: "Buy",
        price: buy_price,
      };
      const transaction = await this.transactionRepo.addTransaction(
        buyTransaction,
        correlationId
      );
      transactionId = transaction._id;

      // Log transaction creation
      this.logger.debug(
        `Transaction created: transactionId=${transactionId}, correlationId=${correlationId}`
      );

      // Add to user stocks
      const userStocks = await this.userStocksRepo.addUserStocks(
        data,
        correlationId
      );
      userStocksId = userStocks._id;

      // Log user stocks addition
      this.logger.debug(
        `User stocks added: userStocksId=${userStocksId}, transactionId=${transactionId}, correlationId=${correlationId}`
      );

      // Update user after transaction
      const updatedUser = await this.userRepo.updateAfterTransaction(
        "Buy",
        totalBuyPrice,
        userId,
        0,
        totalTempPrice,
        correlationId
      );
      userAdjusted = true;

      // Log user update
      this.logger.debug(
        `User updated: userId=${userId}, walletAdjustedBy=${totalBuyPrice}, correlationId=${correlationId}`
      );

      // Update company after transaction
      await this.companyRepo.updateAfterTransaction(
        "Buy",
        companyId,
        correlationId
      );
      companyAdjusted = true;

      // Log company update
      this.logger.debug(
        `Company updated: companyId=${companyId}, correlationId=${correlationId}`
      );

      return updatedUser;
    } catch (error) {
      if (userAdjusted) {
        await this.userRepo.rollbackAfterTransaction(
          "Buy",
          totalBuyPrice,
          userId,
          correlationId
        );
        this.logger.debug(
          `Rollback: User update reverted for userId=${userId}, correlationId=${correlationId}`
        );
      }

      if (companyAdjusted) {
        await this.companyRepo.rollbackAfterTransaction(
          "Buy",
          companyId,
          correlationId
        );
        this.logger.debug(
          `Rollback: Company update reverted for companyId=${companyId}, correlationId=${correlationId}`
        );
      }

      if (transactionId) {
        await this.transactionRepo.deleteTransaction(
          transactionId,
          correlationId
        );
        this.logger.debug(
          `Rollback: Transaction deleted for transactionId=${transactionId}, correlationId=${correlationId}`
        );
      }

      if (userStocksId) {
        await this.userStocksRepo.rollbackUserStocks(
          userStocksId,
          quantity,
          correlationId
        );
        this.logger.debug(
          `Rollback: User stocks reverted for userStocksId=${userStocksId}, correlationId=${correlationId}`
        );
      }

      throw new Error("Error buying the stock, transaction rolled back");
    }
  };

  sellStock = async (data, correlationId) => {
    const { userId, companyId, quantity } = data;

    let deletedUserStocks = [];
    let adjustedUserStock;
    let totalShares = 0;
    let buy_price = 0;

    this.logger.info(
      `Processing sellStock: userId=${userId}, companyId=${companyId}, quantity=${quantity}`,
      { correlationId }
    );

    try {
      // Validate user and company existence
      const existingUser = await this.userRepo.getUserById(
        userId,
        correlationId
      );
      if (!existingUser) throw new Error("User does not exist");

      const existingCompany = await this.companyRepo.getCompany(
        companyId,
        correlationId
      );
      if (!existingCompany) throw new Error("Company does not exist");

      // Retrieve user's stocks for the specified company
      const existingUserStocks = await this.userStocksRepo.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );
      if (!existingUserStocks || existingUserStocks.length === 0)
        throw new Error("User has no shares in this company");

      let sell_price = 0;
      // Determine stocks to delete or adjust
      for (const stock of existingUserStocks) {
        if (totalShares + stock.quantity <= quantity) {
          totalShares += stock.quantity;
          buy_price += stock.buy_price * stock.quantity;
          deletedUserStocks.push(stock._id);

          this.logger.debug(
            `the result of date comparison is: ${
              new Date(stock.createdAt).toDateString() ===
              new Date().toDateString()
            } for quantity: ${totalShares}`,
            { correlationId }
          );

          if (
            new Date(stock.createdAt).toDateString() ===
            new Date().toDateString()
          ) {
            sell_price += existingCompany.temp_price * stock.quantity;
          } else {
            sell_price += existingCompany.current_price * stock.quantity;
          }
        } else if (totalShares !== quantity) {
          const remainder = quantity - totalShares;
          totalShares += remainder;
          buy_price += stock.buy_price * remainder;
          adjustedUserStock = {
            _id: stock._id,
            quantity: stock.quantity - remainder,
          };

          if (
            new Date(stock.createdAt).toDateString() ===
            new Date().toDateString()
          ) {
            sell_price += existingCompany.temp_price * remainder;
          } else {
            sell_price += existingCompany.current_price * remainder;
          }

          break;
        }
      }

      if (totalShares < quantity)
        throw new Error("User does not have enough shares to sell");

      const profit = sell_price - buy_price;

      // Record sell transaction
      const sellTransaction = {
        userId,
        companyId,
        date: new Date(),
        opening_balance: existingUser.wallet_balance,
        closing_balance: existingUser.wallet_balance + sell_price,
        quantity,
        type: "Sell",
        price: sell_price,
        profit,
      };

      await this.transactionRepo.addTransaction(sellTransaction, correlationId);
      this.logger.debug(
        `Sell transaction recorded: userId=${userId}, companyId=${companyId}, quantity=${quantity}, sellPrice=${sell_price}, profit=${profit}`,
        { correlationId }
      );

      // Handle stocks: delete or adjust
      if (deletedUserStocks.length > 0) {
        await this.userStocksRepo.deleteUserStocks(
          deletedUserStocks,
          correlationId
        );
        this.logger.debug(
          `Deleted user stocks: ${JSON.stringify(deletedUserStocks)}`,
          { correlationId }
        );
      }

      if (adjustedUserStock) {
        await this.userStocksRepo.updateUserStocks(
          adjustedUserStock._id,
          adjustedUserStock.quantity,
          correlationId
        );
        this.logger.debug(
          `Adjusted user stock: stockId=${adjustedUserStock._id}, newQuantity=${adjustedUserStock.quantity}`,
          { correlationId }
        );
      }

      // Record profit
      await this.userProfitRepo.addUserProfit({
        userId,
        companyId,
        profit,
        investedAmount: buy_price,
        correlationId,
      });
      this.logger.debug(
        `User profit recorded: userId=${userId}, companyId=${companyId}, profit=${profit}, investedAmount=${buy_price}`,
        { correlationId }
      );

      // Update user wallet balance
      await this.userRepo.updateAfterTransaction(
        "Sell",
        sell_price,
        userId,
        profit,
        correlationId
      );
      this.logger.debug(`Updated user wallet balance: userId=${userId}`, {
        correlationId,
      });

      // Update company transaction count
      await this.companyRepo.updateAfterTransaction(
        "Sell",
        companyId,
        correlationId
      );
      this.logger.debug(
        `Updated company transaction count: companyId=${companyId}`,
        { correlationId }
      );

      const updatedUser = await this.userRepo.getUserById(
        userId,
        correlationId
      );
      this.logger.info(`Completed sellStock process for userId=${userId}`, {
        correlationId,
      });
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Error in sellStock: userId=${userId}, companyId=${companyId}, error=${error.message}`,
        { correlationId }
      );
      throw new Error("Failed to process sell transaction");
    }
  };

  addUserStocks = async (data, correlationId) => {
    const { userId, companyId } = data;

    try {
      const existingUserStocks = await this.userStocksRepo.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );

      let userStocks;

      if (existingUserStocks) {
        this.logger.debug(
          `Existing stocks found for userId=${userId}, companyId=${companyId}. Updating stocks.`
        );
        userStocks = await this.userStocksRepo.updateUserStocks(
          userId,
          companyId,
          data,
          correlationId
        );
        this.logger.info(
          `User stocks updated: userId=${userId}, companyId=${companyId}`
        );
      } else {
        this.logger.debug(
          `No existing stocks found for userId=${userId}, companyId=${companyId}. Adding new stocks.`
        );
        userStocks = await this.userStocksRepo.addUserStocks(
          data,
          correlationId
        );
        this.logger.info(
          `User stocks added: userId=${userId}, companyId=${companyId}`
        );
      }

      return userStocks;
    } catch (error) {
      throw new Error("Failed to add or update user stocks");
    }
  };

  addUserStocks = async (data, correlationId) => {
    const { userId, companyId } = data;
    try {
      const existingUserStocks = await this.userStocksRepo.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );

      let userStocks;

      if (existingUserStocks) {
        this.logger.debug(
          `Existing user stocks found for userId=${userId}, companyId=${companyId}. Updating stocks.`,
          { correlationId }
        );
        userStocks = await this.userStocksRepo.updateUserStocks(
          userId,
          companyId,
          data,
          correlationId
        );
        this.logger.info(
          `User stocks successfully updated for userId=${userId}, companyId=${companyId}`,
          { correlationId }
        );
      } else {
        this.logger.debug(
          `No existing stocks found for userId=${userId}, companyId=${companyId}. Adding new stocks.`,
          { correlationId }
        );
        userStocks = await this.userStocksRepo.addUserStocks(
          data,
          correlationId
        );
        this.logger.info(
          `New user stocks successfully added for userId=${userId}, companyId=${companyId}`,
          { correlationId }
        );
      }

      return userStocks;
    } catch (error) {
      throw new Error("Failed to add or update user stocks");
    }
  };

  updateUserStocks = async (data, correlationId) => {
    const { userId, companyId } = data;

    try {
      const existingUserStocks = await this.userStocksRepo.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );

      if (!existingUserStocks) {
        throw new Error("This user has no stocks in the company");
      }

      const userStocks = await this.userStocksRepo.updateUserStocks(
        userId,
        companyId,
        data,
        correlationId
      );

      return userStocks;
    } catch (error) {
      throw new Error("Failed to update user stocks");
    }
  };

  getAllUserStocks = async (userId, correlationId) => {
    try {
      const userStocks = await this.userStocksRepo.getAllUserStocks(
        userId,
        correlationId
      );

      return userStocks;
    } catch (error) {
      throw new Error("Failed to retrieve all user stocks");
    }
  };

  getOneUserStocks = async (userId, companyId, correlationId) => {
    try {
      const userStocks = await this.userStocksRepo.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );

      return userStocks;
    } catch (error) {
      throw new Error(
        "Failed to retrieve user stocks for the specified company"
      );
    }
  };
}

export default UserStocksService;
