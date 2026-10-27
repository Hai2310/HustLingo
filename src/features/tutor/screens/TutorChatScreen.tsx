import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen } from '@/components/common/Screen';
import { ChatBubble, CorrectionCard, TypingIndicator } from '../components';
import { useTutorCatalog } from '../hooks/useTutorCatalog';
import { TutorDataState } from '../components/TutorDataState';
import type { TutorProfile, TutorScenario } from '../types';
import { useTutorChat } from '../hooks/useTutorChat';
import { colors } from '@/theme/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function TutorChatScreen() {
  const { user } = useAuth();
  const { scenarioId, tutorId } = useLocalSearchParams<{ scenarioId: string; tutorId: string }>();
  const data = useTutorCatalog();
  const scenario = data.catalog?.scenarios.find(item => item.id === scenarioId);
  const tutor = data.catalog?.tutors.find(item => item.id === scenario?.tutorId);
  if (data.loading) return <TutorDataState loading />;
  if (data.error) return <TutorDataState message={data.error} retry={data.retry} />;
  if (!scenario || !tutor || tutor.id !== tutorId) return <TutorDataState message="Không tìm thấy tình huống luyện tập của gia sư này." />;
  if (!scenario.starterPrompt) return <TutorDataState message="Tình huống chưa sẵn sàng để luyện tập." />;
  return <TutorChatWorkspace key={`${user.id}:${scenario.id}:${tutor.id}`} scenario={scenario} tutor={tutor} />;
}

function TutorChatWorkspace({ scenario, tutor }: { scenario: TutorScenario; tutor: TutorProfile }) {
  const chat = useTutorChat(scenario, tutor.id);
  const [draft, setDraft] = useState('');
  const [confirmEnd, setConfirmEnd] = useState(false);
  const listRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 700;

  useEffect(() => { listRef.current?.scrollToEnd({ animated: true }); }, [chat.session.messages.length, chat.status]);

  const complete = async () => {
    const summary = await chat.finish();
    if (summary) router.replace('/tutor/summary');
  };
  const retry = async () => {
    const summary = await chat.retry();
    if (summary) router.replace('/tutor/summary');
  };
  const endSession = () => {
    if (!chat.canSend) return;
    if (Platform.OS === 'web') {
      setConfirmEnd(true);
      return;
    }
    Alert.alert('End practice?', 'Your session summary will be ready after you finish.', [
      { text: 'Keep practising', style: 'cancel' },
      { text: 'End session', style: 'destructive', onPress: () => { void complete(); } },
    ]);
  };

  const send = () => {
    const value = draft.trim();
    if (!value || !chat.canSend) return;
    setDraft('');
    chat.sendMessage(value);
  };

  return (
    <Screen scroll={false} ambient={false} contentStyle={styles.screenContent}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={[styles.header, isDesktop && styles.desktopHeader]}><PageHeader title={scenario.title} subtitle={`${tutor.name} · ${scenario.level}`} right={<Pressable onPress={endSession} style={styles.end}><Ionicons name="stop-circle-outline" size={18} color={colors.primary} /></Pressable>} /></View>
        {confirmEnd && <View style={styles.confirmEnd}>
          <Text style={styles.toolText}>End practice and view your summary?</Text>
          <Pressable accessibilityRole="button" onPress={() => setConfirmEnd(false)} style={styles.tool}><Text style={styles.toolText}>Keep practising</Text></Pressable>
          <Pressable accessibilityRole="button" disabled={!chat.canSend} onPress={() => { setConfirmEnd(false); void complete(); }} style={styles.finishTool}><Text style={styles.finishText}>End session</Text></Pressable>
        </View>}
        <View style={[styles.workspace, isDesktop && styles.desktopWorkspace]}>
          {isDesktop && (
            <View style={styles.sessionRail}>
              <Text style={styles.railEyebrow}>SESSION</Text>
              <Text style={styles.railObjective}>{scenario.objective}</Text>
              <Text style={styles.railRole}>{scenario.learnerRole}</Text>
              <View style={styles.progressBlock}>
                <View style={styles.progressLabelRow}><Text style={styles.progressLabel}>Progress</Text><Text style={styles.progressValue}>{chat.session.messages.filter(item => item.role === 'learner').length}/30</Text></View>
                <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, (chat.session.messages.filter(item => item.role === 'learner').length / 30) * 100)}%` }]} /></View>
              </View>
              <Text style={styles.railSection}>Useful phrases</Text>
              <View style={styles.railPhrases}>{(scenario.suggestedPhrases || []).slice(0, 3).map(phrase => <Text key={phrase} style={styles.railPhrase}>{phrase}</Text>)}</View>
            </View>
          )}
          <View style={[styles.chatPane, isDesktop && styles.desktopChatPane]}>
            <View style={[styles.status, isMobile && styles.mobileStatus]}><View style={styles.statusDot} /><Text style={styles.statusText}>{chat.isDemo ? 'Demo · đăng nhập để luyện với AI thật' : chat.status === 'hydrating' ? 'Đang khôi phục phiên...' : 'AI practice'}</Text><Text style={styles.counter}>{chat.session.messages.filter(item => item.role === 'learner').length}/30</Text></View>
            <FlatList
              ref={listRef}
              style={styles.list}
              contentContainerStyle={[styles.messages, isDesktop && styles.desktopMessages]}
              data={chat.session.messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ChatBubble message={item} />}
              ListFooterComponent={<>
                {chat.status === 'loading' && <TypingIndicator />}
                {chat.lastCorrection && <CorrectionCard correction={chat.lastCorrection} />}
                {chat.error && <View style={styles.error}><Ionicons name="warning-outline" size={16} color={colors.error} /><Text style={styles.errorText}>{chat.error}</Text><Pressable onPress={() => { void retry(); }}><Text style={styles.retry}>Retry</Text></Pressable></View>}
              </>}
            />
            {chat.hint && (
              <View style={[styles.hintPanel, isMobile && styles.mobileHintPanel]}>
                <Ionicons name="bulb-outline" size={16} color={colors.orange} />
                <Text style={styles.hintText}>{chat.hint}</Text>
              </View>
            )}
            {chat.suggestedReplies.length > 0 && chat.status === 'ready' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionList} contentContainerStyle={[styles.suggestions, isMobile && styles.mobileSuggestions]}>
                {chat.suggestedReplies.map(reply => (
                  <Pressable key={reply} onPress={() => { setDraft(reply); }} style={styles.suggestion}>
                    <Text style={styles.suggestionText}>{reply}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
            <View style={[styles.tools, isMobile && styles.mobileTools]}>
              <Pressable disabled={!chat.canSend} onPress={chat.requestHint} style={[styles.tool, isMobile && styles.mobileTool]}><Ionicons name="bulb-outline" size={15} color={colors.orange} /><Text style={styles.toolText}>Hint</Text></Pressable>
              <Pressable disabled={!chat.canSend} onPress={chat.requestCorrection} style={[styles.tool, isMobile && styles.mobileTool]}><Ionicons name="sparkles-outline" size={15} color={colors.violet} /><Text style={styles.toolText}>{isMobile ? 'Correct' : 'Correct last'}</Text></Pressable>
              <Pressable onPress={endSession} style={[styles.tool, styles.finishTool, isMobile && styles.mobileTool, isMobile && styles.finishToolMobile]}><Ionicons name="stop-circle-outline" size={15} color={colors.primary} /><Text style={styles.finishText}>Finish</Text></Pressable>
            </View>
            <View style={[styles.composer, isMobile && styles.mobileComposer]}><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} placeholder="Write your reply..." placeholderTextColor={colors.textMuted} multiline maxLength={500} style={styles.input} /><Pressable onPress={send} disabled={!draft.trim() || !chat.canSend} style={[styles.send, (!draft.trim() || !chat.canSend) && styles.sendDisabled]}><Ionicons name="arrow-up" size={20} color={colors.white} /></Pressable></View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, alignSelf: 'center', paddingHorizontal: 0, paddingTop: 8 },
  container: { flex: 1, width: '100%', maxWidth: 1120, alignSelf: 'center' },
  header: { paddingHorizontal: 18 },
  desktopHeader: { paddingHorizontal: 0 },
  end: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  confirmEnd: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 12, marginBottom: 8, backgroundColor: colors.primarySoft, borderRadius: 12 },
  workspace: { flex: 1, minHeight: 0 },
  desktopWorkspace: { flexDirection: 'row', gap: 18, borderRadius: 18 },
  sessionRail: { width: 250, alignSelf: 'flex-start', padding: 18, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  railEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.1, color: colors.violet },
  railObjective: { marginTop: 14, fontSize: 16, lineHeight: 23, fontWeight: '900', color: colors.text },
  railRole: { marginTop: 10, fontSize: 11, lineHeight: 17, color: colors.textSecondary },
  progressBlock: { marginTop: 24 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 10, fontWeight: '900', color: colors.text },
  progressValue: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  progressTrack: { height: 6, marginTop: 8, overflow: 'hidden', borderRadius: 6, backgroundColor: colors.surfaceAlt },
  progressFill: { height: '100%', borderRadius: 6, backgroundColor: colors.primary },
  railSection: { marginTop: 26, fontSize: 11, fontWeight: '900', color: colors.text },
  railPhrases: { gap: 8, marginTop: 10 },
  railPhrase: { fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  chatPane: { flex: 1, minWidth: 0, minHeight: 0 },
  desktopChatPane: { paddingHorizontal: 10, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  mobileStatus: { paddingHorizontal: 12 },
  statusDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: colors.success },
  statusText: { flex: 1, fontSize: 10, fontWeight: '800', color: colors.textSecondary },
  counter: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  list: { flex: 1 },
  messages: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10 },
  desktopMessages: { paddingHorizontal: 26, paddingTop: 16 },
  hintPanel: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginHorizontal: 18, marginBottom: 6, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 11, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: '#F4D8AB' },
  mobileHintPanel: { marginHorizontal: 12 },
  hintText: { flex: 1, fontSize: 10.5, lineHeight: 16, color: colors.textSecondary },
  suggestionList: { flexGrow: 0, maxHeight: 44 },
  suggestions: { alignItems: 'center', gap: 7, paddingHorizontal: 18, paddingBottom: 7 },
  mobileSuggestions: { paddingHorizontal: 12 },
  suggestion: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 32, maxWidth: 250, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryWash },
  suggestionText: { fontSize: 10, lineHeight: 14, fontWeight: '800', color: colors.primaryDeep },
  tools: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  mobileTools: { gap: 6, paddingHorizontal: 12 },
  tool: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, backgroundColor: colors.surface },
  mobileTool: { flex: 1, justifyContent: 'center', paddingHorizontal: 7 },
  toolText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary },
  finishTool: { marginLeft: 'auto', backgroundColor: colors.surfaceAlt },
  finishToolMobile: { marginLeft: 0 },
  finishText: { fontSize: 10, fontWeight: '900', color: colors.primary },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 18, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 12 : 9, backgroundColor: colors.surface },
  mobileComposer: { paddingHorizontal: 12, paddingBottom: Platform.OS === 'ios' ? 16 : 10 },
  input: { flex: 1, maxHeight: 92, minHeight: 46, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 15, backgroundColor: colors.surfaceAlt, color: colors.text, fontSize: 13, lineHeight: 19 },
  send: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  sendDisabled: { opacity: 0.45 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3, padding: 11, borderRadius: 12, backgroundColor: colors.errorSoft },
  errorText: { flex: 1, fontSize: 10.5, lineHeight: 16, color: colors.error },
  retry: { fontSize: 10, fontWeight: '900', color: colors.error },
});
