export type InventoryItem = {
  quantity: number;
  updatedAt?: unknown;
};
export const MIN_STOCK_ALERT = 3;
export const inventoryId = (productId: number) => String(productId);
