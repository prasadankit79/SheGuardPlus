import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-native-markdown-display';
import CurvedButton from '../components/CurvedButton';

// --- THE FIX IS HERE ---
// Ensure the 'new' keyword is present before GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
// -----------------------

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const userMessage: Message = { id: Date.now().toString(), text: currentInput, isUser: true };
    setMessages(prev => [userMessage, ...prev]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      const text = response.text();
      const botMessage: Message = { id: (Date.now() + 1).toString(), text, isUser: false };
      setMessages(prev => [botMessage, ...prev]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting.", isUser: false };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
            {item.isUser ? (
              <Markdown style={markdownStylesUser}>{item.text}</Markdown>
            ) : (
              <Markdown style={markdownStylesBot}>{item.text}</Markdown>
            )}
          </View>
        )}
      />
      {isLoading && <ActivityIndicator style={styles.loading} size="large" color="#8E44AD" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask for help..."
          editable={!isLoading}
        />
        <CurvedButton title="Send" onPress={sendMessage} color="#1E88E5" />
      </View>
    </KeyboardAvoidingView>
  );
}

const markdownStylesUser = StyleSheet.create({ body: { fontSize: 16, color: '#fff' } });
const markdownStylesBot = StyleSheet.create({ body: { fontSize: 16, color: '#000' } });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  messagesContainer: { padding: 10, flexDirection: 'column-reverse' },
  messageBubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#1E88E5', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10, paddingHorizontal: 10, borderRadius: 20 },
  loading: { marginVertical: 10 },
});