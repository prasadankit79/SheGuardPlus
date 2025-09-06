import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useEffect, useRef, useState } from 'react'; // Import useRef and useEffect
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import CurvedButton from '../components/CurvedButton';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
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
  const flatListRef = useRef<FlatList>(null); // --- FIX #3: Add a ref for scrolling ---

  // --- FIX #3: Add useEffect to scroll to bottom ---
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const userMessage: Message = { id: Date.now().toString(), text: currentInput, isUser: true };
    // --- FIX #2: Add new messages to the END of the array ---
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await model.generateContent(currentInput);
      const response = await result.response;
      const text = response.text();
      const botMessage: Message = { id: (Date.now() + 1).toString(), text, isUser: false };
      // --- FIX #2: Add new messages to the END of the array ---
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting.", isUser: false };
      setMessages(prev => [...prev, errorMessage]);
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
        ref={flatListRef} // --- FIX #3: Assign the ref ---
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        // --- FIX #1: Remove the 'inverted' prop ---
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
  // Optional: You can remove 'flexDirection: column-reverse' if it exists.
  messagesContainer: { padding: 10 }, 
  messageBubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#1E88E5', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10, paddingHorizontal: 10, borderRadius: 20 },
  loading: { marginVertical: 10 },
});