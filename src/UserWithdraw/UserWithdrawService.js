class UserWithdrawService {
  constructor({ userWithdrawRepo, userRepo, logger }) {
    this.userWithdrawRepo = userWithdrawRepo;
    (this.userRepo = userRepo), (this.logger = logger);
  }

  // Add a new user withdrawal
  addUserWithdraw = async (data, correlationId) => {
    this.logger.info(
      "addUserWithdraw - Service layer: Adding user withdrawal",
      {
        correlationId,
        data,
      }
    );

    const { userId, withdraw_amount } = data;
    try {
      this.logger.info(
        "addUserWithdraw - Checking if the user has enough funds for the withdrawal",
        {
          correlationId,
          userWithdrawId: userId,
        }
      );
      const existingUser = await this.userRepo.getUserById(
        userId,
        correlationId
      );

      if (existingUser.wallet_balance < withdraw_amount) {
        throw new Error("Not enough funds to complete transaction");
      }

      this.logger.info(
        "addUserWithdraw - User has enough funds commencing withdrawal",
        {
          correlationId,
          userWithdrawId: userId,
        }
      );

      const opening_balance = existingUser.wallet_balance;
      const closing_balance = existingUser.wallet_balance - withdraw_amount;

      await this.userWithdrawRepo.addUserWithdraw(
        { ...data, opening_balance, closing_balance },
        correlationId
      );

      const updatedUser = await this.userRepo.updateAfterWithdrawal(
        userId,
        withdraw_amount
      );

      this.logger.info(
        "addUserWithdraw - User withdrawal successfully added in Service",
        {
          correlationId,
          opening_balance,
          closing_balance,
          withdraw_amount,
          user: updatedUser._id,
        }
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Get all user withdrawals
  getAllUserWithdraws = async (page, order, correlationId) => {
    this.logger.info(
      "getAllUserWithdraws - Service layer: Fetching all user withdrawals",
      {
        correlationId,
        page,
        order,
      }
    );

    try {
      const userWithdraws = await this.userWithdrawRepo.getAllUserWithdraws(
        page,
        order,
        correlationId
      );

      return userWithdraws;
    } catch (error) {
      throw error;
    }
  };

  getOneUserWithdraws = async (userId, correlationId) => {
    this.logger.info(
      "getOneUserWithdraws - Service layer: Fetching withdrawals by userId",
      {
        correlationId,
        userId,
      }
    );

    try {
      const userWithdraws = await this.userWithdrawRepo.getOneUserWithdraws(
        userId,
        correlationId
      );

      this.logger.info(
        "getOneUserWithdraws - Successfully fetched user withdrawals by userId in Service",
        {
          correlationId,
          userId,
          withdrawalsCount: userWithdraws.length,
        }
      );

      return userWithdraws;
    } catch (error) {
      throw error;
    }
  };
}

export default UserWithdrawService;
