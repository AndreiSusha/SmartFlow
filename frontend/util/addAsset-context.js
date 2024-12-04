// trip-context.js
import React, { createContext, useState } from "react";

export const AssetDataContext = createContext();

export const AssetDataProvider = ({ children }) => {
  const [assetData, setAssetData] = useState({
    assetType: "",
    assetCountry: "",
    assetAddressDetails: {
      assetCity: "",
      assetAddress: "",
      assetPostalCode: "",
    },
    assetAdditionalDetails: "",
  });

  const handleInputChange = (key, value) => {
    setAssetData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <AssetDataContext.Provider value={{ assetData, handleInputChange }}>
      {children}
    </AssetDataContext.Provider>
  );
};
