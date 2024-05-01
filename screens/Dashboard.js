import React, { useState, useEffect } from "react";
import { Text } from 'react-native';
import { StyleSheet, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { firestore as db } from "../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
    const [emissionLevel, setEmissionLevel] = useState(0);
    const [storageLevel, setStorageLevel] = useState(0);
    const [data1, setData1] = useState(generateInitialData());
    let initialValue = [0, 0, 0, 0, 0, 0, 0]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
                const unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const methaneValue = data.methane;
                        const pressureValue = data.pressure;
                        const historyArray = data.history;
                    
                        setEmissionLevel(methaneValue);
                        setStorageLevel(pressureValue);
                        setData1(fetchEmissionData(methaneValue))
                    
                        const formattedHistory = historyArray.map(item => ({
                            ...item,
                            date: new Date(item.date.seconds * 1000).toLocaleString(), 
                        }));
                        
                        console.log('Methane:', methaneValue);
                        console.log('Storage:', pressureValue);
                        console.log('History:', formattedHistory);
                    } else {
                        console.log('Document does not exist!');
                    }
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        const fetchDataInterval = setInterval(() => {
            fetchData();
        }, 60000); 

        // Fetch data initially
        fetchData();

        return () => clearInterval(fetchDataInterval);
    }, []);

    function generateInitialData() {
      const labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setMinutes(date.getMinutes() - (6 - i)); 
          return `${date.getHours()}:${date.getMinutes()}`;
      });
  
      const initialData = [0, 0, 0, 0, 0, 0, 0]; // Initial data with zeros
  
      return {
          labels,
          datasets: [
              {
                  data: initialData,
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                  strokeWidth: 2,
              },
          ],
      };
    }

    function fetchEmissionData(emissionValue) {
      const date = new Date();
      const label = `${date.getHours()}:${date.getMinutes()}`;
      
      const newData = { ...data1 };

      newData.labels.shift();
      newData.datasets[0].data.shift();

      newData.labels.push(label);
      newData.datasets[0].data.push(emissionValue);

      console.log("New Data:", newData); 

      return newData;
    }

    const data2 = [
        {
            name: "AMOUNT OF GAS",
            population: storageLevel,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "CAPACITY",
            population: 5000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#000000",
        backgroundGradientFromOpacity: 1, 
        backgroundGradientTo: "#000000", 
        backgroundGradientToOpacity: 1, 
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
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
            <Text>{storageLevel}</Text>
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
