import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import io, { Socket } from "socket.io-client";

// Define the type of message objects
type Message = {
  text: string;
  sender: "me" | "other"; // Add sender type to differentiate messages
};

// Initialize the socket connection
const socket: Socket = io("http://192.168.81.139:3000");

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const messageObj: Message = { text: message, sender: "me" }; // Mark the message as sent by "me"
    socket.emit("sendMessage", messageObj); // Send message to server
    setMessages((prevMessages) => [...prevMessages, messageObj]); // Add message to local state
    setMessage(""); // Clear the input field
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "me"
                  ? styles.myMessageText
                  : styles.otherMessageText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        placeholderTextColor="#888" // Placeholder text color for better visibility on black background
      />
      <Button title="Send" onPress={handleSendMessage} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000", // Set background color to black
  },
  messageContainer: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%", // Limit the width of the message bubbles
    alignSelf: "flex-start", // Align other messages to the left
  },
  myMessage: {
    backgroundColor: "#007AFF", // Color for sent messages
    alignSelf: "flex-end", // Align sent messages to the right
  },
  otherMessage: {
    backgroundColor: "#333", // Darker color for received messages
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#fff", // Text color for sent messages
  },
  otherMessageText: {
    color: "#fff", // Text color for received messages
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 25, // Rounded input field
    backgroundColor: "#444", // Dark background for input field
    color: "#fff", // Input text color
  },
});

export default ChatScreen;
