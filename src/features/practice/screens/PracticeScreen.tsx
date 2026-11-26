import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { colors } from '@/theme/colors';
import { useLearning } from '@/contexts/LearningContext';
import { PRACTICE_MODES } from '../data/practiceModes';
import { MODE_LABELS, summarisePractice } from '../engine/analytics';
import { usePracticeData } from '../hooks/usePracticeData';
import { PButton, ProgressBar, Stat, ui } from '../components/PracticeUI';

const GROUPS = [
  { id: 'core', title: 'Từ vựng' },
  { id: 'skill', title: 'Bốn kỹ năng' },
  { id: 'exam', title: 'Luyện thi' },
] as const;

export function PracticeScreen() {
  const { data, ready } = usePracticeData();
  const { state } = useLearning();
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const summary = useMemo(() => summarisePractice(data, new Date()), [data]);
  // Words the learner flagged in Lessons are introduced first in the review queue.
  const pendingNew = state.reviewWordIds.filter(id => !data.srs[id]).length + state.savedWordIds.filter(id => !data.srs[id] && !state.reviewWordIds.includes(id)).length;
  const reviewToday = summary.srs.dueNow + Math.min(8, pendingNew);
  const columns = width >= 980 ? 4 : width >= 560 ? 2 : 1;
  const cardWidth = columns === 1 ? '100%' : `${(100 - (columns - 1) * 1.6) / columns}%`;
  const recent = data.results.slice(0, 4);

  return <Screen ambient={false} contentStyle={ui.content}>
    <Text style={ui.kicker}>PRACTICE</Text>
    <Text style={styles.heading}>Luyện tập</Text>
    <Text style={ui.subtitle}>Làm bài, ôn đúng lúc, theo dõi điểm yếu và luyện thi trên cùng một chỗ.</Text>

    <View style={[styles.hero, !wide && { flexDirection: 'column' }]}>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.heroKicker}>ÔN TẬP HÔM NAY</Text>
        <Text style={styles.heroTitle}>{!ready ? 'Đang tải…' : reviewToday ? `${reviewToday} thẻ đang chờ bạn` : 'Không có thẻ đến hạn'}</Text>
        <Text style={styles.heroText}>{summary.srs.dueNow ? `${summary.srs.dueNow} từ đến hạn ôn theo lịch lặp lại ngắt quãng.` : 'Làm Vocabulary Quiz hoặc học từ mới để tạo lịch ôn.'}{pendingNew ? ` ${Math.min(8, pendingNew)} từ bạn đã đánh dấu ở Bài học sẽ được thêm vào.` : ''}</Text>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <PButton label={reviewToday ? 'Bắt đầu ôn' : 'Ôn từ mới'} icon="albums-outline" onPress={() => router.push('/practice/review')} />
          <PButton label="Làm quiz nhanh" variant="secondary" icon="flash-outline" onPress={() => router.push('/practice/quiz')} />
        </View>
      </View>
      <View style={[styles.heroStats, !wide && { width: '100%' }]}>
        <View style={styles.statRow}><Stat tone="dark" value={ready ? summary.sessions : '—'} label="lượt luyện tập" /><Stat tone="dark" value={ready && summary.questions ? `${summary.accuracy}%` : '—'} label="độ chính xác" /></View>
        <View style={styles.divider} />
        <View style={styles.srsRow}>
          {([['Đang học', summary.srs.learning, colors.blue], ['Cần ôn', summary.srs.review, colors.orange], ['Đã nhớ', summary.srs.mastered, colors.mint]] as const).map(([label, value, color]) => <View key={label} style={{ flex: 1 }}><Text style={[styles.srsValue, { color }]}>{ready ? value : '—'}</Text><Text style={styles.srsLabel}>{label}</Text></View>)}
        </View>
      </View>
    </View>

    {GROUPS.map(group => <View key={group.id}>
      <Text style={ui.sectionTitle}>{group.title}</Text>
      <View style={styles.grid}>
        {PRACTICE_MODES.filter(mode => mode.group === group.id).map(mode => {
          const stat = summary.byMode.find(item => item.mode === mode.id);
          return <Pressable key={mode.id} accessibilityRole="button" accessibilityLabel={`${mode.title}. ${mode.subtitle}`} onPress={() => router.push(mode.route as Href)} style={({ pressed }) => [styles.modeCard, { width: cardWidth as any }, pressed && { opacity: .85 }]}>
            <View style={styles.modeTop}>
              <View style={[styles.modeIcon, { backgroundColor: mode.background }]}><Ionicons name={mode.icon} size={23} color={mode.color} /></View>
              <Ionicons name="arrow-forward" size={18} color={colors.textMuted} />
            </View>
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeSub}>{mode.subtitle}</Text>
            <Text style={styles.modeMeta}>{stat ? `${stat.sessions} lượt${stat.accuracy || mode.id === 'vocabulary' ? ` · ${stat.accuracy}% đúng` : ''}` : 'Chưa luyện'}</Text>
          </Pressable>;
        })}
      </View>
    </View>)}

    <View style={styles.sectionHead}>
      <Text style={[ui.sectionTitle, { marginBottom: 0 }]}>Kết quả gần đây</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push('/practice/analytics')} style={styles.link}><Text style={styles.linkText}>Phân tích chi tiết</Text><Ionicons name="arrow-forward" size={15} color={colors.primary} /></Pressable>
    </View>
    {recent.length ? <View style={{ gap: 10 }}>
      {recent.map(result => {
        const percent = result.total ? Math.round(result.correct / result.total * 100) : null;
        return <Pressable key={result.id} accessibilityRole="button" accessibilityLabel={`${result.title}, ${percent ?? 'tự đánh giá'}`} onPress={() => router.push({ pathname: '/practice/result', params: { id: result.id } })} style={({ pressed }) => [ui.listCard, pressed && { opacity: .85 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flex: 1 }}><Text style={ui.muted}>{MODE_LABELS[result.mode].toUpperCase()} · {new Date(result.finishedAt).toLocaleDateString('vi-VN')}</Text><Text style={ui.cardTitle} numberOfLines={1}>{result.title}</Text></View>
            <Text style={styles.score}>{percent !== null ? `${result.correct}/${result.total}` : result.estimate?.value ?? 'Tự chấm'}</Text>
          </View>
          {percent !== null ? <ProgressBar percent={percent} label={`${percent}% đúng`} color={percent >= 70 ? colors.success : percent >= 40 ? colors.warning : colors.error} /> : null}
        </Pressable>;
      })}
    </View> : <View style={[ui.listCard, { alignItems: 'flex-start' }]}><Text style={ui.body}>Chưa có kết quả. Hoàn thành một bài luyện để thấy điểm, câu sai và gợi ý ôn tập ở đây.</Text></View>}
  </Screen>;
}

export default PracticeScreen;

const styles = StyleSheet.create({
  heading: { fontSize: 34, lineHeight: 42, fontWeight: '800', color: colors.text, letterSpacing: -1.1 },
  hero: { backgroundColor: colors.charcoal, borderRadius: 23, padding: 24, marginTop: 22, flexDirection: 'row', gap: 22 },
  heroKicker: { color: '#E9B8C3', fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  heroTitle: { color: colors.white, fontSize: 27, fontWeight: '800', lineHeight: 34, letterSpacing: -.6 },
  heroText: { color: '#C4BEC1', fontSize: 13, lineHeight: 20, maxWidth: 520 },
  heroStats: { width: 280, backgroundColor: '#2B2B32', borderRadius: 16, padding: 18 },
  statRow: { flexDirection: 'row', gap: 18 },
  divider: { height: 1, backgroundColor: '#414149', marginVertical: 14 },
  srsRow: { flexDirection: 'row', gap: 8 },
  srsValue: { fontSize: 20, fontWeight: '800' },
  srsLabel: { color: '#BDB7BD', fontSize: 11, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  modeCard: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 17, minHeight: 168 },
  modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 14 },
  modeSub: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary, marginTop: 4 },
  modeMeta: { fontSize: 11, color: colors.textMuted, marginTop: 'auto', paddingTop: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12, gap: 10 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 },
  linkText: { fontSize: 12.5, fontWeight: '700', color: colors.primary },
  score: { fontSize: 17, fontWeight: '800', color: colors.text },
});
