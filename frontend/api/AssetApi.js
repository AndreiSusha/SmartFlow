import api from "./axiosInstance";

export const getAssets = async () => {
  const { data } = await api.get(`/api/assets`);

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
