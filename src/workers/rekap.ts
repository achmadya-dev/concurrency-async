import fs from "fs-extra";
import moment from "moment";
import path from "path";

const rekap = async () => {
  console.log("Worker Recap is Running");

  const deliveredDir = path.join(__dirname, "../database/delivered-order");
  const rekapDir = path.join(__dirname, "../database/rekap-order");

  const rekapFileName = `REKAP-ORDER-${moment().format("DDMMYY")}.json`;

  const rekapFilePath = path.join(rekapDir, rekapFileName);

  if (!fs.existsSync(rekapFilePath)) {
    try {
      const deliveredFiles = await fs.readdir(deliveredDir);

      const rekapData: any[] = [];

      for (const file of deliveredFiles) {
        const filePath = path.join(deliveredDir, file);
        const orderData = await fs.readJson(filePath);
        rekapData.push(orderData);
      }
      await fs.outputJson(rekapFilePath, rekapData);
    } catch (error) {
      console.error("Error processing rekap files:", error);
    }
  } else {
    try {
      const rekapData = await fs.readJson(rekapFilePath);

      const deliveredFiles = await fs.readdir(deliveredDir);

      for (const file of deliveredFiles) {
        const filePath = path.join(deliveredDir, file);
        const orderData = await fs.readJson(filePath);

        const isExist = rekapData.find(
          (item: any) => item.no_order === orderData.no_order
        );

        if (!isExist) {
          rekapData.push(orderData);
          await fs.outputJson(rekapFilePath, rekapData);
          console.log("Add new order to rekap file");
        }
      }
    } catch (error) {
      console.error("Error processing rekap files:", error);
    }
  }
};

setInterval(rekap, 5000);
