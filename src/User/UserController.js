import { v4 as uuidv4 } from "uuid";
class UserController {
  constructor({ userService, logger }) {
    this.userService = userService;
    this.logger = logger;
  }

  register = async (req, res) => {
    const { username } = req.body;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("register - Request received", {
        correlationId,
        username,
      });
      const user = await this.userService.register(req, correlationId);

      this.logger.info("register - Successfully registered a new user", {
        correlationId,
        username,
        userId: user._id,
      });
      res.status(201).json(user);
    } catch (error) {
      this.logger.error("register - Failed to register user", {
        correlationId,
        username,
        error: error.stack,
      });

      if (error.message === "this username is invalid") {
        return res.status(409).json({ error: "this username is invalid" });
      }
      res.status(500).json({ error: "an unexpected error occurred" });
    }
  };

  login = async (req, res) => {
    const { username } = req.body;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("login - Request received", { correlationId, username });
      const user = await this.userService.login(req, correlationId);

      this.logger.info("login - Successfully logged in user", {
        correlationId,
        username,
        userId: user._id,
      });
      res.status(200).json(user);
    } catch (error) {
      this.logger.error("login - Failed to login user", {
        correlationId,
        username,
        error: error.stack,
      });

      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("getUserByUsername - Request received", {
        correlationId,
        username,
      });

      if (!username) {
        this.logger.error(
          "getUserByUsername - Username parameter is missing in the request",
          {
            correlationId,
          }
        );
        return res
          .status(400)
          .json({ error: "Username parameter is required" });
      }

      const user = await this.userService.getUserByUsername(
        username,
        correlationId
      );

      if (!user) {
        this.logger.error("getUserByUsername - No user found with username", {
          correlationId,
          username,
        });
        return res.status(404).json({ error: "User not found" });
      }

      this.logger.info("getUserByUsername - User found", {
        correlationId,
        username,
      });
      res.status(200).json(user);
    } catch (error) {
      this.logger.error("getUserByUsername - Server Error", {
        correlationId,
        username,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getUserLeaderboards = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { limit } = req.params;
    try {
      this.logger.info("getUserLeaderboards - Request received", {
        correlationId,
        limit,
      });

      const leaderboards = await this.userService.getUserLeaderboards(
        limit,
        correlationId
      );

      this.logger.info("getUserLeaderboards - Successfully fetched", {
        correlationId,
        limit,
      });

      res.status(200).json(leaderboards);
    } catch (error) {
      this.logger.error("getUserLeaderboards - Server Error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  };

  getAllAvatars = async (req, res) => {
    const { type } = req.params;
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    try {
      this.logger.info("getAllAvatars - Request Received", {
        correlationId,
        type,
      });

      const avatars = await this.userService.getAllAvatars(type, correlationId);

      this.logger.info("getAllAvatars - Successfully fetched avatars", {
        correlationId,
        type,
        avatarsCount: avatars.length,
      });

      res.status(200).json({ success: true, avatars });
    } catch (error) {
      this.logger.error("getAllAvatars - Server Error", {
        correlationId,
        type,
        error: error.message,
        stack: error.stack,
      });

      res
        .status(500)
        .json({ success: false, message: "Failed to fetch avatars." });
    }
  };

  getAllUsers = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { searchQuery, page } = req.query;

    try {
      this.logger.info("getAllUsers - Request Received", {
        correlationId,
        searchQuery,
        page,
      });

      const users = await this.userService.getAllUsers(
        searchQuery,
        page,
        correlationId
      );

      this.logger.info("getAllUsers - Successfully fetched users", {
        correlationId,
      });

      res.status(200).json(users);
    } catch (error) {
      this.logger.error("getAllUsers - Server Error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });

      res
        .status(500)
        .json({ success: false, message: "Failed to fetch users." });
    }
  };

  updateBalance = async (req, res) => {
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { balance, userId } = req.body;

    try {
      this.logger.info("updateBalance - Request Received", {
        correlationId,
        balance,
        userId,
      });

      const users = await this.userService.updateBalance(
        balance,
        userId,
        correlationId
      );

      this.logger.info("updateBalance - Successfully updated user's balance", {
        correlationId,
        userId,
        balance,
      });

      res.status(200).json(users);
    } catch (error) {
      this.logger.error("updateBalance - Server Error", {
        correlationId,
        error: error.message,
        stack: error.stack,
      });

      res
        .status(500)
        .json({ success: false, message: "Failed to update user's balance." });
    }
  };
}

export default UserController;
