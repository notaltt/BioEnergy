import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function Permission({ navigation }) {
    const [notificationPermission, setNotificationPermission] = useState(null);

    useEffect(() => {
        // Request permission when the component mounts
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            setNotificationPermission(status);
        })();
    }, []);

    useEffect(() => {
        // Navigate to Dashboard when permission is granted
        if (notificationPermission === 'granted') {
            navigation.navigate('Dashboard');
        }
    }, [notificationPermission, navigation]);

    return (
        <View>
            <Text>Notification Permission: {notificationPermission}</Text>
        </View>
    );
}
