import co2Report from "../components/reports/co2Report";
import electricityReport from "../components/reports/electricityReport";
import temperatureReport from "../components/reports/temperatureReport";

export const reportComponentsMap = {
    electricity: electricityReport,
    temperature: temperatureReport,
    CO2: co2Report,
}