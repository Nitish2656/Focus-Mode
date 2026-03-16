import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GLOSSARY = [
  { term: 'Transformer', definition: 'The architecture behind modern LLMs, utilizing self-attention mechanisms to process sequence data in parallel.' },
  { term: 'Overfitting', definition: 'When a model learns the noise in training data rather than the signal, leading to poor performance on new data.' },
  { term: 'Backpropagation', definition: 'The algorithm used to calculate gradients in neural networks to update weights during training.' },
  { term: 'RAG (Retrieval-Augmented Generation)', definition: 'A technique that combines LLMs with external knowledge bases to provide factually accurate answers.' },
  { term: 'Gradient Descent', definition: 'An optimization algorithm that iteratively adjusts weights to minimize the loss function.' },
  { term: 'Linear Regression', definition: 'A statistical method used to model the relationship between a dependent variable and one or more independent variables.' },
  { term: 'Precision', definition: 'The ratio of true positive predictions to the total number of positive predictions made.' },
  { term: 'Recall', definition: 'The ratio of true positive predictions to the actual number of positive instances in the data.' },
  { term: 'Embeddings', definition: 'Vector representations of text that capture semantic meaning, allowing machines to compare concepts mathematically.' },
  { term: 'Fine-Tuning', definition: 'The process of taking a pre-trained model and training it further on a smaller, specific dataset.' },
  { term: 'Hyperparameter', definition: 'A configuration setting external to the model whose value is set before the learning process begins.' },
  { term: 'Bias', definition: 'The error introduced by approximating a real-world problem with a simplified model.' },
  { term: 'Variance', definition: 'The amount by which a model\'s prediction would change if it were trained on a different dataset.' },
];

export default function StudyBuddyScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return GLOSSARY.filter(item => 
      item.term.toLowerCase().includes(query.toLowerCase()) || 
      item.definition.toLowerCase().includes(query.toLowerCase())
    ).sort((a,b) => a.term.localeCompare(b.term));
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Buddy</Text>
        <Text style={styles.subtitle}>Your offline DS knowledge base 🧠</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#64748b" style={{marginRight: 10}} />
        <TextInput
          placeholder="Search DS/LLM terms..."
          placeholderTextColor="#64748b"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
        {query !== '' && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.term}
        contentContainerStyle={{paddingBottom: 40}}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{alignItems: 'center', marginTop: 40}}>
            <Text style={{color: '#64748b', fontSize: 14}}>No matching terms found. Keep learning! 🚀</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 20, paddingTop: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#14141e', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  input: { flex: 1, color: '#f8fafc', fontSize: 15, fontWeight: '600' },

  card: { backgroundColor: '#14141e', padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  term: { fontSize: 18, fontWeight: '800', color: '#7c3aed', marginBottom: 8 },
  definition: { fontSize: 14, color: '#94a3b8', lineHeight: 20 }
});
