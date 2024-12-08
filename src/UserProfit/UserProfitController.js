import { v4 as uuidv4 } from "uuid";
class UserProfitController {
  constructor({ userProfitService, logger }) {
    this.userProfitService = userProfitService;
    this.logger = logger;
  }

  getAllUserProfit = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    try {
      this.logger.info("getAllUserProfit - Request received", {
        correlationId,
      });
      const { userId } = req.params;

      if (!userId) {
        this.logger.error("getAllUserProfit - userId is required", {
          correlationId,
        });
        return res.status(400).json({ error: "user is required" });
      }

      const userProfits = await this.userProfitService.getAllUserProfit(
        userId,
        correlationId
      );

      if (!userProfits) {
        return res.status(404).json({ error: "This User has no profits" });
      }

      this.logger.info("getAllUserProfit - Successfully Completed", {
        correlationId,
      });

      res.status(200).json(userProfits);
    } catch (error) {
      this.logger.error("getAllUserProfit - Failed to retrieve user profits", {
        correlationId,
        message: error.message,
        error: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
}

export default UserProfitController;
