import cron from "node-cron";
import User from "../../db/Schemas/UserSchema.js";
import UserStock from "../../db/Schemas/UserStockSchema.js";
import UserProfit from "../../db/Schemas/UserProfitSchema.js";
import logger from "../util/logger.js";

// Monthly Task: Update previousBalance
const updateMonthlyBalances = async () => {
  logger.info("running Monthly user balance update job", {
    date: new Date(),
  });
  try {
    logger.debug("Retrieving all users available");
    const users = await User.find({});
    logger.debug(`Retrieved ${users.length} users successfully`);
    logger.debug(`Bulk Updating Users' balances`);
    const bulkOps = users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: { previous_balance: user.wallet_balance + user.stock_balance },
        },
      },
    }));
    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
      logger.info(`Successfully updates all users' balances`);
    }
  } catch (err) {
    logger.error("Failed to update users' previous balances!", {
      date: new Date(),
      message: error.message,
      stack: error.stack,
    });
    console.error("Error in Monthly Task:", err);
  }
};

// Daily Task: Update stock balances
const updateDailyStockBalances = async () => {
  logger.info("running Daily user Stocks update job", {
    date: new Date(),
  });
  try {
    logger.debug("Retrieving all users available");
    const users = await User.find({});
    logger.debug(`Retrieved ${users.length} users successfully`);
    for (const user of users) {
      const userStocks = await UserStock.find({ userId: user._id }).populate(
        "companyId"
      );
      const userProfits = await UserProfit.find({
        userId: user._id,
      });

      logger.debug(`Retrieved ${userStocks.length} user stocks successfully`);
      logger.debug(`Retrieved ${userProfits.length} user profits successfully`);

      const stockBalance = userStocks.reduce(
        (sum, stock) => sum + stock.companyId.current_price * stock.quantity,
        0
      );
      const ProfitMade = userProfits.reduce(
        (sum, profit) => sum + profit.profit,
        0
      );

      await User.updateOne(
        { _id: user._id },
        {
          $set: { stock_balance: stockBalance, total_profit: ProfitMade },
        }
      );
    }
    logger.info(
      `Successfully updates all users' stock balances & profits made`
    );
  } catch (err) {
    logger.error("Failed to update users' stock balance & profits made!", {
      date: new Date(),
      message: error.message,
      stack: error.stack,
    });
    console.error("Error in Daily Task:", err);
  }
};

// Define cron jobs
export const startCronJobs = () => {
  // Run the monthly task on the 1st of every month at midnight
  cron.schedule("0 0 1 * *", updateMonthlyBalances);

  // Run the daily task every day at midnight
  cron.schedule("0 0 * * *", updateDailyStockBalances);

  console.log("Cron jobs initialized.");
};
