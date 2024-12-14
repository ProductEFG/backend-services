import fs from "fs";
import path from "path";

export const moveTmpLogsToPersistent = () => {
  const tmpLogsPath = "/tmp/logs"; // Ephemeral location
  const persistentLogsPath = path.resolve("./logs"); // Persistent directory

  // Check if /tmp/logs exists
  if (fs.existsSync(tmpLogsPath)) {
    // Create persistent directory if it doesn't exist
    if (!fs.existsSync(persistentLogsPath)) {
      fs.mkdirSync(persistentLogsPath, { recursive: true });
    }

    // Copy all logs from /tmp/logs to ./logs
    const files = fs.readdirSync(tmpLogsPath);
    files.forEach((file) => {
      const srcPath = path.join(tmpLogsPath, file);
      const destPath = path.join(persistentLogsPath, file);

      // Copy the file
      fs.copyFileSync(srcPath, destPath);
    });

    console.log("Logs moved from /tmp/logs to ./logs");
  } else {
    console.log("No logs found in /tmp/logs");
  }
};
