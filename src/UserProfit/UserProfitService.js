class UserProfitService {
  constructor({ userProfitRepo, logger }) {
    this.userProfitRepo = userProfitRepo;
    this.logger = logger;
  }

  getAllUserProfit = async (userId, correlationId) => {
    try {
      const userProfits = await this.userProfitRepo.getAllUserProfit(
        userId,
        correlationId
      );

      return userProfits;
    } catch (error) {
      throw error;
    }
  };
}

export default UserProfitService;
