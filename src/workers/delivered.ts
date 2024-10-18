import fs from "fs-extra";
import path from "path";

const delivered = async () => {
  console.log("Worker Delivered is Running");

  const orderDir = path.join(__dirname, "../database/customer-order");

  const deliveredDir = path.join(__dirname, "../database/delivered-order");

  try {
    const orderFiles = await fs.readdir(orderDir);
    const maxConcurrency = 10;
    const processFiles = orderFiles.slice(0, maxConcurrency);

    await Promise.all(
      processFiles.map(async (file) => {
        const deliveredFiles = path.join(deliveredDir, file);
        if (!fs.existsSync(deliveredFiles)) {
          console.log(`Processing file ${file}`);
          const filePath = path.join(orderDir, file);
          try {
            const orderData = await fs.readJson(filePath);
            orderData.status = "Dikirim ke customer";

            const deliveredFilePath = path.join(deliveredDir, file);
            await fs.outputJson(deliveredFilePath, orderData);
          } catch (error) {
            console.error(
              `Error processing file ${file}:`,
              (error as Error).message
            );
          }
        }
      })
    );
  } catch (error) {
    console.error("Error reading order files:", (error as Error).message);
  }
};

setInterval(delivered, 10000);
