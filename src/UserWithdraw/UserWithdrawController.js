import { v4 as uuidv4 } from "uuid";

class UserWithdrawController {
  constructor({ userWithdrawService, logger }) {
    this.userWithdrawService = userWithdrawService;
    this.logger = logger;
  }

  addUserWithdraw = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    this.logger.info("addUserWithdraw - Request received", {
      correlationId,
      userId: req.body.userId,
      action: "addUserWithdraw",
    });

    try {
      const userWithdraws = await this.userWithdrawService.addUserWithdraw(
        req.body,
        correlationId
      );
      this.logger.info("addUserWithdraw - User withdrawal added successfully", {
        correlationId,
        userWithdrawId: userWithdraws._id,
      });
      res.status(200).json(userWithdraws);
    } catch (error) {
      this.logger.error("addUserWithdraw - Error processing user withdrawal", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getAllUserWithdraws = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { page, order } = req.query;

    this.logger.info("getAllUserWithdraws - Request received", {
      correlationId,
      action: "getAllUserWithdraws",
    });

    try {
      const userWithdraws = await this.userWithdrawService.getAllUserWithdraws(
        page,
        order,
        correlationId
      );
      this.logger.info(
        "getAllUserWithdraws - Successfully fetched all user withdrawals",
        {
          correlationId,
        }
      );
      res.status(200).json(userWithdraws);
    } catch (error) {
      this.logger.error(
        "getAllUserWithdraws - Error fetching all user withdrawals",
        {
          correlationId,
          error: error.message,
          stack: error.stack,
        }
      );
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getOneUserWithdraws = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { userId } = req.params;

    this.logger.info("getOneUserWithdraws - Request received", {
      correlationId,
      userId,
      action: "getOneUserWithdraws",
    });

    if (!userId) {
      this.logger.warn("getOneUserWithdraws - userId parameter is missing", {
        correlationId,
      });
      return res.status(400).json({ error: "user is required" });
    }

    try {
      const userWithdraws = await this.userWithdrawService.getOneUserWithdraws(
        userId,
        correlationId
      );
      this.logger.info(
        "getOneUserWithdraws - Successfully fetched withdrawals for user",
        {
          correlationId,
          userId,
          withdrawalsCount: userWithdraws.length,
        }
      );
      res.status(200).json(userWithdraws);
    } catch (error) {
      this.logger.error(
        "getOneUserWithdraws - Error fetching user withdrawals",
        {
          correlationId,
          userId,
          error: error.message,
          stack: error.stack,
        }
      );
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
}

export default UserWithdrawController;
