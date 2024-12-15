import { StyleSheet, View, ScrollView } from "react-native";
import ReportDetailsCard from "./reportDetailsCard";
import BarChart from "./charts/BarChart";

const LightReport = ({
  weekly_data,
  monthly_data,
  yearly_data,
  period,
  setPeriod,
  unit,
  aggrType,
}) => {
  let totalConsumption = 0;
  let totalCost = 0;
  let cardSubtitle = "";

  switch (period) {
    case "last_week":
      totalConsumption = weekly_data.reduce((sum, item) => sum + item.value, 0);
      totalCost = weekly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "This Week";
      break;
    case "last_3_months":
      totalConsumption = monthly_data.reduce((sum, item) => sum + item.value, 0);
      totalCost = monthly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "Last 3 months";
      break;
    case "past_year":
      totalConsumption = yearly_data.reduce((sum, item) => sum + item.value, 0);
      totalCost = yearly_data.reduce((sum, item) => sum + item.cost, 0);
      cardSubtitle = "This Year";
      break;
    default:
      break;
  }

  return (
    <ScrollView style={styles.container}>
      <BarChart
        weekly_data={weekly_data}
        monthly_data={monthly_data}
        yearly_data={yearly_data}
        period={period}
        setPeriod={setPeriod}
        unitName={unit}
        aggrType={aggrType}
      />
    </ScrollView>
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

export default LightReport;
