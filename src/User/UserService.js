import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const maleAvatarsPath = path.resolve(__dirname, "../../images/avatars/male");
const femaleAvatarsPath = path.resolve(
  __dirname,
  "../../images/avatars/female"
);
class UserService {
  constructor({ userRepo, userProfitRepo, transactionRepo, logger }) {
    this.userRepo = userRepo;
    this.userProfitRepo = userProfitRepo;
    this.transactionRepo = transactionRepo;
    this.logger = logger;
  }

  register = async (req, correlationId) => {
    const { username } = req.body;

    try {
      const existingUser = await this.userRepo.getUserByUsername(
        username,
        correlationId
      );
      if (existingUser) {
        throw new Error("this username is invalid");
      }

      const newUser = await this.userRepo.addUser(req.body, correlationId);

      return newUser;
    } catch (error) {
      throw error;
    }
  };

  login = async (req, correlationId) => {
    const { username, password } = req.body;

    try {
      const user = await this.userRepo.getUser(
        username,
        password,
        correlationId
      );

      if (user) {
        return user;
      }

      throw new Error("Invalid Credentials");
    } catch (error) {
      throw error;
    }
  };

  getUserByUsername = async (username, correlationId) => {
    try {
      const user = await this.userRepo.getUserByUsername(
        username,
        correlationId
      );

      if (user) {
        return user;
      }

      return null;
    } catch (error) {
      throw error;
    }
  };

  getUserLeaderboards = async (limit, correlationId) => {
    try {
      const highestNumberOfTrades =
        await this.userRepo.getHighestNumberOfTrades(limit, correlationId);
      const highestReturn = await this.userProfitRepo.getHighestReturn(
        limit,
        correlationId
      );
      const biggestInvestment = await this.userRepo.getBiggestInvestment(
        limit,
        correlationId
      );

      const leaderboards = {
        highestNumberOfTrades,
        highestReturn,
        biggestInvestment,
      };

      return leaderboards;
    } catch (error) {
      throw error;
    }
  };

  getAllAvatars = async (type, correlationId) => {
    try {
      let avatars;

      this.logger.info("Attempting to fetch avatars from respective folder", {
        correlationId,
        type,
      });

      if (type === "male") {
        avatars = await fs.readdir(maleAvatarsPath);
      } else {
        avatars = await fs.readdir(femaleAvatarsPath);
      }

      return avatars.map((file) => `/images/avatars/${type}/${file}`);
    } catch (error) {
      throw new Error("Failed to fetch avatars.");
    }
  };

  getAllUsers = async (searchQuery, page, correlationId) => {
    try {
      const users = await this.userRepo.getAllUsers(
        searchQuery,
        page,
        correlationId
      );

      return users;
    } catch (error) {
      throw error;
    }
  };

  updateBalance = async (balance, userId, correlationId) => {
    try {
      if (!userId) {
        throw new Error("Invalid userId: cannot be null or undefined");
      }

      const newBalance = Number(balance);
      const user = await this.userRepo.updateBalance(
        newBalance,
        userId,
        correlationId
      );

      return user;
    } catch (error) {
      throw error;
    }
  };
}

export default UserService;
