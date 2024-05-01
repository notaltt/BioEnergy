import React, { useState, useEffect } from "react";
import { Text } from 'react-native';
import { StyleSheet, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { firestore as db } from "../firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const methaneValue = data.methane;
          const pressureValue = data.pressure;
  
          if (pressureValue >= 5000) {
            sendNotification();
          }
  
          if (methaneValue >= 199) {
            sendNotification2();
          }
  
          console.log('Methane:', methaneValue);
          console.log('Storage:', pressureValue);

        } else {
          console.log('Document does not exist!');
        }
      });
  
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching document:', error);
      return BackgroundFetch.Result.Failed;
    }
  });

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Storage Level Alert',
            body: 'The storage level has reached 5000.',
        },
        trigger: null, 
    });
};

const sendNotification2 = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Methane Emission Level Alert',
            body: 'The methane emission reached 199',
        },
        trigger: null, 
    });
};

export default function Dashboard() {
    const [emissionLevel, setEmissionLevel] = useState(0);
    const [storageLevel, setStorageLevel] = useState(0);
    const [data1, setData1] = useState(generateInitialData());

    useEffect(() => {
        registerBackgroundFetch();
        fetchData();
        const interval = setInterval(fetchData, 60000); 
        return () => clearInterval(interval);
    }, []);

    const registerBackgroundFetch = async () => {
        try {
            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60, 
            stopOnTerminate: false, 
            startOnBoot: true,
            });
        } catch (error) {
            console.error('Failed to register background fetch task:', error);
        }
    };

    const fetchData = async () => {
        try {
            const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const methaneValue = data.methane;
                    const pressureValue = data.pressure;

                    setEmissionLevel(methaneValue);
                    setStorageLevel(pressureValue);
                    setData1(fetchEmissionData(methaneValue));

                    if (pressureValue >= 5000) {
                        sendNotification('Storage Level Alert', 'The storage level has reached 5000.');
                    }

                    if (methaneValue >= 199) {
                        sendNotification('Methane Emission Level Alert', 'The methane emission reached 199');
                    }


                    console.log('Methane:', methaneValue);
                    console.log('Storage:', pressureValue);
                } else {
                    console.log('Document does not exist!');
                }
            });
            
            // Return unsubscribe function to cleanup listener
            return unsubscribe;
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }
    

    function generateInitialData() {
      const labels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setMinutes(date.getMinutes() - (6 - i)); 
          return `${date.getHours()}:${date.getMinutes()}`;
      });
  
      const initialData = [0, 0, 0, 0, 0, 0, 0]; 
  
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

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Storage Level Alert',
                body: 'The storage level has reached 5000.',
            },
            trigger: null,
        });
    };

    const sendNotification2 = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Methane Emission Level Alert',
                body: 'The methane emission reached 199',
            },
            trigger: null,
        });
    };

    return (
        <View style={styles.container}>
            <Text>Current Methane Emission Level: {emissionLevel}</Text>
            <LineChart
                data={data1}
                width={350}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
            />
            <Text>Current Storage: {storageLevel}</Text>
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
