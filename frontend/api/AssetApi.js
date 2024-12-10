import api from "./axiosInstance";

// export const getAssets = async () => {
//   const { data } = await api.get(`/api/assets`);

//   return data;
// };

export const getAssets = async () => {
  const endpoint = `/api/assets`;
  const fullURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log(`Fetching assets from: ${fullURL}`);
  
  const { data } = await api.get(endpoint);
  return data;
};

export const getAsset = async (id) => {
  if (!id) {
    throw new Error("Asset ID is required");
  }

  const { data } = await api.get(`/api/asset-details/${id}`);
  return data;
};

export const deleteAsset = async (id) => {
  if (!id) {
    throw new Error("Asset ID is required for deletion.");
  }

  const { data } = await api.delete(`/api/assets/${id}`);
  return data;
};

export const editAsset = async (id, name, description, address) => {
  if (!id) {
    throw new Error("Asset ID is required for editing.");
  }

  const { data } = await api.put(`/api/asset/${id}`, {
    name,
    description,
    address,
  });
  return data;
};


export const getAssetTypes = async () => {
  const endpoint = `/api/asset-types`;
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