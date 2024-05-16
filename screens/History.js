import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firestore as db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function History() {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const docRef = doc(db, 'System', 'lscUT1TfkWiQ87fisxwX');
                const unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const historyArray = data.history;

                        const formattedHistory = historyArray.map(item => ({
                            date: item.date,
                            value: item.value,
                            average: item.average,
                        }));

                        setHistoryData(formattedHistory);
                    } else {
                        console.log('Document does not exist!');
                    }
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchHistoryData();

        // Cleanup function
        return () => {
            // Unsubscribe or clean up any resources here if needed
        };
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={historyData}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>Date: {item.date}</Text>
                        <Text>Value: {item.value}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
});
