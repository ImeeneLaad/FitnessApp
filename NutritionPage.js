import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Animated, TextInput } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const calorieGoal = 2200;
const macros = [
  { key: 'carbs', label: 'Carbs', grams: 180, percent: 48, icon: 'bread-slice', color: '#fde68a' },
  { key: 'protein', label: 'Protein', grams: 110, percent: 28, icon: 'drumstick-bite', color: '#6ee7b7' },
  { key: 'fat', label: 'Fat', grams: 60, percent: 24, icon: 'cheese', color: '#f9a8d4' },
];

const initialMeals = [
  { key: 'breakfast', name: 'Oatmeal Bowl', time: '8:00 AM', kcal: 350, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', icon: 'coffee' },
  { key: 'lunch', name: 'Grilled Chicken Salad', time: '1:00 PM', kcal: 550, img: 'https://images.unsplash.com/photo-1516685018646-5499d0a7d42f', icon: 'utensils' },
  { key: 'dinner', name: 'Salmon & Veggies', time: '7:00 PM', kcal: 600, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', icon: 'fish' },
  { key: 'snacks', name: 'Greek Yogurt', time: '4:00 PM', kcal: 150, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', icon: 'ice-cream' },
];
const waterGoal = 8;
const goals = ['Weight Loss', 'Muscle Gain', 'Maintenance'];
const dietPrefs = ['Balanced', 'Vegan', 'Vegetarian', 'Keto'];

export default function NutritionPage({ setCurrentPage, ...props }) {

  const [selectedGoals, setSelectedGoals] = useState(['Maintenance']); 
  const [selectedDiets, setSelectedDiets] = useState(['Balanced']); 
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [macroModalData, setMacroModalData] = useState(null);
  const [showEditMealModal, setShowEditMealModal] = useState(false);
  const [editMealData, setEditMealData] = useState(null);
  const [hydrationReminder, setHydrationReminder] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [water, setWater] = useState(5);

  // Meals and calories state
  const [meals, setMeals] = useState(initialMeals);
  const [caloriesConsumed, setCaloriesConsumed] = useState(
    initialMeals.reduce((sum, m) => sum + m.kcal, 0)
  );

  // Add meal modal state
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealKcal, setNewMealKcal] = useState('');
 
  //Calculate Meal 
  const [mealImageUri, setMealImageUri] = useState(null);
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Animation placeholder for calorie progress
  // Use useRef to persist animated value across renders
  const calorieProgress = React.useRef(new Animated.Value(caloriesConsumed / calorieGoal)).current;
  // You may want to add an effect to animate this value when caloriesConsumed changes
  React.useEffect(() => {
    Animated.timing(calorieProgress, {
      toValue: caloriesConsumed / calorieGoal,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [caloriesConsumed]);

  // Add meal handler
  const handleAddMeal = () => {
    if (!newMealName || !newMealKcal || isNaN(Number(newMealKcal))) return;
    const newMeal = {
      key: `${newMealName}-${Date.now()}`,
      name: newMealName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kcal: Number(newMealKcal),
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', // Placeholder
      icon: 'utensils',
    };
    setMeals([ ...meals, newMeal ]);
    setCaloriesConsumed(caloriesConsumed + newMeal.kcal);
    setShowAddMeal(false);
    setNewMealName('');
    setNewMealKcal('');
  };
const handlePickImage = async () => {
  // Request permission first
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Camera permission is required!');
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaType.IMAGE,
    quality: 0.7,
  });

  // New API: result.canceled and result.assets
  if (!result.canceled && result.assets && result.assets.length > 0) {
    setMealImageUri(result.assets[0].uri);
    setAnalyzing(true);
    setTimeout(() => {
      setMealAnalysis({
        carbs: 42,
        protein: 18,
        fat: 12,
        calories: 350,
      });
      setAnalyzing(false);
    }, 2000);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: '#141428' }}>
      {/* Modern iOS-style Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => setCurrentPage && setCurrentPage('dashboard')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} >
        <Ionicons name="chevron-back" size={28} color="#a5b4fc" style={{ marginRight: 2 }} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nutrition</Text>
      </View>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <View style={styles.customModalOverlay}>
          <Animated.View style={[styles.customModalContent, { transform: [{ scale: showAddMeal ? 1 : 0.9 }] }]}> 
            <MaterialCommunityIcons name="silverware-fork-knife" size={34} color="#8b5cf6" style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text style={styles.customModalTitle}>Add Your Meal</Text>
            <TextInput
              style={styles.input}
              placeholder="Meal Name"
              value={newMealName}
              onChangeText={setNewMealName}
              placeholderTextColor="#a1a1aa"
            />
            <TextInput
              style={styles.input}
              placeholder="Calories (kcal)"
              value={newMealKcal}
              onChangeText={setNewMealKcal}
              keyboardType="numeric"
              placeholderTextColor="#a1a1aa"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity style={[styles.toggleButton, { flex: 1, marginRight: 8 }]} onPress={() => setShowAddMeal(false)}>
                <Text style={styles.toggleButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, styles.toggleButtonActive, { flex: 1, marginLeft: 8 }]} onPress={handleAddMeal}>
                <Text style={[styles.toggleButtonText, styles.toggleButtonTextActive]}>Add</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Calorie Tracker */}

<View style={styles.section}>
  <Text style={styles.sectionTitle}>Daily Calories</Text>
  <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
    <View style={styles.calorieRingShadow}>
      <FontAwesome5 name="fire" size={24} color="#f87171" style={{ marginBottom: 6 }} />
      <Text style={styles.calorieCount}>{caloriesConsumed}</Text>
      <Text style={styles.calorieGoal}>/ {calorieGoal} kcal</Text>
    </View>
  </View>
</View>

<View style={{ height: 15 }} />
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Analyze Your Meal</Text>
  <TouchableOpacity
    style={styles.analyzeButton}
    onPress={handlePickImage}
    activeOpacity={0.85}
  >
    <MaterialCommunityIcons name="camera" size={28} color="#fff" />
    <Text style={styles.analyzeButtonText}>Take a Photo of Your Meal</Text>
  </TouchableOpacity>
  {mealImageUri && (
    <View style={{ alignItems: 'center', marginTop: 16 }}>
      <Image source={{ uri: mealImageUri }} style={styles.analyzeImagePreview} />
      {analyzing ? (
        <Text style={{ color: '#a5b4fc', marginTop: 10 }}>Analyzing...</Text>
      ) : mealAnalysis ? (
        <View style={styles.analysisResultBox}>
          <Text style={styles.analysisResultText}>Carbs: <Text style={{ color: '#fde68a' }}>{mealAnalysis.carbs}g</Text></Text>
          <Text style={styles.analysisResultText}>Protein: <Text style={{ color: '#6ee7b7' }}>{mealAnalysis.protein}g</Text></Text>
          <Text style={styles.analysisResultText}>Fat: <Text style={{ color: '#f9a8d4' }}>{mealAnalysis.fat}g</Text></Text>
          <Text style={styles.analysisResultText}>Calories: <Text style={{ color: '#f87171' }}>{mealAnalysis.calories} kcal</Text></Text>
        </View>
      ) : null}
    </View>
  )}
    </View>  

{/* Macronutrient Breakdown */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Macros</Text>
  <View style={styles.macrosRow}>
    {macros.map(macro => (
      <TouchableOpacity
        key={macro.key}
        style={[styles.macroCard, { backgroundColor: '#23233a', shadowColor: macro.color }]}
        activeOpacity={0.85}
      >
        <FontAwesome5 name={macro.icon} size={22} color={macro.color} style={{ marginBottom: 4 }} />
        <Text style={styles.macroLabel}>{macro.label}</Text>
        <Text style={styles.macroGrams}>{macro.grams}g</Text>
        <Text style={[styles.macroPercent, { color: macro.color }]}>{macro.percent}%</Text>
        {/* Progress Bar */}
        <View style={styles.macroProgressBarBg}>
          <View style={[styles.macroProgressBar, { width: `${macro.percent}%`, backgroundColor: macro.color }]} />
        </View>
      </TouchableOpacity>
    ))}
  </View>
</View>


{/* Meal Plan Suggestions */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Meal Plan</Text>
  <FlatList
    data={meals}
    keyExtractor={item => item.key}
    horizontal
    showsHorizontalScrollIndicator={false}
    ListHeaderComponent={null}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[styles.mealCard, item.favorite && { borderColor: '#8b5cf6', borderWidth: 2 }]}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.img }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <FontAwesome5 name={item.icon} size={18} color="#8b5cf6" style={{ marginRight: 6 }} />
          <Text style={styles.mealName}>{item.name}</Text>
          {item.favorite && (
            <MaterialCommunityIcons name="star" size={18} color="#facc15" style={{ marginLeft: 4 }} />
          )}
        </View>
        <Text style={styles.mealTime}>{item.time}</Text>
        <Text style={styles.mealCalories}>{item.kcal} kcal</Text>
      </TouchableOpacity>
    )}
    style={{ marginTop: 8 }}
  />
</View>

{/* Water Intake Tracker */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Water Intake</Text>
  <View style={styles.waterRow}>
    {[...Array(waterGoal)].map((_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => {
          if (i < water) setWater(water - 1);
          else setWater(i + 1);
        }}
        style={[styles.waterGlass, i < water ? styles.waterGlassFull : styles.waterGlassEmpty]}
        activeOpacity={0.7}
      >
        <Ionicons name="water" size={22} color={i < water ? '#38bdf8' : '#a1a1aa'} />
      </TouchableOpacity>
    ))}
  </View>
  <Text style={styles.waterText}>{water} / {waterGoal} glasses</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
    <TouchableOpacity
      style={[styles.toggleButton, hydrationReminder && styles.toggleButtonActive, { minWidth: 120, paddingVertical: 8 }]}
      onPress={() => setHydrationReminder(!hydrationReminder)}
    >
      <Ionicons name="alarm" size={18} color={hydrationReminder ? '#fff' : '#8b5cf6'} style={{ marginRight: 6 }} />
      <Text style={[styles.toggleButtonText, hydrationReminder && styles.toggleButtonTextActive]}>
        {hydrationReminder ? 'Hydration ON' : 'Hydration OFF'}
      </Text>
    </TouchableOpacity>
  </View>
</View>

{/* Add Meal Button */}
<View style={{ alignItems: 'center', marginTop: 18 }}>
  <TouchableOpacity style={styles.addMealButton} activeOpacity={0.85} onPress={() => setShowAddMeal(true)}>
    <MaterialCommunityIcons name="plus-circle" size={28} color="#fff" />
    <Text style={styles.addMealText}>Add Your Own Meal</Text>
  </TouchableOpacity>
</View>
      </ScrollView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
headerTitle: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#a5b4fc',
  letterSpacing: 0.5,
  textAlign: 'center',
},
  macroProgressBarBg: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    backgroundColor: '#23233a',
    marginTop: 6,
    marginBottom: 2,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: 7,
    borderRadius: 4,
  },
  customModalOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(24, 24, 37, 0.74)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  customModalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  customModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    alignSelf: 'center',
    letterSpacing: 0.5,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#181825',
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#1E1E2E',
    borderRadius: 18,
    borderColor: '#312e81',
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 28,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a5b4fc',
    marginBottom: 10,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  calorieRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  calorieRingShadow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#23233a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f87171',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 7,
    zIndex: 2,
  },
  calorieCount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f87171',
    textAlign: 'center',
  },
  calorieGoal: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  calorieRingBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#23233a',
    top: -5,
    left: -5,
    zIndex: 1,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
  },
  macroCard: {
    minWidth: 100,
    maxWidth: 130,
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: '#23233a',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  macroLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  macroGrams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f3f4f6',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  macroPercent: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  mealCard: {
    width: 160,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: '#23233a',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#312e81',
    overflow: 'hidden',
  },
  mealImage: {
    width: 120,
    height: 70,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#23233a',
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  mealName: {
    fontWeight: 'bold',
    color: '#f3f4f6',
    fontSize: 15,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: 90,
  },
  mealTime: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  mealCalories: {
    color: '#f87171',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  waterRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 4,
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  waterGlass: {
    marginHorizontal: 3,
    padding: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  waterGlassFull: {
    backgroundColor: '#2563eb',
  },
  waterGlassEmpty: {
    backgroundColor: '#23233a',
  },
  waterText: {
    textAlign: 'center',
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 8,
  },
  toggleButton: {
    minWidth: 110,
    maxWidth: 140,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#23233a',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#23233a',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  toggleButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  toggleButtonText: {
    color: '#a5b4fc',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingHorizontal: 2,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  addMealButton: {
    marginTop: 18,
    flexDirection: 'row',
    backgroundColor: '#8b5cf6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
analyzeButton: {
  marginTop: 8,
  flexDirection: 'row',
  backgroundColor: '#8b5cf6',
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 14,
  paddingHorizontal: 28,
  alignSelf: 'center',
  shadowColor: '#8b5cf6',
  shadowOpacity: 0.13,
  shadowRadius: 10,
  elevation: 6,
  overflow: 'hidden',
},
analyzeButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  marginLeft: 10,
  flexShrink: 1,
  flexWrap: 'wrap',
},
analyzeImagePreview: {
  width: 180,
  height: 120,
  borderRadius: 14,
  marginTop: 8,
  resizeMode: 'cover',
  borderWidth: 2,
  borderColor: '#8b5cf6',
},
analysisResultBox: {
  marginTop: 16,
  backgroundColor: '#23233a',
  borderRadius: 14,
  padding: 16,
  alignItems: 'flex-start',
  width: 180,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
},
analysisResultText: {
  color: '#f3f4f6',
  fontSize: 15,
  marginBottom: 4,
  fontWeight: '600',
},
backButton: {
  position: 'absolute',
  top: 36,
  left: 16,
  zIndex: 10,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'transparent',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 18,
},
backButtonText: {
  color: '#a5b4fc',
  fontSize: 17,
  fontWeight: 'bold',
  letterSpacing: 0.2,
},
backButton: {
  position: 'absolute',
  top: 50, 
  left: 1,
  zIndex: 10,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'transparent',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 18,
},
backButtonText: {
  color: '#a5b4fc',
  fontSize: 18,
  fontWeight: '600',
  letterSpacing: 0.2,
  marginLeft: 2,
},
});
