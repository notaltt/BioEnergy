import React, { useState } from "react";
import { Text } from 'react-native';
import { StyleSheet, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

export default function Dashboard() {
    const [emissionLevel, setEmissionLevel] = useState(0);

    const data1 = {
        labels: ["S", "M", "T", "W", "T", "F", "S"],
        datasets: [
            {
            data: [20, 45, 28, 80, 99, 43, 50],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
            },
        ],
    };

    const data2 = [
        {
          name: "Full",
          population: 21500000,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "ASD",
          population: 2800000,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
      ];

    const chartConfig = {
        backgroundGradientFrom: "#000000", // Black background
        backgroundGradientFromOpacity: 1, // Full opacity
        backgroundGradientTo: "#000000", // Black background
        backgroundGradientToOpacity: 1, // Full opacity
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // Accent color
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };
  

  return (
    <View style={styles.container}>
        <Text>Current Methane Emission Level</Text>
        <Text>{emissionLevel}</Text>
        <LineChart
            data={data1}
            width={350}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
        />
        <PieChart
            data={data2}
            width={350}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            absolute
        />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 16,
    elevation: 6,
  },
});
