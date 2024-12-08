import { createContainer, asClass, asValue } from "awilix";
import logger from "./src/util/logger.js";

import UserRepo from "./src/User/UserRepo.js";
import UserService from "./src/User/UserService.js";
import UserController from "./src/User/UserController.js";

import CompanyRepo from "./src/Company/CompanyRepo.js";
import CompanyService from "./src/Company/CompanyService.js";
import CompanyController from "./src/Company/CompanyController.js";

import StocksHistoryRepo from "./src/StocksHistory/StocksHistoryRepo.js";
import StocksHistoryService from "./src/StocksHistory/StocksHistoryService.js";
import StocksHistoryController from "./src/StocksHistory/StocksHistoryController.js";

import UserStocksRepo from "./src/UserStocks/UserStocksRepo.js";
import UserStocksService from "./src/UserStocks/UserStocksService.js";
import UserStocksController from "./src/UserStocks/UserStocksController.js";

import TransactionRepo from "./src/Transaction/TransactionRepo.js";
import TransactionService from "./src/Transaction/TransactionService.js";
import TransactionController from "./src/Transaction/TransactionController.js";

import UserProfitRepo from "./src/UserProfit/UserProfitRepo.js";
import UserProfitService from "./src/UserProfit/UserProfitService.js";
import UserProfitController from "./src/UserProfit/UserProfitController.js";

import UserWithdrawRepo from "./src/UserWithdraw/UserWithdrawRepo.js";
import UserWithdrawService from "./src/UserWithdraw/UserWithdrawService.js";
import UserWithdrawController from "./src/UserWithdraw/UserWithdrawController.js";

import AdminRepo from "./src/Admin/AdminRepo.js";
import AdminService from "./src/Admin/AdminService.js";
import AdminController from "./src/Admin/AdminController.js";
const container = createContainer();

container.register({
  logger: asValue(logger),

  userRepo: asClass(UserRepo).scoped(),
  userService: asClass(UserService).scoped(),
  userController: asClass(UserController).scoped(),

  companyRepo: asClass(CompanyRepo).scoped(),
  companyService: asClass(CompanyService).scoped(),
  companyController: asClass(CompanyController).scoped(),

  stocksHistoryRepo: asClass(StocksHistoryRepo).scoped(),
  stocksHistoryService: asClass(StocksHistoryService).scoped(),
  stocksHistoryController: asClass(StocksHistoryController).scoped(),

  userStocksRepo: asClass(UserStocksRepo).scoped(),
  userStocksService: asClass(UserStocksService).scoped(),
  userStocksController: asClass(UserStocksController).scoped(),

  transactionRepo: asClass(TransactionRepo).scoped(),
  transactionService: asClass(TransactionService).scoped(),
  transactionController: asClass(TransactionController).scoped(),

  userProfitRepo: asClass(UserProfitRepo).scoped(),
  userProfitService: asClass(UserProfitService).scoped(),
  userProfitController: asClass(UserProfitController).scoped(),

  userWithdrawRepo: asClass(UserWithdrawRepo).scoped(),
  userWithdrawService: asClass(UserWithdrawService).scoped(),
  userWithdrawController: asClass(UserWithdrawController).scoped(),

  adminRepo: asClass(AdminRepo).scoped(),
  adminService: asClass(AdminService).scoped(),
  adminController: asClass(AdminController).scoped(),
});

export default container;
