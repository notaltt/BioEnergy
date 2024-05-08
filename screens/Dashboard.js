import React, { useState, useEffect } from "react";
import { Text } from 'react-native';
import { StyleSheet, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { firestore as db } from "../firebase";
import { getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
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
  
        if (pressureValue >= 250) {
            sendNotification();
        }

        if (methaneValue >= 100) {
            sendNotification2();
        }
  
          console.log('background Methane:', methaneValue);
          console.log('background Storage:', pressureValue);

          const currentDate = new Date().toISOString();
          addToHistory(currentDate, methaneValue);
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
            body: 'The storage level has reached 250.',
        },
        trigger: null, 
    });
};

const sendNotification2 = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Methane Emission Level Alert',
            body: 'The methane emission reached 100',
        },
        trigger: null, 
    });
};

const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

const addToHistory = async (newDate, newValue) => {
    try {
        const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
        const data = docSnap.data();
        let history = data.history || []; // Ensure history exists or initialize as empty array
    
        // Find index of existing entry with the same date
        const existingEntryIndex = history.findIndex(entry => entry.date === formatDateTime(newDate));
    
        if (existingEntryIndex !== -1) {
            // Update existing entry if the new value is higher
            if (newValue > history[existingEntryIndex].value) {
            history[existingEntryIndex].value = newValue;
            }
        } else {
            // Add new entry if no entry with the same date exists
            history.push({ date: formatDateTime(newDate), value: newValue });
        }
    
        // Update Firestore document with the modified history array
        await updateDoc(docRef, { history });
    
        console.log('Added/Updated history entry:', { date: newDate, value: newValue });
        } else {
        console.log('Document does not exist!');
        }
    } catch (error) {
        console.error('Error adding/updating history entry:', error);
    }
};

export default function Dashboard() {
    const [emissionLevel, setEmissionLevel] = useState(0);
    const [storageLevel, setStorageLevel] = useState(0);
    const [storageThreshold, setStorageThreshold] = useState(0)
    const [data1, setData1] = useState(generateInitialData());

    useEffect(() => {
        setStorageThreshold(() => {
            const threshold = 250 - storageLevel;
            return threshold >= 0 ? threshold : 0;
        });

        fetchData();
        registerBackgroundFetch();
        const interval = setInterval(fetchData, 30000); 
        return () => clearInterval(interval); 
    }, [storageLevel]);

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

    const formatDateTime = (dateString) => {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
      
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const addToHistory = async (newDate, newValue) => {
        try {
            const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
            const data = docSnap.data();
            let history = data.history || []; // Ensure history exists or initialize as empty array
        
            // Find index of existing entry with the same date
            const existingEntryIndex = history.findIndex(entry => entry.date === formatDateTime(newDate));
        
            if (existingEntryIndex !== -1) {
                // Update existing entry if the new value is higher
                if (newValue > history[existingEntryIndex].value) {
                history[existingEntryIndex].value = newValue;
                }
            } else {
                // Add new entry if no entry with the same date exists
                history.push({ date: formatDateTime(newDate), value: newValue });
            }
        
            // Update Firestore document with the modified history array
            await updateDoc(docRef, { history });
        
            console.log('Added/Updated history entry:', { date: newDate, value: newValue });
            } else {
            console.log('Document does not exist!');
            }
        } catch (error) {
            console.error('Error adding/updating history entry:', error);
        }
    };
      
      
      

    const fetchData = async () => {
        try {
            const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const methaneValue = data.methane;
                const pressureValue = data.pressure;
    
                setEmissionLevel(methaneValue);
                setStorageLevel(pressureValue);
                setData1(fetchEmissionData(methaneValue));
    
                if (pressureValue >= 250) {
                    sendNotification();
                }
    
                if (methaneValue >= 100) {
                    sendNotification2();
                }

                // Add new entry to history
                const currentDate = new Date().toISOString();
                addToHistory(currentDate, methaneValue);
            
    
                console.log('Methane:', methaneValue);
                console.log('Storage:', pressureValue);
            } else {
                console.log('Document does not exist!');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };
    

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
            color: "#3B64B4",
            legendFontColor: "rgba(16, 39, 90, 1)",
            legendFontSize: 15
        },
        {
            name: "CAPACITY",
            population: storageThreshold,
            color: "#E45353",
            legendFontColor: "rgba(16, 39, 90, 1)",
            legendFontSize: 15

        },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#F9FAFD",
        backgroundGradientFromOpacity: 1, 
        backgroundGradientTo: "#F9FAFD", 
        backgroundGradientToOpacity: 1, 
        color: (opacity = 1) => `rgba(16, 39, 90, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };

    const chartConfig2 = {
        backgroundGradientFrom: "#F9FAFD",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#F9FAFD",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(16, 39, 90, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };
    

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Storage Level Alert',
                body: 'The storage level has reached 250.',
            },
            trigger: null,
        });
    };

    const sendNotification2 = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Methane Emission Level Alert',
                body: 'The methane emission reached 100',
            },
            trigger: null,
        });
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>Current Methane Emission Lvl: {emissionLevel}</Text>
                <LineChart
                    data={data1}
                    width={350}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                />
            </View>
            <Text style={styles.text}>Current Storage: {storageLevel}</Text>
            <PieChart
                data={data2}
                width={350}
                height={220}
                chartConfig={chartConfig2}
                accessor={"population"}
                backgroundColor={"transparent"}
                hasLegend={false}
                absolute
                center={[90,0]}
            />
            <View style={styles.container2}>
                <View style={styles.textContainer}>
                    <View style={styles.circle1} /> 
                    <Text style={styles.text}>AMOUNT OF GAS: {storageLevel}</Text>
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.circle2} /> 
                    <Text style={styles.text}>CAPACITY: 250</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFD',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 6,
    },
    text: {
        color: '#10275a',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFD',
    },
    textContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 8,
    },
    circle1: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3B64B4',
        marginRight: 8, 
    },
    circle2: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E45353', 
        marginRight: 8,
    },
});

