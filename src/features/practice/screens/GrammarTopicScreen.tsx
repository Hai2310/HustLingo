import React, { useCallback, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/common/Buttons';
import { Screen } from '@/components/common/Screen';
import { colors } from '@/theme/colors';
import { hum, paperButton } from '@/theme/hum';
import { PracticeNotice, practiceStyles } from '../components/PracticeUI';
import { practiceStatus, PracticeStatusBadge, usePracticeStatus } from '../components/PracticeStatus';
import { grammarPageSize, grammarTopicLabel, grammarTopicTitle, loadGrammarPage } from '../data/catalog';
import { usePracticeRequest } from '../hooks/usePracticeRequest';

export default function GrammarTopicScreen() {
  const { topic, page: pageParam } = useLocalSearchParams<{ topic: string; page?: string }>();
  const requestedPage = Number(pageParam);
  const validPage = Number.isInteger(requestedPage) && requestedPage > 0 && Number.isSafeInteger(requestedPage * grammarPageSize);
  const page = validPage ? requestedPage : 1;
  const load = useCallback((signal: AbortSignal) => loadGrammarPage(page, topic, signal), [page, topic]);
  const request = usePracticeRequest(load);
  const statusFor = usePracticeStatus();
  const questions = request.data?.rows.map(row => ({ ...row, status: statusFor('grammar', row.id) })) ?? [];
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const total = request.data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / grammarPageSize));
  const changePage = (value: number) => {
    router.setParams({ page: String(value) });
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <Screen scrollRef={scrollRef} contentStyle={[practiceStyles.page, styles.page]}>
      <AppButton title="Về nhóm ngữ pháp" icon="arrow-back" variant="secondary" style={styles.back} onPress={() => {
        router.dismissTo({ pathname: '/(tabs)/practice', params: { skill: 'grammar' } });
      }} />
      <View style={styles.heading}>
        <Text style={practiceStyles.label}>{grammarTopicLabel(topic)}</Text>
        <Text accessibilityRole="header" aria-level={1} style={practiceStyles.title}>{grammarTopicTitle(topic)}</Text>
        {total > 0 && <Text style={practiceStyles.detail}>{total.toLocaleString('vi-VN')} câu hỏi</Text>}
      </View>
      {request.loading ? <PracticeNotice loading message="Đang tải danh sách câu hỏi…" /> : request.error ? (
        <PracticeNotice message={request.error} retry={request.retry} />
      ) : questions.length ? (
        <>
          <View style={styles.legend} accessibilityLabel="Kết quả lần làm gần nhất">
            <PracticeStatusBadge status="correct" />
            <PracticeStatusBadge status="incorrect" />
            <PracticeStatusBadge status="unanswered" />
            {questions.some(question => question.status === 'completed') && <PracticeStatusBadge status="completed" />}
          </View>
          <View style={styles.grid}>
            {questions.map(({ id, status }, index) => {
              const number = String((page - 1) * grammarPageSize + index + 1);
              const result = status ? practiceStatus[status] : undefined;
              return (
                <Link key={id} href={{ pathname: '/practice/[exerciseId]', params: { exerciseId: id, skill: 'grammar', fromTopic: topic, page: String(page), number } }} style={[styles.question, width >= 680 && styles.questionWide, result && { borderColor: result.edge }]} asChild>
                  <Pressable accessibilityRole="link" accessibilityLabel={result ? `Câu ${number}, ${result.label}` : `Câu ${number}`}>
                    <Text style={styles.number}>Câu {number}</Text>
                    {status && status !== 'unanswered' && <PracticeStatusBadge status={status} compact />}
                  </Pressable>
                </Link>
              );
            })}
          </View>
          {lastPage > 1 && (
            <View style={styles.pagination}>
              <AppButton title="Trang trước" variant="secondary" disabled={page <= 1} onPress={() => changePage(page - 1)} />
              <Text accessibilityLiveRegion="polite" style={practiceStyles.label}>Trang {page} / {lastPage}</Text>
              <AppButton title="Trang sau" variant="secondary" disabled={page >= lastPage} onPress={() => changePage(page + 1)} />
            </View>
          )}
        </>
      ) : (
        <>
          <PracticeNotice message={page > 1 ? 'Trang này không có câu hỏi.' : 'Nhóm này chưa có câu hỏi đã xuất bản.'} />
          {page > 1 && <AppButton title="Về trang đầu" variant="secondary" style={styles.back} onPress={() => changePage(1)} />}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { maxWidth: 820 },
  back: { alignSelf: 'flex-start' },
  heading: { gap: 5 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: '2%', rowGap: 8 },
  question: { ...paperButton, borderColor: hum.rule, backgroundColor: colors.white, width: '32%', minHeight: 52, padding: 6, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  questionWide: { width: '15%' },
  number: { flexShrink: 1, color: hum.ink, fontSize: 15, fontWeight: '700', textAlign: 'center', fontVariant: ['tabular-nums'] },
  pagination: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' },
});
