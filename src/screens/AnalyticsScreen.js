import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart, LineChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { useAppContext, getWarriorRank } from '../AppContext';
import * as UsageStats from 'expo-android-usagestats';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { state } = useAppContext();
  const [externalStats, setExternalStats] = React.useState(null);
  const [loadingExtras, setLoadingExtras] = React.useState(true);

  React.useEffect(() => {
    fetchExternalStats();
  }, []);

  const fetchExternalStats = async () => {
    try {
        const hasPerm = await UsageStats.hasUsageStatsPermission();
        if (!hasPerm) {
            setLoadingExtras(false);
            return;
        }

        const now = Date.now();
        const start = now - (7 * 24 * 60 * 60 * 1000);
        const stats = await UsageStats.queryAndAggregateUsageStats(start, now);
        
        let distractionMins = 0;
        if (stats) {
            Object.values(stats).forEach(pkg => {
                if (state.blocklist.includes(pkg.packageName)) {
                    distractionMins += (pkg.totalTimeInForeground || 0) / 60000;
                }
            });
        }
        setExternalStats(Math.round(distractionMins));
    } catch (e) {
        console.warn('Usage Fetch Error:', e);
    } finally {
        setLoadingExtras(false);
    }
  };

  // 1. Weekly Study Hours (Bar Chart)
  const weeklyData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + i); // Start from Mon
        const key = d.toISOString().slice(0, 10);
        if (state.history && state.history[key]) {
            data[i] = Math.round((state.history[key].time || 0) / 3600); // 1-decimal if needed?
        }
    }
    return { labels, datasets: [{ data }] };
  }, [state.history]);

  // 2. Roadmap Completion (Progress Ring)
  const roadmapProgress = useMemo(() => {
    const completed = Object.values(state.checked || {}).filter(Boolean).length;
    return {
      labels: ["Roadmap"],
      data: [Math.min(1, completed / 112)]
    };
  }, [state.checked]);

  // 3. Subject Distribution (Pie Chart)
  const subjectData = useMemo(() => {
    const topics = {};
    if (state.history) {
        Object.values(state.history).forEach(day => {
            if (day.topics) {
                Object.entries(day.topics).forEach(([topic, time]) => {
                    topics[topic] = (topics[topic] || 0) + time;
                });
            }
        });
    }

    const COLORS = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
    return Object.entries(topics).map(([name, time], i) => ({
      name,
      population: Math.round(time / 60), // minutes
      color: COLORS[i % COLORS.length],
      legendFontColor: '#94a3b8',
      legendFontSize: 12,
    }));
  }, [state.history]);

  // 4. Focus Trend (Line Chart)
  const trendData = useMemo(() => {
    const data = [];
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        labels.push(key.slice(8, 10)); // Just day number
        data.push(state.history?.[key]?.sessions || 0);
    }
    return { labels, datasets: [{ data }] };
  }, [state.history]);

  const chartConfig = {
    backgroundGradientFrom: '#14141e',
    backgroundGradientTo: '#14141e',
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#7c3aed"
    }
  };

  const warrior = getWarriorRank(calculateTotalScore(state));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your progress as a data warrior 🛡️</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{state.streak || 0}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{state.maxStreak || 0}</Text>
          <Text style={styles.statLabel}>Max Streak</Text>
        </View>
      </View>

      {/* Roadmap Ring */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>🎯 Roadmap Progress</Text>
        <View style={{alignItems: 'center', marginVertical: 10}}>
          <ProgressChart
            data={roadmapProgress}
            width={screenWidth - 80}
            height={160}
            strokeWidth={16}
            radius={60}
            chartConfig={{...chartConfig, color: (opacity=1) => `rgba(16, 185, 129, ${opacity})` }}
            hideLegend={false}
          />
        </View>
        <Text style={styles.innerValue}>{Math.round(roadmapProgress.data[0] * 100)}%</Text>
      </View>

      {/* Study Hours Bar */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📊 Weekly Study Hours</Text>
        <BarChart
          data={weeklyData}
          width={screenWidth - 60}
          height={220}
          yAxisLabel=""
          yAxisSuffix="h"
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={{marginVertical: 16, borderRadius: 16}}
          fromZero
        />
      </View>

      {/* Focus Trend Line */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📈 Daily Focus Sessions</Text>
        <LineChart
          data={trendData}
          width={screenWidth - 60}
          height={220}
          chartConfig={{...chartConfig, color: (opacity=1) => `rgba(168, 85, 247, ${opacity})` }}
          bezier
          style={{marginVertical: 16, borderRadius: 16}}
        />
      </View>

      {/* Subject Pie */}
      {subjectData.length > 0 && (
        <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>🍕 Subject Distribution (m)</Text>
            <PieChart
                data={subjectData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
            />
        </View>
      )}

      {/* External Usage Comparison */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📱 Screen Time: Focus vs Distraction</Text>
        {loadingExtras ? (
            <ActivityIndicator color="#7c3aed" style={{marginTop: 20}} />
        ) : (
            <View style={{marginTop: 20, alignItems: 'center'}}>
                <ProgressChart
                    data={{
                        labels: ["Study", "Lost"],
                        data: [
                            0.7, // Placeholder or calculated ratio
                            Math.min(1, (externalStats || 0) / 300) 
                        ]
                    }}
                    width={screenWidth - 80}
                    height={160}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{...chartConfig, color: (opacity=1, i) => i === 0 ? `rgba(16, 185, 129, ${opacity})` : `rgba(239, 68, 68, ${opacity})` }}
                    hideLegend={false}
                />
                <Text style={{color: '#94a3b8', fontSize: 12, marginTop: 10}}>
                    Distraction Mins (7d): <Text style={{color: '#ef4444', fontWeight: 'bold'}}>{externalStats || 0}m</Text>
                </Text>
            </View>
        )}
      </View>

      {/* Warrior Rank */}
      <View style={[styles.chartCard, {backgroundColor: '#1a1a2e', borderColor: warrior.color}]}>
        <Text style={styles.chartTitle}>⚔️ Warrior Identity</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
             <View style={[styles.rankBox, {backgroundColor: warrior.color}]}>
                <Text style={{color: '#fff', fontSize: 18, fontWeight: '900'}}>{warrior.rank}</Text>
             </View>
        </View>
        <Text style={{color: '#94a3b8', fontSize: 12, marginTop: 10}}>Total Reputation Score: {calculateTotalScore(state)}</Text>
      </View>

    </ScrollView>
  );
}

const calculateTotalScore = (state) => {
    const done = Object.values(state.checked || {}).filter(Boolean).length;
    const habitDays = state.habits?.reduce((s, h) => s + (h.streak || 0), 0) || 0;
    const sessions = state.focusSessions || 0;
    return Math.round(done * 3 + (state.streak || 0) * 5 + habitDays * 2 + sessions);
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, paddingBottom: 100, backgroundColor: '#0a0a0f' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#14141e', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '900', color: '#7c3aed' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontWeight: '700', textTransform: 'uppercase' },

  chartCard: { backgroundColor: '#14141e', padding: 16, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  chartTitle: { fontSize: 13, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  innerValue: { position: 'absolute', top: 95, left: (screenWidth-120)/2, width: 80, textAlign: 'center', fontSize: 20, fontWeight: '900', color: '#10b981' },
  
  rankBox: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
