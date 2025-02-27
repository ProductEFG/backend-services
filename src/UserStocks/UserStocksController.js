import { v4 as uuidv4 } from "uuid";

class UserStocksController {
  constructor({ userStocksService, logger }) {
    this.userStocksService = userStocksService;
    this.logger = logger;
  }

  buyStock = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("buyStock - Request received", {
      correlationId,
      body: req.body,
    });
    try {
      const updatedUser = await this.userStocksService.buyStock(
        req.body,
        correlationId
      );
      this.logger.info("buyStock - Success", { correlationId, updatedUser });
      res.status(201).json(updatedUser);
    } catch (error) {
      this.logger.error("buyStock - Error occurred", {
        correlationId,
        error: error.message,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  sellStock = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("sellStock - Request received", {
      correlationId,
      body: req.body,
    });
    try {
      const data = await this.userStocksService.sellStock(
        req.body,
        correlationId
      );
      this.logger.info("sellStock - Success", { correlationId, data });
      res.status(201).json(data);
    } catch (error) {
      this.logger.error("sellStock - Error occurred", {
        correlationId,
        error: error.message,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  addUserStocks = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("addUserStocks - Request received", {
      correlationId,
      body: req.body,
    });
    try {
      const userStocks = await this.userStocksService.addUserStocks(
        req.body,
        correlationId
      );
      this.logger.info("addUserStocks - Success", {
        correlationId,
        userStocks,
      });
      res.status(201).json(userStocks);
    } catch (error) {
      this.logger.error("addUserStocks - Error occurred", {
        correlationId,
        error: error.message,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  updateUserStocks = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("updateUserStocks - Request received", {
      correlationId,
      body: req.body,
    });
    try {
      const userStocks = await this.userStocksService.updateUserStocks(
        req.body,
        correlationId
      );
      this.logger.info("updateUserStocks - Success", {
        correlationId,
        userStocks,
      });
      res.status(200).json(userStocks);
    } catch (error) {
      this.logger.error("updateUserStocks - Error occurred", {
        correlationId,
        error: error.message,
      });
      if (error.message === "This user has no stocks in the company") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getAllUserStocks = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("getAllUserStocks - Request received", {
      correlationId,
      params: req.params,
    });
    try {
      const { userId } = req.params;

      if (!userId) {
        this.logger.warn("getAllUserStocks - Missing userId", {
          correlationId,
        });
        return res.status(400).json({ error: "user is required" });
      }

      const userStocks = await this.userStocksService.getAllUserStocks(
        userId,
        correlationId
      );

      if (!userStocks) {
        this.logger.info("getAllUserStocks - No stocks found for user", {
          correlationId,
          userId,
        });
        return res.status(404).json({ error: "This User has no stocks" });
      }

      this.logger.info("getAllUserStocks - Success", {
        correlationId,
        count: userStocks.length,
      });
      res.status(200).json(userStocks);
    } catch (error) {
      this.logger.error("getAllUserStocks - Error occurred", {
        correlationId,
        error: error.message,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getOneUserStocks = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    this.logger.info("getOneUserStocks - Request received", {
      correlationId,
      query: req.query,
    });
    try {
      const { userId, companyId } = req.query;

      if (!userId || !companyId) {
        this.logger.warn("getOneUserStocks - Missing parameters", {
          correlationId,
          userId,
          companyId,
        });
        return res.status(400).json({ error: "user and company are required" });
      }

      const userStocks = await this.userStocksService.getOneUserStocks(
        userId,
        companyId,
        correlationId
      );

      if (!userStocks) {
        this.logger.info("getOneUserStocks - No shares found", {
          correlationId,
          userId,
          companyId,
        });
        return res
          .status(404)
          .json({ error: "This User has no shares in this company" });
      }

      this.logger.info("getOneUserStocks - Success", {
        correlationId,
      });
      res.status(200).json(userStocks);
    } catch (error) {
      this.logger.error("getOneUserStocks - Error occurred", {
        correlationId,
        error: error.message,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };
}

export default UserStocksController;
