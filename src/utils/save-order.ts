import fs from "fs-extra";

export const saveOrderWithRetry = async (
  filePath: string,
  orderData: unknown,
  retries: number = 3
) => {
  while (retries > 0) {
    try {
      await fs.outputJSON(filePath, orderData);
      return;
    } catch (error) {
      retries -= 1;
      if ((retries = 0)) {
        throw new Error("Failed to save order after multiple retries");
      }
    }
  }
};
