import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// We have REMOVED the old animation imports and the "if (Platform.OS === 'android')" block.

const faqData = [
  {
    id: '1',
    question: 'What support is available for harassment victims?',
    answer: "Harassment victims have access to several kinds of support, including:\n1. Police & Legal Support – Victims can file FIRs at local police stations or women’s cells.\n2. Workplace Redressal – Internal Complaints Committees (ICCs) under the POSH Act handle workplace harassment.\n3. Women’s Commissions – National and State Women Commissions assist with legal and policy support.\n4. Helplines – 1091 (Women’s Helpline) and 181 (Emergency Response Support System).\n5. Legal Aid – Free legal advice is available through government legal aid services.\n6. Mental Health Support – Psychologists and counsellors help with emotional healing.\n7. NGOs & Shelters – Provide legal guidance, temporary shelter, and rehabilitation.",
  },
  {
    id: '2',
    question: 'What protections are there against retaliation for reporting harassment?',
    answer: 'Protections against retaliation are provided under various laws. The POSH Act, 2013 in India specifically prohibits retaliation against anyone who files or participates in a harassment complaint. Employers are legally required to maintain confidentiality and protect complainants from victimization. Retaliation like demotion, termination, or threats is considered misconduct and may lead to disciplinary action. Victims can report such behaviour to the Internal Complaints Committee (ICC) or legal authorities.',
  },
  {
    id: '3',
    question: 'How can women protect themselves in public or online spaces?',
    answer: 'In Public Spaces:\n- Stay alert and aware of your surroundings.\n- Share live location with a trusted contact when traveling at odd hours.\n- Use well-lit, populated routes.\n- Carry safety tools like pepper spray (where legally allowed).\n- Trust your instincts—if something feels wrong, seek help.\n\nIn Online Spaces:\n- Use strong passwords and two-factor authentication.\n- Keep social media profiles private.\n- Don’t share personal details like address or contact numbers publicly.\n- Report and block harassers immediately.\n- Use official platforms like the Cyber Crime Portal to report abuse.',
  },
  {
    id: '4',
    question: 'What punishment does Indian law prescribe for rape?',
    answer: 'Punishment for rape under the Indian Penal Code (IPC) is very strict:\n- Basic Punishment (Section 376): Minimum 10 years to life imprisonment, plus a fine.\n- Aggravated Rape (e.g., by a person in a position of trust): Imprisonment for 10 years to life, and a fine.\n- Rape of a Minor: Minimum 20 years to life imprisonment, and can extend to the death penalty in severe cases.',
  },
  {
    id: '5',
    question: 'What rights do acid attack survivors have?',
    answer: 'Acid attack survivors in India have comprehensive support. All hospitals must provide free and immediate medical treatment. Survivors are eligible for a minimum compensation of ₹3 lakhs. They are also recognized as persons with disabilities, granting them rights to job reservations, government schemes, and rehabilitation services. Strict guidelines also regulate the sale of acid.',
  },
  {
    id: '6',
    question: 'What immediate steps should be taken if someone is attacked with acid?',
    answer: '1. Call emergency services immediately (Dial 112 in India).\n2. Remove contaminated clothing carefully.\n3. Rinse the affected area with clean, cool water continuously for at least 30 minutes. Do not rub.\n4. Do not apply any creams or ointments.\n5. Get the victim to a hospital or burn centre immediately.',
  },
  {
    id: '7',
    question: 'What to do if I am cyber trolled or blackmailed with morphed photos?',
    answer: "If you're cyber trolled or blackmailed, stay calm and act immediately. Save all evidence (screenshots, messages, links). Do not engage with the blackmailer. Report the incident on the National Cyber Crime Portal (cybercrime.gov.in) or call 1930. Laws under the IT Act protect you. Report the fake profile on social media and block the offender. Reach out to trusted family or NGOs for support.",
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

export default function HarassmentScreen() {
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
      <Text style={styles.header}>Harassment & Your Rights</Text>
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