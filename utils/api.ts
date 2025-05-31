import axios from "axios";

const API_BASE_URL = "https://api.cdp.coinbase.com/platform/v2";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CDP_API_KEY_SECRET}`,
  },
});

export const createWallet = async (networkId: string) => {
  return apiClient.post("/wallets", { wallet: { network_id: networkId } });
};

export const listWallets = async (cursor?: string) => {
  const params = cursor ? { params: { cursor } } : {};
  return apiClient.get("/wallets", params);
};

export const getWalletBalances = async (walletId: string) => {
  try {
    return await apiClient.get(`/wallets/${walletId}/balances`);
  } catch (error: any) {
    console.error(`Error fetching balances for wallet ${walletId}:`, error);
    // Return a structured error response
    return {
      data: null,
      error: {
        message: error.message || "Failed to fetch wallet balances",
        status: error.response?.status || 500,
      },
    };
  }
};

export const deleteWallet = async (walletId: string) => {
  return apiClient.delete(`/wallets/${walletId}`);
};

export const updateWallet = async (
  walletId: string,
  metadata: Record<string, any>
) => {
  return apiClient.put(`/wallets/${walletId}`, { metadata });
};
