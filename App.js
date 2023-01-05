import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const configurePushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);
      if(Platform.OS === 'android'){
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT
        });
      }
    };
    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscribe1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notifications Received!!!");
        console.log(notification);
      }
    );

    const subscribe2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notifications Response Received !!!");
        console.log(response);
        console.log(response.notification.request.content.data.userName);
      }
    );

    return () => {
      subscribe1.remove();
      subscribe2.remove();
    };
  }, []);

  const notifHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Your daily remainder!",
        body: "The way of God is perfect and pure!!!",
        data: { userName: "max" },
      },
      trigger: {
        seconds: 5,
      },
    });
    console.log("i am pressed");
  };
  return (
    <View style={styles.container}>
      <Button title="tap for notifications" onPress={notifHandler} />
      <Text>Hello World!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
