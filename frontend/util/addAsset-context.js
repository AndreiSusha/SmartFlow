// addAsset-context.js
import React, { createContext, useState } from "react";

export const AssetDataContext = createContext();

export const AssetDataProvider = ({ children }) => {
  const [assetData, setAssetData] = useState({
    assetName: "",
    assetTypeName: "",
    location: {
      country: "",
      city: "",
      address: "",
      zipCode: "",
      additionalInformation: "",
    },
  });

  const updateAssetData = (key, value) => {
    setAssetData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const updateLocationData = (key, value) => {
    setAssetData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [key]: value,
      },
    }));
  };

  return (
    <AssetDataContext.Provider
      value={{ assetData, updateAssetData, updateLocationData }}
    >
      {children}
    </AssetDataContext.Provider>
  );
};
