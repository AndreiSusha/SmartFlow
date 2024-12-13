import React, { createContext, useState } from "react";

export const AssetDataContext = createContext();

export const AssetDataProvider = ({ children }) => {
  const [assetData, setAssetData] = useState({
    assetName: "",
    assetTypeName: "",
    additionalInformation: "",
    locationChoice: "new", 
    existingLocationId: null,
    newLocation: {
      country: "",
      city: "",
      address: "",
      zipCode: "",
    },
  });

  const updateAssetData = (key, value) => {
    setAssetData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const setLocationChoice = (choice) => {
    setAssetData((prevData) => ({
      ...prevData,
      locationChoice: choice,
      existingLocationId: choice === "existing" ? prevData.existingLocationId : null,
      newLocation: choice === "new" ? prevData.newLocation : {
        country: "",
        city: "",
        address: "",
        zipCode: "",
      },
    }));
  };

  const updateExistingLocationId = (id) => {
    setAssetData((prevData) => ({
      ...prevData,
      existingLocationId: id,
    }));
  };

  const updateNewLocationField = (key, value) => {
    setAssetData((prevData) => ({
      ...prevData,
      newLocation: {
        ...prevData.newLocation,
        [key]: value,
      },
    }));
  };

  return (
    <AssetDataContext.Provider
      value={{
        assetData,
        updateAssetData,
        setLocationChoice,
        updateExistingLocationId,
        updateNewLocationField,
      }}
    >
      {children}
    </AssetDataContext.Provider>
  );
};
