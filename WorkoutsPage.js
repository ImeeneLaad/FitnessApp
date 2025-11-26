import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, ScrollView, Image, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BODY_PARTS = [
  {
    key: 'chest',
    name: 'Chest',
    icon: 'barbell-outline',
    exercises: ['Push-ups', 'Bench Press', 'Chest Fly', 'Incline Push-up'],
  },
  {
    key: 'back',
    name: 'Back',
    icon: 'fitness-outline',
    exercises: ['Pull-ups', 'Deadlift', 'Superman', 'Bent-over Row'],
  },
  {
    key: 'arms',
    name: 'Arms',
    icon: 'body-outline',
    exercises: ['Bicep Curl', 'Tricep Dip', 'Hammer Curl', 'Chin-up'],
  },
  {
    key: 'legs',
    name: 'Legs',
    icon: 'walk-outline',
    exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raise'],
  },
  {
    key: 'core',
    name: 'Core',
    icon: 'ellipse-outline',
    exercises: ['Crunches', 'Plank', 'Leg Raise', 'Russian Twist'],
  },
  {
    key: 'shoulders',
    name: 'Shoulders',
    icon: 'accessibility-outline',
    exercises: ['Shoulder Press', 'Lateral Raise', 'Front Raise', 'Pike Push-up'],
  },
];

const VIDEOS = [
  {
    id: '1',
    title: 'Full Body Home Workout',
    url: 'https://www.youtube.com/watch?v=UBMk30rjy0o',
    thumbnail: 'https://img.youtube.com/vi/UBMk30rjy0o/hqdefault.jpg',
  },
  {
    id: '2',
    title: '20 Min Abs Workout',
    url: 'https://www.youtube.com/watch?v=1919eTCoESo',
    thumbnail: 'https://img.youtube.com/vi/1919eTCoESo/hqdefault.jpg',
  },
  {
    id: '3',
    title: 'Legs & Glutes Workout',
    url: 'https://www.youtube.com/watch?v=2MoGxae-zyo',
    thumbnail: 'https://img.youtube.com/vi/2MoGxae-zyo/hqdefault.jpg',
  },
  {
    id: '4',
    title: 'Upper Body Strength',
    url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    thumbnail: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg',
  },
];

export default function WorkoutsPage(props) {
  // Destructure props with default values
  const { 
    setCurrentPage = () => console.warn('setCurrentPage not provided to WorkoutsPage'),
    selectedBodyPart,
    setSelectedBodyPart = () => {},
    activeTab = 'workout',
    setActiveTab = () => {},
    styles: propStyles = {}
  } = props || {};
  
  // Debug log to check if setCurrentPage is received
  console.log('WorkoutsPage - props:', { 
    hasSetCurrentPage: typeof setCurrentPage === 'function',
    selectedBodyPart,
    activeTab 
  });
  
  // Handle back button press with safety check
  const handleBackPress = () => {
    console.log('Back button pressed in WorkoutsPage');
    if (typeof setCurrentPage === 'function') {
      setCurrentPage('dashboard');
    } else {
      console.error('setCurrentPage is not a function in WorkoutsPage');
    }
  };
  const [selectedPart, setSelectedPart] = useState(null);
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState('workout'); // 'workout', 'log', 'videos', or 'stats'
  const [checkedExercises, setCheckedExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const timerRef = useRef(null);
  
  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);
  
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    if (selectedPart) setCheckedExercises([]);
  }, [selectedPart]);

  const handleCheck = (exercise) => {
    if (!checkedExercises.includes(exercise)) {
      const newChecked = [...checkedExercises, exercise];
      setCheckedExercises(newChecked);
      
      const newLogEntry = {
        part: selectedPart.name, 
        exercise, 
        date: new Date().toISOString(),
        duration: timeElapsed
      };
      
      setLog(prev => [newLogEntry, ...prev]);
      
      // If all exercises are checked, show summary
      if (newChecked.length === selectedPart.exercises.length) {
        setShowSummary(true);
      }
    }
  };
  
  const toggleFavorite = (exercise) => {
    setFavorites(prev => 
      prev.includes(exercise)
        ? prev.filter(fav => fav !== exercise)
        : [...prev, exercise]
    );
  };
  
  const getExerciseStats = () => {
    const stats = {
      totalWorkouts: log.length,
      totalTime: log.reduce((sum, entry) => sum + (entry.duration || 0), 0),
      byBodyPart: {},
      lastWorkout: log[0] ? new Date(log[0].date).toLocaleDateString() : 'Never'
    };
    
    log.forEach(entry => {
      stats.byBodyPart[entry.part] = (stats.byBodyPart[entry.part] || 0) + 1;
    });
    
    return stats;
  };
  
  const filterExercises = (exercises) => {
    if (!searchQuery) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter(ex => 
      ex.toLowerCase().includes(query) ||
      selectedPart.name.toLowerCase().includes(query)
    );
  };

  const renderBodyPart = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedPart(item);
        setSearchQuery('');
      }}
      activeOpacity={0.8}
    >
      <Ionicons name={item.icon} size={36} color="#8b5cf6" />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.exerciseCount}>{item.exercises.length} exercises</Text>
    </TouchableOpacity>
  );

  const renderVideo = ({ item }) => (
    <View style={styles.videoCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumb} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => Linking.openURL(item.url)}
        >
          <Ionicons name="play-circle" size={28} color="#8b5cf6" />
          <Text style={styles.playBtnText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBackPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={28} color="#a5b4fc" style={{ marginRight: 2 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Tracker</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'workout' && styles.tabActive]}
          onPress={() => setTab('workout')}
        >
          <Ionicons name="barbell" size={20} color={tab === 'workout' ? '#fff' : '#71717a'} />
          <Text style={[styles.tabText, tab === 'workout' && styles.tabTextActive]}>Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'log' && styles.tabActive]}
          onPress={() => setTab('log')}
        >
          <Ionicons name="list" size={20} color={tab === 'log' ? '#fff' : '#71717a'} />
          <Text style={[styles.tabText, tab === 'log' && styles.tabTextActive]}>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'stats' && styles.tabActive]}
          onPress={() => setTab('stats')}
        >
          <Ionicons name="stats-chart" size={20} color={tab === 'stats' ? '#fff' : '#71717a'} />
          <Text style={[styles.tabText, tab === 'stats' && styles.tabTextActive]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'videos' && styles.tabActive]}
          onPress={() => setTab('videos')}
        >
          <Ionicons name="play-circle" size={20} color={tab === 'videos' ? '#fff' : '#71717a'} />
          <Text style={[styles.tabText, tab === 'videos' && styles.tabTextActive]}>Videos</Text>
        </TouchableOpacity>
      </View>

      {/* Workout Grid */}
      {tab === 'workout' && (
        <>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
            <View style={styles.timerButtons}>
              <TouchableOpacity 
                style={[styles.timerButton, isTimerRunning ? styles.stopButton : styles.startButton]}
                onPress={toggleTimer}
              >
                <Ionicons 
                  name={isTimerRunning ? 'stop' : 'play'} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.timerButtonText}>
                  {isTimerRunning ? 'Stop' : 'Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, styles.resetButton]}
                onPress={resetTimer}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.timerButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.title}>Choose a Body Part</Text>
          <FlatList
            data={BODY_PARTS}
            renderItem={renderBodyPart}
            keyExtractor={item => item.key}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
          
          {selectedPart && (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#71717a" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${selectedPart.name} exercises...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#71717a"
              />
            </View>
          )}
        </>
      )}

      {/* Log */}
      {tab === 'log' && (
        <ScrollView style={styles.logContainer}>
          <Text style={styles.title}>Workout Log</Text>
          {log.length === 0 ? (
            <Text style={styles.emptyLog}>No exercises completed yet.</Text>
          ) : (
            log.map((entry, idx) => (
              <View key={idx} style={styles.logEntry}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.logText}>
                  {entry.exercise} ({entry.part}) - {entry.date}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Videos */}
      {tab === 'videos' && (
        <FlatList
          data={VIDEOS}
          renderItem={renderVideo}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.videosList}
        />
      )}

      {/* Stats Tab */}
      {tab === 'stats' && (
        <ScrollView style={styles.statsContainer}>
          <Text style={styles.title}>Your Workout Statistics</Text>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{getExerciseStats().totalWorkouts}</Text>
            <Text style={styles.statsLabel}>Total Workouts</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>
              {Math.floor(getExerciseStats().totalTime / 60)} min
            </Text>
            <Text style={styles.statsLabel}>Total Workout Time</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{getExerciseStats().lastWorkout}</Text>
            <Text style={styles.statsLabel}>Last Workout</Text>
          </View>
          
          <Text style={[styles.title, { marginTop: 20 }]}>Workouts by Body Part</Text>
          {Object.entries(getExerciseStats().byBodyPart).map(([part, count]) => (
            <View key={part} style={styles.statRow}>
              <Text style={styles.statLabel}>{part}</Text>
              <View style={styles.statBarContainer}>
                <View 
                  style={[
                    styles.statBar, 
                    { 
                      width: `${Math.min(100, (count / getExerciseStats().totalWorkouts) * 100)}%`,
                      backgroundColor: '#8b5cf6'
                    }
                  ]} 
                />
                <Text style={styles.statValue}>{count}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal for exercises */}
      <Modal
        visible={!!selectedPart}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPart(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPart ? `${selectedPart.name} Exercises` : 'Exercises'}
              </Text>
              <TouchableOpacity 
                onPress={() => setSelectedPart(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#71717a" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedPart?.exercises && filterExercises(selectedPart.exercises).map((exercise, index) => (
                <View key={index} style={styles.exerciseItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.exerciseItem,
                      checkedExercises.includes(exercise) && styles.exerciseItemChecked,
                    ]}
                    onPress={() => handleCheck(exercise)}
                  >
                    <Ionicons
                      name={checkedExercises.includes(exercise) ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={checkedExercises.includes(exercise) ? '#8b5cf6' : '#71717a'}
                    />
                    <Text style={styles.exerciseText}>{exercise}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => toggleFavorite(exercise)}
                    style={styles.favoriteButton}
                  >
                    <Ionicons
                      name={favorites.includes(exercise) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={favorites.includes(exercise) ? '#e11d48' : '#a1a1aa'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#18181b' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#23232b',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
    alignSelf: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#23232b',
    paddingVertical: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: '#a1a1aa',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  tabTextActive: {
    color: '#fff',
  },
  // Timer styles
  timerContainer: {
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    fontVariant: ['tabular-nums'],
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#3b82f6',
  },
  timerButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 16,
  },
  // Grid styles
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: '#23232b',
    margin: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    elevation: 4,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  exerciseCount: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  // Stats styles
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 12,
  },
  statBarContainer: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b3f54',
    marginRight: 12,
  },
  statBar: {
    height: 12,
    borderRadius: 6,
  },
  statValue: {
    fontSize: 16,
    color: '#fff',
  },
  exerciseItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3b3f54',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
  },
  exerciseItemChecked: {
    backgroundColor: '#8b5cf6',
  },
  exerciseText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  // Log styles
  logContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 1,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  emptyLog: {
    color: '#71717a',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  videosList: {
    padding: 8,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    borderRadius: 16,
    marginBottom: 18,
    padding: 12,
    elevation: 2,
  },
  videoThumb: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  videoTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  playBtnText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 16,
  },
  // Grid styles
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: '#23232b',
    margin: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    elevation: 4,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  exerciseCount: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  // Stats styles
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    width: 100,
    color: '#fff',
    fontSize: 14,
  },
  statBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#27272a',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
  },
  statValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1,
  },
  // Exercise item styles
  exerciseItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    flex: 1,
  },
  exerciseItemChecked: {
    opacity: 0.6,
  },
  exerciseText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  // Log styles
  logContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  emptyLog: {
    color: '#71717a',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  videosList: {
    padding: 8,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    borderRadius: 16,
    marginBottom: 18,
    padding: 12,
    elevation: 2,
  },
  videoThumb: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  videoTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  playBtnText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#a5b4fc',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    marginLeft: 4,
  },

});
