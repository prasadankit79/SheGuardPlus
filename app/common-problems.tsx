import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// We have REMOVED the old animation imports and code from this file as well.

const faqData = [
  {
    id: '1',
    question: 'What are the best practices for skincare hygiene?',
    answer: 'Best practices for skincare health include cleansing your face twice daily with a gentle, pH-balanced cleanser to remove dirt and oil. Moisturize regularly to maintain skin hydration, and use sunscreen with at least SPF 30 every day, even indoors. Stay hydrated, eat a balanced diet rich in antioxidants, and avoid excessive sugar and oily foods. Exfoliate once or twice a week to remove dead skin cells, but avoid over-exfoliating. Choose products suited to your skin type and patch-test new products. Avoid touching your face frequently and ensure makeup is removed before bed. Lastly, get adequate sleep and manage stress.',
  },
  {
    id: '2',
    question: 'How much sleep do I need for good health?',
    answer: 'For good health, sleep needs vary by age, but adults typically require 7 to 9 hours of quality sleep each night. Teenagers need around 8 to 10 hours, while younger children and infants need even more. Adequate sleep supports brain function, emotional well-being, immune strength, and physical health. Consistent, restful sleep helps improve concentration, mood, and memory, and reduces the risk of chronic conditions like heart disease and diabetes. Poor sleep can weaken immunity and lead to fatigue, stress, and weight gain. Maintaining a regular sleep schedule and creating a calming bedtime routine are essential for quality rest.',
  },
  {
    id: '3',
    question: 'How do I manage stress and anxiety?',
    answer: 'To manage stress and anxiety, practice deep breathing, meditation, or mindfulness daily to calm your mind. Regular exercise helps release endorphins, reducing tension naturally. Maintain a balanced diet, limit caffeine and alcohol, and get adequate sleep. Break tasks into manageable steps and avoid overcommitting. Talking to a trusted friend or seeking professional help can provide support. Engage in hobbies, listen to music, or spend time in nature to relax. Writing thoughts in a journal may also help clear mental clutter. Building a consistent routine and setting realistic goals can bring structure and reduce overwhelming feelings.',
  },
  {
    id: '4',
    question: 'How do I boost my immune system naturally?',
    answer: 'To naturally boost your immune system, focus on nutrient-rich foods like citrus fruits, leafy greens, garlic, and yogurt, which are high in vitamins C, D, and probiotics. Stay well-hydrated and aim for 7–9 hours of quality sleep to support recovery and repair. Exercise regularly to improve circulation and immunity. Manage stress through deep breathing, meditation, or hobbies, as chronic stress weakens immunity. Avoid smoking, reduce alcohol intake, and maintain proper hygiene such as handwashing. Include immune-boosting herbs like turmeric and ginger. Stay consistent with healthy habits and avoid overuse of antibiotics, which can disturb your gut health and immunity.',
  },
  {
    id: '5',
    question: 'How can I avoid lifestyle diseases like diabetes and hypertension?',
    answer: 'To avoid lifestyle diseases like diabetes and hypertension, adopt a balanced, nutritious diet rich in whole grains, fruits, vegetables, lean proteins, and healthy fats while limiting salt, sugar, and processed foods. Engage in regular physical activity—at least 30 minutes of exercise most days—to maintain a healthy weight and support heart health. Avoid smoking and limit alcohol consumption, as both increase disease risk. Manage stress through mindfulness, yoga, or relaxation techniques, as chronic stress can lead to high blood pressure and insulin resistance. Get 7–9 hours of quality sleep to support overall health. Monitor your blood pressure and sugar levels regularly, especially if there\'s a family history. Lastly, stay in touch with your doctor and prioritize preventive healthcare to reduce your long-term risk significantly.',
  },
];

const FAQItem = ({ question, answer, onPress, isExpanded }) => {
  return (
    <View style={styles.faqItem}>
      <Pressable style={styles.questionContainer} onPress={onPress}>
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#8E44AD" />
      </Pressable>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function CommonProblemsScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const handlePress = (id) => {
    // We have removed the LayoutAnimation line from here
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Common Problems & Solutions</Text>
      {faqData.map((item) => (
        <FAQItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          onPress={() => handlePress(item.id)}
          isExpanded={expandedId === item.id}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A0C6B',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#4A0C6B',
    marginRight: 10,
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0BBE4',
    marginTop: 15,
    paddingTop: 15,
  },
  answerText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});