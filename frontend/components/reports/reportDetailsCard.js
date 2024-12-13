import { Text, View, StyleSheet } from "react-native";

const ReportDetailsCard = ({
  cardName,
  cardNumber,
  cardUnit,
  cardSubtitle,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{cardName}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
        {cardUnit && <Text style={styles.cardUnit}>{cardUnit}</Text>}
      </View>
      <Text style={styles.cardSubtitle}>{cardSubtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: "#667085",
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  cardNumber: {
    fontSize: 25,
    color: "#53B6C7",
    fontWeight: "bold",
  },
  cardUnit: {
    fontSize: 15,
    color: "#53B6C7",
    marginLeft: 5,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginTop: 10,
  },
});

export default ReportDetailsCard;
