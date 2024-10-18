const activeOrders = new Map<string, boolean>();

export const lockOrder = (id_customer: string): boolean => {
  if (activeOrders.get(id_customer)) {
    return false;
  }

  activeOrders.set(id_customer, true);
  return true;
};

export const unlockOrder = (id_customer: string): void => {
  activeOrders.delete(id_customer);
};
