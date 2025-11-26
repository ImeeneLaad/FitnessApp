import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#23232a',
  backgroundGradientTo: '#23232a',
  color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#9b59b6',
  },
};

const dummyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [2, 3, 1, 4, 2, 5, 3],
      color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
    },
  ],
};

export default function ProgressPage(props) {
  console.log('ProgressPage props:', props);
  const { setCurrentPage } = props || {};
  const [filter, setFilter] = useState('weekly');
  
  const handleBackPress = () => {
    console.log('Back button pressed');
    if (typeof setCurrentPage === 'function') {
      setCurrentPage('dashboard');
    } else {
      console.error('setCurrentPage is not a function');
      // Fallback or show error to user
    }
  };

  const totalWorkouts = 21;
  const caloriesBurned = 4200;
  const weeklyGoal = 5;
  const workoutsThisWeek = 4;
  const percent = (workoutsThisWeek / weeklyGoal) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#181824' }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBackPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={28} color="#a5b4fc" style={{ marginRight: 2 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'weekly' && styles.activeFilter]}
          onPress={() => setFilter('weekly')}
        >
          <Text style={styles.filterText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'monthly' && styles.activeFilter]}
          onPress={() => setFilter('monthly')}
        >
          <Text style={styles.filterText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={dummyData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Circular Progress for Weekly Goal */}
      <View style={styles.circularContainer}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={percent}
          tintColor="#9b59b6"
          backgroundColor="#444"
          duration={1000}
        >
          {fill => (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.circularText}>{workoutsThisWeek}/{weeklyGoal}</Text>
              <Text style={styles.circularLabel}>Workouts</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.goalLabel}>Weekly Goal</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{caloriesBurned}</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181824',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181824',
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#181824',
    elevation: 4,
    position: 'relative',
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
    top: 40,  // <-- add this to push it down by 10 pixels
  },
    contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    fontFamily: 'System', // Replace with custom sporty font if available
    letterSpacing: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#23232a',
    borderRadius: 16,
    padding: 4,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  activeFilter: {
    backgroundColor: '#9b59b6',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: '#23232a',
    borderRadius: 16,
    padding: 12,
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  chart: {
    borderRadius: 16,
  },
  circularContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  circularText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  circularLabel: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  goalLabel: {
    color: '#9b59b6',
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#23232a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  backButtonText: {
    color: '#a5b4fc',
    fontSize: 16,
    fontWeight: '600',
  },  
});
