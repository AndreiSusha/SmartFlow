import api from "./axiosInstance";

export const getAssetMeasurements = async (assetId) => {
  if (!assetId) {
    throw new Error("Asset ID is required for fetching measurements.");
  }

  const endpoint = `/api/assets/${assetId}/measurements`;

  try {
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error("Error fetching asset measurements:", error);
    throw error;
  }
};

export const getReportDetails = async (assetId, measurementTable, period) => {
  if (!assetId) {
    throw new Error("Asset ID is required for fetching measurements.");
  }
  if (!measurementTable) {
    throw new Error("Measurement table is required for fetching measurements.");
  }
  if (!period) {
    throw new Error("Period is required for fetching measurements.");
  }

  const endpoint = "/measurements";

  const fullURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log(`Fetching asset types from: ${fullURL}`); // Log the URL
  console.log(`assetId: ${assetId}, measurementTable: ${measurementTable}, period: ${period}`);

  try {
    const { data } = await api.get(endpoint, {
      params: {
        assetId,
        measurementTable,
        period,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching report details:", error);
    throw error;
  }
};
