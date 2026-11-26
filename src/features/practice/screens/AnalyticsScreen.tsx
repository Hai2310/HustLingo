import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { summarisePractice, suggestions } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { Card, PButton, PracticeShell, ProgressBar, StateView, Stat, ui } from '../components/PracticeUI';

const color = (percent: number) => percent >= 70 ? colors.success : percent >= 40 ? colors.warning : colors.error;

export function AnalyticsScreen() {
  const { data, ready } = usePracticeData();
  const summary = useMemo(() => summarisePractice(data, new Date()), [data]);
  const tips = useMemo(() => suggestions(data.results.flatMap(result => result.answers)), [data]);
  // Accuracy of the last 10 scored sessions, oldest → newest.
  const trend = data.results.filter(result => result.total > 0).slice(0, 10).reverse();

  if (!ready) return <PracticeShell title="Phân tích"><StateView kind="loading" title="Đang tổng hợp" /></PracticeShell>;
  if (!data.results.length) return <PracticeShell kicker="ANALYTICS" title="Phân tích luyện tập"><StateView kind="empty" title="Chưa có dữ liệu" description="Hoàn thành vài bài luyện để thấy độ chính xác theo kỹ năng và dạng câu hỏi." action="Làm quiz đầu tiên" onAction={() => router.replace('/practice/quiz')} /></PracticeShell>;

  return <PracticeShell kicker="ANALYTICS" title="Phân tích luyện tập" subtitle={`${data.results.length} lượt gần nhất được lưu trên thiết bị này.`}>
    <Card style={styles.stats}>
      <Stat value={summary.sessions} label="lượt luyện" />
      <Stat value={summary.questions} label="câu đã làm" />
      <Stat value={summary.questions ? `${summary.accuracy}%` : '—'} label="độ chính xác" />
      <Stat value={summary.minutes} label="phút luyện" />
    </Card>

    {trend.length > 1 ? <><Text style={ui.sectionTitle}>Xu hướng {trend.length} lượt gần nhất</Text>
      <Card>
        <View style={styles.chart} accessibilityLabel={`Độ chính xác: ${trend.map(r => Math.round(r.correct / r.total * 100)).join(', ')} phần trăm`}>
          {trend.map(result => { const p = Math.round(result.correct / result.total * 100); return <Pressable key={result.id} accessibilityRole="button" accessibilityLabel={`${result.title}: ${p}%`} onPress={() => router.push({ pathname: '/practice/result', params: { id: result.id } })} style={styles.barWrap}>
            <Text style={styles.barValue}>{p}</Text>
            <View style={[styles.bar, { height: `${Math.max(4, p)}%`, backgroundColor: color(p) }]} />
          </Pressable>; })}
        </View>
      </Card></> : null}

    <Text style={ui.sectionTitle}>Theo kỹ năng</Text>
    <Card style={{ gap: 14 }}>
      {summary.byMode.map(mode => <View key={mode.mode} style={{ gap: 6 }}>
        <View style={styles.row}><Text style={styles.label}>{mode.label}</Text><Text style={styles.value}>{mode.sessions} lượt{mode.accuracy || ['vocabulary', 'review', 'listening', 'reading', 'toeic'].includes(mode.mode) ? ` · ${mode.accuracy}%` : ' · tự đánh giá'}</Text></View>
        <ProgressBar percent={mode.accuracy} label={mode.label} color={color(mode.accuracy)} />
      </View>)}
    </Card>

    {summary.weakKinds.length ? <><Text style={ui.sectionTitle}>Dạng câu hỏi yếu nhất</Text>
      <Card style={{ gap: 14 }}>{summary.weakKinds.map(kind => <View key={kind.kind} style={{ gap: 6 }}><View style={styles.row}><Text style={styles.label}>{kind.label}</Text><Text style={styles.value}>{kind.correct}/{kind.total} · {kind.percent}%</Text></View><ProgressBar percent={kind.percent} label={kind.label} color={color(kind.percent)} /></View>)}</Card></> : null}

    {tips.length ? <><Text style={ui.sectionTitle}>Nên ôn tiếp</Text><View style={{ gap: 10 }}>{tips.map(tip => <Card key={tip.kind} tone="soft"><Text style={styles.label}>{tip.label}</Text><Text style={ui.body}>{tip.advice}</Text></Card>)}</View></> : null}

    <Text style={ui.sectionTitle}>Lịch ôn từ vựng</Text>
    <Card style={styles.stats}>
      <Stat value={summary.srs.dueNow} label="đến hạn hôm nay" />
      <Stat value={summary.srs.learning} label="đang học" />
      <Stat value={summary.srs.review} label="cần ôn" />
      <Stat value={summary.srs.mastered} label="đã nhớ" />
    </Card>
    <View style={[ui.actions, { marginTop: 16 }]}><PButton label="Ôn tập ngay" icon="albums-outline" onPress={() => router.push('/practice/review')} /></View>
  </PracticeShell>;
}

export default AnalyticsScreen;

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between' },
  chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 4 },
  bar: { width: '100%', maxWidth: 34, borderRadius: 6 },
  barValue: { fontSize: 10.5, color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
  value: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, fontVariant: ['tabular-nums'] },
});
