import api from "./axiosInstance";


export const getAssets = async () => {
  const endpoint = `api/assets`;
  const fullURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log(`Fetching assets from: ${fullURL}`);

  const { data } = await api.get(endpoint);
  return data;
};

export const getAsset = async (id) => {
  if (!id) {
    throw new Error("Asset ID is required");
  }

  const { data } = await api.get(`api/asset-details/${id}`);
  return data;
};

export const deleteAsset = async (id) => {
  if (!id) {
    throw new Error("Asset ID is required for deletion.");
  }

  const { data } = await api.delete(`api/assets/${id}`);
  return data;
};

export const editAsset = async (id, name, description, address) => {
  if (!id) {
    throw new Error("Asset ID is required for editing.");
  }

  const { data } = await api.put(`api/asset/${id}`, {
    name,
    description,
    address,
  });
  return data;
};

export const getAssetTypes = async () => {
  const endpoint = `api/asset-types`;
  const fullURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log(`Fetching asset types from: ${fullURL}`); // Log the URL

  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error("Error fetching asset types:", error);
    throw error;
  }
};

export const getLocations = async (customerId) => {
  if (!customerId) {
    throw new Error("Customer ID is required to fetch locations.");
  }

  const endpoint = `locations/${customerId}`;
  const fullURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log(`Fetching locations for customer ${customerId} from: ${fullURL}`); // Log the URL

  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No locations found for customer ${customerId}`);
      return [];
    }
    console.error(
      `Error fetching locations for customer ${customerId}:`,
      error
    );
    throw error;
  }
};

export const addAsset = async (assetData) => {
  const endpoint = "api/assets";
  try {
    const response = await api.post(endpoint, assetData);
    return response.data;
  } catch (error) {
    console.error("Error adding asset:", error);
    throw error;
  }
};
