import UserProfit from "../../db/Schemas/UserProfitSchema.js";

class UserProfitRepo {
  constructor({ logger }) {
    this.logger = logger;
  }

  async addUserProfit(data, correlationId) {
    try {
      this.logger.info("Searching for existing userProfit record", {
        correlationId,
        userId: data.userId,
        companyId: data.companyId,
      });

      const existingUserProfit = await UserProfit.findOne({
        userId: data.userId,
        companyId: data.companyId,
      });

      if (existingUserProfit) {
        this.logger.info("Record Found - Updating", {
          correlationId,
          profit: data.profit,
          investedAmount: data.investedAmount,
        });

        existingUserProfit.profit += data.profit;
        existingUserProfit.investedAmount += data.investedAmount;
        return await existingUserProfit.save();
      } else {
        this.logger.info("Record Not Found - Creating new Record", {
          correlationId,
          data,
        });

        const newUserProfit = new UserProfit(data);
        return await newUserProfit.save();
      }
    } catch (error) {
      throw error;
    }
  }

  // Retrieves all user profits for a given user
  async getAllUserProfit(userId, correlationId) {
    try {
      this.logger.info("Retrieving all userProfit records for user", {
        correlationId,
        Id: userId,
      });
      const userProfits = await UserProfit.find({ userId }).populate(
        "companyId"
      );
      return userProfits;
    } catch (error) {
      throw error;
    }
  }

  // Gets the top users by highest return on investment (ROI)
  async getHighestReturn(limit, correlationId) {
    try {
      this.logger.info("Get Top Users with highest return", {
        correlationId,
        limit,
      });

      const parsedLimit = parseInt(limit, 10);

      const topUsers = await UserProfit.aggregate([
        {
          $group: {
            _id: "$userId",
            totalProfit: { $sum: "$profit" },
            totalInvestedAmount: { $sum: "$investedAmount" },
          },
        },
        {
          $addFields: {
            avgROI: {
              $cond: [
                { $gt: ["$totalInvestedAmount", 0] },
                {
                  $multiply: [
                    { $divide: ["$totalProfit", "$totalInvestedAmount"] },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { avgROI: -1 } },
        { $limit: parsedLimit },
        {
          $project: {
            userId: "$_id",
            totalProfit: 1,
            totalInvestedAmount: 1,
            avgROI: 1,
          },
        },
      ]);

      // Populate user details in the top users
      const populatedUsers = await UserProfit.populate(topUsers, {
        path: "userId",
        select: "first_name last_name avatar",
      });

      // Flatten the result to include user info
      return populatedUsers.map((user) => ({
        first_name: user.userId.first_name,
        last_name: user.userId.last_name,
        avatar: user.userId.avatar,
        totalProfit: user.totalProfit,
        totalInvestedAmount: user.totalInvestedAmount,
        avgROI: user.avgROI,
      }));
    } catch (error) {
      throw error; // Propagate the error to be handled by the controller
    }
  }
}

export default UserProfitRepo;
