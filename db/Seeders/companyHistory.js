import xlsx from "xlsx";
import StockHistory from "../Schemas/StocksHistory.js";
import Company from "../Schemas/CompanySchema.js";

// Connect to MongoDB
export async function insertData() {
  // Read the Excel file"/home/alimohamed/Downloads/MONTH1112.xlsx"
  const workbook = xlsx.readFile("C:/Users/alisa/Downloads/0412.xlsx");

  // Assume the sheet containing the data is the first sheet
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert the sheet data to JSON
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  for (const record of data) {
    const establishment = record[0];
    const company = await Company.findOne({
      establishment_type: establishment,
    });
    if (!company) {
      console.log(`Establishment ${establishment} not found`);
      continue;
    }

    console.log(`Establishment ${establishment} found`);
    const companyId = company._id;

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    let daysAgo = 30;

    for (let i = 1; i < record.length - 1; i++) {
      const visitors = record[i];

      if (typeof visitors !== "number") continue;

      // Calculate the date for this record
      const computedDate = new Date(currentDate);
      computedDate.setDate(computedDate.getDate() - daysAgo);

      // Prepare the history object
      const sharesPrice = visitors / 100; // Compute shares price
      const sharesReturn = 0; // Default to 0

      const history = {
        companyId,
        date: computedDate,
        number_of_buys: 0,
        number_of_sells: 0,
        shares_price: sharesPrice,
        shares_return: sharesReturn,
        visitors,
      };

      console.log(history);

      const newStockHistory = new StockHistory(history);
      await newStockHistory.save();

      daysAgo--;
    }
  }

  console.log("Data inserted successfully");
}
