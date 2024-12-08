import mongoose from "mongoose";
import StockHistory from "../Schemas/StocksHistory.js";
import Company from "../Schemas/CompanySchema.js";

// Sample companies with realistic initial values
const companiesData = [
  {
    name: "Commercial International Bank",
    acronym: "CIB",
    description: "A major player in banking and financial services.",
    logo: "CIB.png",
    current_price: 75.5,
    current_change: -1.2,
    current_visitors: 8500,
    number_of_trades: 200,
    current_return: 7.3,
    number_of_buys: 548,
    number_of_sells: 123,
  },
  {
    name: "Canon",
    acronym: "CNA",
    description: "A global leader in imaging and optical products.",
    logo: "CNA.png",
    current_price: 45.3,
    current_change: 0.8,
    current_visitors: 15000,
    amount_invested: 800000,
    number_of_trades: 125,
    current_return: 5.1,
    number_of_buys: 124,
    number_of_sells: 566,
  },
  {
    name: "CocaCola",
    acronym: "COC",
    description:
      "The world’s leading beverage company with a diverse portfolio.",
    logo: "COC.png",
    current_price: 60.25,
    current_change: 1.7,
    current_visitors: 20000,
    amount_invested: 1500000,
    number_of_trades: 300,
    current_return: 8.9,
    number_of_buys: 1312,
    number_of_sells: 123,
  },
  {
    name: "Juhayna",
    acronym: "JUH",
    description:
      "A prominent food and beverage company in Egypt specializing in dairy products.",
    logo: "JUH.png",
    current_price: 35.75,
    current_change: 0.5,
    current_visitors: 12000,
    amount_invested: 700000,
    number_of_trades: 175,
    current_return: 6.4,
    number_of_buys: 764,
    number_of_sells: 242,
  },
  {
    name: "ElSewedy Electric",
    acronym: "SWE",
    description:
      "A leading integrated energy solutions provider in the Middle East and Africa.",
    logo: "SWE.png",
    current_price: 120.4,
    current_change: 3.2,
    current_visitors: 9000,
    amount_invested: 1000000,
    number_of_trades: 220,
    current_return: 10.5,
    number_of_buys: 312,
    number_of_sells: 132,
  },
  {
    name: "Zoetis",
    acronym: "ZOE",
    description:
      "A global animal health company providing veterinary medicines and services.",
    logo: "ZOE.png",
    current_price: 185.3,
    current_change: -0.6,
    current_visitors: 14000,
    amount_invested: 1300000,
    number_of_trades: 275,
    current_return: 9.1,
    number_of_buys: 1244,
    number_of_sells: 552,
  },
];

// Function to generate and insert companies and their stock history records
export const seedDatabase = async () => {
  // Insert companies into the database
  // const insertedCompanies = await Company.insertMany(companiesData);
  // console.log("Companies inserted successfully.");

  // Generate stock history for each company
  const startDate = new Date("2024-10-01");
  let endDate = new Date();
  const records = [];

  for (const company of insertedCompanies) {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const priceFluctuation = (Math.random() - 0.5) * 2; // Small fluctuations
      const newPrice = Math.max(0, company.current_price + priceFluctuation);
      const newReturn = company.current_return + (Math.random() * 2 - 1); // Random change in return
      const visitors = Math.floor(Math.random() * 500 + 500); // Between 500 to 1000 visitors
      const number_of_buys = Math.floor(Math.random() * 50); // Random buys
      const number_of_sells = Math.floor(Math.random() * 30); // Random sells

      const record = {
        companyId: company._id,
        date: new Date(currentDate),
        visitors,
        shares_price: newPrice.toFixed(2),
        shares_return: newReturn.toFixed(2),
        number_of_buys,
        number_of_sells,
      };

      records.push(record);
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  }

  // Insert records in bulk
  await StockHistory.insertMany(records);
  console.log("Stock history records generated successfully.");
};
