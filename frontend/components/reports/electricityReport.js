import BarChart from "./charts/BarChart";
import { StyleSheet, View } from "react-native";
import ReportDetailsCard from "./reportDetailsCard";
import { useState } from "react";

const ElectricityReport = ({ weekly_data, monthly_data, yearly_data }) => {
  const [period, setPeriod] = useState("monthly");

  let totalConsumption = 0;
  let totalCost = 0;
  let cardSubtitle = "";

  switch (period) {
    case "weekly":
      totalConsumption = weekly_data.reduce((sum, item) => sum + item.kWh, 0);
      totalCost = weekly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "This Week";
      break;
    case "monthly":
      totalConsumption = monthly_data.reduce((sum, item) => sum + item.kWh, 0);
      totalCost = monthly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "Last 3 months";
      break;
    case "yearly":
      totalConsumption = yearly_data.reduce((sum, item) => sum + item.kWh, 0);
      totalCost = yearly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "This Year";
      break;
    default:
      totalConsumption = 0;
      totalCost = 0;
      cardSubtitle = "";
      break;
  }

  return (
    <View style={styles.container}>
      <BarChart
        weekly_data={weekly_data}
        monthly_data={monthly_data}
        yearly_data={yearly_data}
        period={period}
        setPeriod={setPeriod}
      />
      <View style={styles.cardContainer}>
        <ReportDetailsCard
          cardName={"Total Consumption"}
          cardNumber={totalConsumption.toFixed(0)}
          cardUnit={"kWh"}
          cardSubtitle={cardSubtitle}
        />
        <ReportDetailsCard
          cardName={"Total Cost"}
          cardNumber={`€${totalCost.toFixed(0)}`}
          cardSubtitle={cardSubtitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default ElectricityReport;
