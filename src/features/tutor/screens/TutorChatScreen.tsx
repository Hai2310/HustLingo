import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen } from '@/components/common/Screen';
import { AppButton } from '@/components/common/Buttons';
import { ChatBubble, CorrectionCard, TutorAvatar, TypingIndicator } from '../components';
import { scenarios } from '../data/scenarios';
import { tutors } from '../data/tutors';
import { useTutorChat } from '../hooks/useTutorChat';
import { colors } from '@/theme/colors';

export default function TutorChatScreen() {
  const { scenarioId, tutorId } = useLocalSearchParams<{ scenarioId: string; tutorId: string }>();
  const scenario = scenarios.find(item => item.id === scenarioId) || scenarios[0];
  const tutor = tutors.find(item => item.id === tutorId) || tutors[0];
  const chat = useTutorChat(scenario, tutor.id);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => { listRef.current?.scrollToEnd({ animated: true }); }, [chat.session.messages.length, chat.status]);

  const endSession = () => {
    Alert.alert('End practice?', 'Your session summary will be ready after you finish.', [
      { text: 'Keep practising', style: 'cancel' },
      { text: 'End session', style: 'destructive', onPress: async () => { await chat.finish(); router.replace('/tutor/summary'); } },
    ]);
  };

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    setDraft('');
    chat.sendMessage(value);
  };

  return (
    <Screen scroll={false} ambient={false} contentStyle={styles.screenContent}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={styles.header}><PageHeader title={scenario.title} subtitle={`${tutor.name} · ${scenario.level}`} right={<Pressable onPress={endSession} style={styles.end}><Ionicons name="stop-circle-outline" size={18} color={colors.primary} /></Pressable>} /></View>
        <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>Practice session · live</Text><Text style={styles.counter}>{chat.session.messages.filter(item => item.role === 'learner').length}/30</Text></View>
        <FlatList
          ref={listRef}
          style={styles.list}
          contentContainerStyle={styles.messages}
          data={chat.session.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          ListFooterComponent={<>
            {chat.status === 'loading' && <TypingIndicator />}
            {chat.lastCorrection && <CorrectionCard correction={chat.lastCorrection} />}
            {chat.error && <View style={styles.error}><Ionicons name="warning-outline" size={16} color={colors.error} /><Text style={styles.errorText}>{chat.error}</Text><Pressable onPress={chat.retry}><Text style={styles.retry}>Retry</Text></Pressable></View>}
          </>}
        />
        {chat.suggestedReplies.length > 0 && chat.status === 'ready' && (
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={chat.suggestedReplies} keyExtractor={item => item} contentContainerStyle={styles.suggestions} renderItem={({ item }) => <Pressable onPress={() => { setDraft(item); }} style={styles.suggestion}><Text style={styles.suggestionText}>{item}</Text></Pressable>} />
        )}
        <View style={styles.tools}><Pressable disabled={chat.status === 'loading'} onPress={chat.requestHint} style={styles.tool}><Ionicons name="bulb-outline" size={15} color={colors.orange} /><Text style={styles.toolText}>Hint</Text></Pressable><Pressable disabled={chat.status === 'loading'} onPress={chat.requestCorrection} style={styles.tool}><Ionicons name="sparkles-outline" size={15} color={colors.violet} /><Text style={styles.toolText}>Correct last</Text></Pressable><Pressable onPress={endSession} style={[styles.tool, styles.finishTool]}><Text style={styles.finishText}>Finish</Text></Pressable></View>
        <View style={styles.composer}><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Write your reply..." placeholderTextColor={colors.textMuted} multiline maxLength={500} style={styles.input} /><Pressable onPress={send} disabled={!draft.trim() || chat.status === 'loading'} style={[styles.send, (!draft.trim() || chat.status === 'loading') && styles.sendDisabled]}><Ionicons name="arrow-up" size={20} color={colors.white} /></Pressable></View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, paddingHorizontal: 0, paddingTop: 8 },
  container: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' },
  header: { paddingHorizontal: 18 },
  end: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingBottom: 10 },
  statusDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: colors.success },
  statusText: { flex: 1, fontSize: 10, fontWeight: '800', color: colors.textSecondary },
  counter: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  list: { flex: 1 },
  messages: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10 },
  suggestions: { paddingHorizontal: 18, paddingBottom: 8, gap: 7 },
  suggestion: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 11, backgroundColor: colors.primarySoft },
  suggestionText: { maxWidth: 220, fontSize: 10, fontWeight: '800', color: colors.primaryDeep },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  tool: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, backgroundColor: colors.surface },
  toolText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },
  finishTool: { marginLeft: 'auto', backgroundColor: colors.surfaceAlt },
  finishText: { fontSize: 10, fontWeight: '900', color: colors.primary },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 18, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 12 : 9, backgroundColor: colors.surface },
  input: { flex: 1, maxHeight: 92, minHeight: 46, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 15, backgroundColor: colors.surfaceAlt, color: colors.text, fontSize: 13, lineHeight: 19 },
  send: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendDisabled: { opacity: 0.45 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3, padding: 11, borderRadius: 12, backgroundColor: colors.errorSoft },
  errorText: { flex: 1, fontSize: 10.5, lineHeight: 16, color: colors.error },
  retry: { fontSize: 10, fontWeight: '900', color: colors.error },
});
