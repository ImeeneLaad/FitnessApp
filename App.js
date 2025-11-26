import React, { useState } from 'react';
import NutritionPage from './NutritionPage';
import WorkoutsPage from './WorkoutsPage';
import ProgressPage from './ProgressPage';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ProfilePage from './ProfilePage';

const { width, height } = Dimensions.get('window');

// Professional Vector Icon Components using Ionicons
const DashboardIcon = ({ active, size = 24 }) => (
  <Ionicons 
    name="home" 
    size={size} 
    color={active ? '#8b5cf6' : '#9ca3af'} 
  />
);

const WorkoutIcon = ({ active, size = 24 }) => (
  <Ionicons 
    name="fitness" 
    size={size} 
    color={active ? '#8b5cf6' : '#9ca3af'} 
  />
);

const NutritionIcon = ({ active, size = 24 }) => (
  <Ionicons 
    name="nutrition" 
    size={size} 
    color={active ? '#8b5cf6' : '#9ca3af'} 
  />
);

const ProgressIcon = ({ active, size = 24 }) => (
  <Ionicons 
    name="trending-up" 
    size={size} 
    color={active ? '#8b5cf6' : '#9ca3af'} 
  />
);

const ProfileIcon = ({ active, size = 24 }) => (
  <Ionicons 
    name="person" 
    size={size} 
    color={active ? '#8b5cf6' : '#9ca3af'} 
  />
);

// Workout Data
const workoutData = {
  fullBody: {
    title: "Full Body Workout",
    description: "Complete workout targeting all major muscle groups",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "10-15", difficulty: "Beginner", muscle: "Chest, Triceps, Shoulders" },
      { name: "Squats", sets: 3, reps: "12-15", difficulty: "Beginner", muscle: "Quadriceps, Glutes" },
      { name: "Plank", sets: 3, reps: "30-60s", difficulty: "Beginner", muscle: "Core" },
      { name: "Lunges", sets: 3, reps: "10 each leg", difficulty: "Beginner", muscle: "Quadriceps, Glutes" },
      { name: "Mountain Climbers", sets: 3, reps: "20-30", difficulty: "Intermediate", muscle: "Core, Cardio" },
      { name: "Burpees", sets: 3, reps: "8-12", difficulty: "Advanced", muscle: "Full Body" }
    ]
  },
  arms: {
    title: "Arms Workout",
    description: "Focus on biceps, triceps, and forearms",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "10-15", difficulty: "Beginner", muscle: "Triceps, Chest" },
      { name: "Diamond Push-ups", sets: 3, reps: "8-12", difficulty: "Intermediate", muscle: "Triceps" },
      { name: "Arm Circles", sets: 3, reps: "20 each direction", difficulty: "Beginner", muscle: "Shoulders" },
      { name: "Tricep Dips", sets: 3, reps: "10-15", difficulty: "Intermediate", muscle: "Triceps" },
      { name: "Wall Push-ups", sets: 3, reps: "15-20", difficulty: "Beginner", muscle: "Chest, Triceps" },
      { name: "Arm Raises", sets: 3, reps: "12 each arm", difficulty: "Beginner", muscle: "Shoulders" }
    ]
  },
  chest: {
    title: "Chest Workout",
    description: "Build strength and definition in your chest",
    exercises: [
      { name: "Push-ups", sets: 4, reps: "12-15", difficulty: "Beginner", muscle: "Chest, Triceps" },
      { name: "Wide Push-ups", sets: 3, reps: "10-12", difficulty: "Intermediate", muscle: "Chest" },
      { name: "Decline Push-ups", sets: 3, reps: "8-10", difficulty: "Advanced", muscle: "Upper Chest" },
      { name: "Incline Push-ups", sets: 3, reps: "12-15", difficulty: "Beginner", muscle: "Lower Chest" },
      { name: "Pike Push-ups", sets: 3, reps: "8-12", difficulty: "Advanced", muscle: "Chest, Shoulders" },
      { name: "Chest Stretch", sets: 2, reps: "30s hold", difficulty: "Beginner", muscle: "Chest Flexibility" }
    ]
  },
  back: {
    title: "Back Workout",
    description: "Strengthen your back and improve posture",
    exercises: [
      { name: "Superman Hold", sets: 3, reps: "20-30s", difficulty: "Beginner", muscle: "Lower Back" },
      { name: "Bird Dog", sets: 3, reps: "10 each side", difficulty: "Beginner", muscle: "Back, Core" },
      { name: "Cat-Cow Stretch", sets: 3, reps: "10 reps", difficulty: "Beginner", muscle: "Back Flexibility" },
      { name: "Bridge Hold", sets: 3, reps: "30-45s", difficulty: "Intermediate", muscle: "Lower Back, Glutes" },
      { name: "Wall Angels", sets: 3, reps: "10-15", difficulty: "Beginner", muscle: "Upper Back" },
      { name: "Prone Y-T-W", sets: 3, reps: "10 each", difficulty: "Intermediate", muscle: "Upper Back" }
    ]
  },
  legs: {
    title: "Legs Workout",
    description: "Build strong, powerful legs",
    exercises: [
      { name: "Squats", sets: 4, reps: "15-20", difficulty: "Beginner", muscle: "Quadriceps, Glutes" },
      { name: "Lunges", sets: 3, reps: "12 each leg", difficulty: "Beginner", muscle: "Quadriceps, Glutes" },
      { name: "Calf Raises", sets: 3, reps: "20-25", difficulty: "Beginner", muscle: "Calves" },
      { name: "Wall Sit", sets: 3, reps: "30-60s", difficulty: "Beginner", muscle: "Quadriceps" },
      { name: "Step-ups", sets: 3, reps: "15 each leg", difficulty: "Intermediate", muscle: "Quadriceps, Glutes" },
      { name: "Glute Bridge", sets: 3, reps: "15-20", difficulty: "Beginner", muscle: "Glutes, Hamstrings" }
    ]
  },
  core: {
    title: "Core Workout",
    description: "Strengthen your core and improve stability",
    exercises: [
      { name: "Plank", sets: 3, reps: "30-60s", difficulty: "Beginner", muscle: "Core" },
      { name: "Crunches", sets: 3, reps: "15-20", difficulty: "Beginner", muscle: "Abs" },
      { name: "Russian Twists", sets: 3, reps: "20 each side", difficulty: "Intermediate", muscle: "Obliques" },
      { name: "Mountain Climbers", sets: 3, reps: "30-40", difficulty: "Intermediate", muscle: "Core, Cardio" },
      { name: "Bicycle Crunches", sets: 3, reps: "20-25", difficulty: "Intermediate", muscle: "Abs, Obliques" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", difficulty: "Beginner", muscle: "Core Stability" }
    ]
  },
  shoulders: {
    title: "Shoulders Workout",
    description: "Build strong, defined shoulders",
    exercises: [
      { name: "Arm Circles", sets: 3, reps: "20 each direction", difficulty: "Beginner", muscle: "Shoulders" },
      { name: "Pike Push-ups", sets: 3, reps: "8-12", difficulty: "Advanced", muscle: "Shoulders, Triceps" },
      { name: "Wall Angels", sets: 3, reps: "10-15", difficulty: "Beginner", muscle: "Shoulders, Upper Back" },
      { name: "Shoulder Taps", sets: 3, reps: "20 each arm", difficulty: "Intermediate", muscle: "Shoulders, Core" },
      { name: "Arm Raises", sets: 3, reps: "12 each arm", difficulty: "Beginner", muscle: "Shoulders" },
      { name: "Shoulder Stretch", sets: 2, reps: "30s each", difficulty: "Beginner", muscle: "Shoulder Flexibility" }
    ]
  }
};

function DashboardScreen() {
  // You may want to move your dashboard logic here, or keep as a component
  // For brevity, we'll show a placeholder. Replace with your renderDashboard content.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181824', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Home / Dashboard</Text>
      {/* Insert your dashboard UI here (see renderDashboard) */}
    </SafeAreaView>
  );
}

const getHealthTip = (bmi) => {
  if (bmi < 18.5) return "Focus on building healthy muscle mass with strength training";
  if (bmi < 25) return "Great job! Keep maintaining your healthy lifestyle";
  if (bmi < 30) return "Consider adding more cardio to your routine";
  return "Start with low-impact exercises and consult a professional";
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBodyPart, setSelectedBodyPart] = useState('fullBody');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [gender, setGender] = useState('male');

  // Calculate BMI based on weight and height
  const calculateBMI = () => {
    if (!weight || !height) return null;
    
    // Convert weight to kg if in lbs
    const weightInKg = weightUnit === 'lbs' 
      ? parseFloat(weight) * 0.453592 
      : parseFloat(weight);
    
    // Convert height to meters if in cm or ft
    let heightInMeters;
    if (heightUnit === 'cm') {
      heightInMeters = parseFloat(height) / 100;
    } else {
      // Convert feet and inches to meters
      const [feet, inches = 0] = height.split('.').map(Number);
      const totalInches = (feet * 12) + inches;
      heightInMeters = totalInches * 0.0254;
    }
    
    if (isNaN(weightInKg) || isNaN(heightInMeters) || heightInMeters === 0) {
      return null;
    }
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  };

  // Get BMI category and color based on BMI value
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return { category: 'Underweight', color: '#3b82f6', progress: bmi / 30 };
    } else if (bmi < 25) {
      return { category: 'Normal', color: '#10b981', progress: bmi / 30 };
    } else if (bmi < 30) {
      return { category: 'Overweight', color: '#f59e0b', progress: bmi / 30 };
    } else {
      return { category: 'Obese', color: '#ef4444', progress: Math.min(bmi / 40, 1) };
    }
  };

  // Page render functions with setCurrentPage passed as prop
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return renderLandingPage({ setCurrentPage });
      case 'fitness':
        return renderFitnessPage({ setCurrentPage });
      case 'personal':
        return renderPersonalInfoPage({ 
          setCurrentPage, 
          weight, 
          setWeight, 
          height, 
          setHeight, 
          weightUnit, 
          setWeightUnit, 
          heightUnit, 
          setHeightUnit, 
          gender, 
          setGender 
        });
      case 'dashboard':
        return renderDashboard({ 
          setCurrentPage, 
          calculateBMI, 
          getBMICategory, 
          getHealthTip,
          activeTab,
          setActiveTab
        });
      case 'workout':
        return (
          <WorkoutsPage
            selectedBodyPart={selectedBodyPart}
            setSelectedBodyPart={setSelectedBodyPart}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentPage={setCurrentPage}
            styles={styles}
          />
        );
      case 'nutrition':
        return <NutritionPage setCurrentPage={setCurrentPage} />;
      case 'progress':
        return <ProgressPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage setCurrentPage={setCurrentPage} />;
      default:
        return renderLandingPage();
    }
  };

  return renderCurrentPage();
}

  // Body Part Selection Component
  const BodyPartSelector = () => (
    <View style={styles.bodyPartContainer}>
      <Text style={styles.bodyPartTitle}>Choose Your Focus</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyPartScroll}
      >
        {Object.keys(workoutData).map((bodyPart) => (
          <TouchableOpacity
            key={bodyPart}
            style={[
              styles.bodyPartCard,
              selectedBodyPart === bodyPart && styles.bodyPartCardActive
            ]}
            onPress={() => setSelectedBodyPart(bodyPart)}
          >
            <View style={[
              styles.bodyPartIcon,
              selectedBodyPart === bodyPart && styles.bodyPartIconActive
            ]}>
              <Text style={styles.bodyPartEmoji}>
                {bodyPart === 'fullBody' ? '🏃‍♂️' : 
                 bodyPart === 'arms' ? '💪' :
                 bodyPart === 'chest' ? '🫁' :
                 bodyPart === 'back' ? '🦴' :
                 bodyPart === 'legs' ? '🦵' :
                 bodyPart === 'core' ? '🎯' :
                 bodyPart === 'shoulders' ? '🏋️' : '💪'}
              </Text>
            </View>
            <Text style={[
              styles.bodyPartText,
              selectedBodyPart === bodyPart && styles.bodyPartTextActive
            ]}>
              {workoutData[bodyPart].title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Exercise Card Component
  const ExerciseCard = ({ exercise, index }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNumber}>
          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
        </View>
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: 
            exercise.difficulty === 'Beginner' ? '#10b981' :
            exercise.difficulty === 'Intermediate' ? '#f59e0b' : '#ef4444'
          }
        ]}>
          <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseDetail}>
          <Text style={styles.detailLabel}>Sets</Text>
          <Text style={styles.detailValue}>{exercise.sets}</Text>
        </View>
        <View style={styles.exerciseDetail}>
          <Text style={styles.detailLabel}>Reps</Text>
          <Text style={styles.detailValue}>{exercise.reps}</Text>
        </View>
      </View>
    </View>
  );

  // Page Render Functions
  const renderLandingPage = ({ setCurrentPage }) => (
    <View style={styles.landingContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('./DrovaGo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => setCurrentPage('fitness')}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <View style={styles.buttonIcon}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFitnessPage = ({ setCurrentPage }) => (
    <ImageBackground 
      source={require('./assets/photo.jpg')} 
      style={styles.fitnessContainer}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <View style={styles.footerContainer}>
        <Text style={styles.welcomeTitle}>Welcome to DrovaGo</Text>
        
        <TouchableOpacity 
          style={styles.fitnessButton}
          onPress={() => setCurrentPage('personal')}
          activeOpacity={0.8}
        >
          <Text style={styles.fitnessButtonText}>Continue</Text>
          <View style={styles.fitnessButtonIcon}>
            <Text style={styles.fitnessArrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderPersonalInfoPage = ({ 
    setCurrentPage, 
    weight, 
    setWeight, 
    height, 
    setHeight, 
    weightUnit, 
    setWeightUnit, 
    heightUnit, 
    setHeightUnit, 
    gender, 
    setGender 
  }) => (
    <SafeAreaView style={styles.personalContainer}>
      <ExpoStatusBar style="light" />
      
      <View style={styles.personalHeader}>
        <Text style={styles.personalTitle}>Personal Information</Text>
        <Text style={styles.personalSubtitle}>Help us personalize your experience</Text>
      </View>

      <ScrollView style={styles.personalContent} showsVerticalScrollIndicator={false}>
        {/* Weight Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Weight</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your weight"
              placeholderTextColor="#6b7280"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <View style={styles.unitContainer}>
              <TouchableOpacity 
                style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'kg' && styles.unitButtonTextActive]}>kg</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.unitButton, weightUnit === 'lbs' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('lbs')}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'lbs' && styles.unitButtonTextActive]}>lbs</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Height Input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Height</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your height"
              placeholderTextColor="#6b7280"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
            <View style={styles.unitContainer}>
              <TouchableOpacity 
                style={[styles.unitButton, heightUnit === 'cm' && styles.unitButtonActive]}
                onPress={() => setHeightUnit('cm')}
              >
                <Text style={[styles.unitButtonText, heightUnit === 'cm' && styles.unitButtonTextActive]}>cm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.unitButton, heightUnit === 'ft' && styles.unitButtonActive]}
                onPress={() => setHeightUnit('ft')}
              >
                <Text style={[styles.unitButtonText, heightUnit === 'ft' && styles.unitButtonTextActive]}>ft/in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.personalButtonContainer}>
        <TouchableOpacity 
          style={styles.personalButton}
          onPress={() => setCurrentPage('dashboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.personalButtonText}>Continue</Text>
          <View style={styles.personalButtonIcon}>
            <Text style={styles.personalArrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderDashboard = ({ 
    setCurrentPage, 
    calculateBMI, 
    getBMICategory, 
    getHealthTip,
    activeTab,
    setActiveTab
  }) => {
    const bmi = calculateBMI();
    const bmiData = bmi ? getBMICategory(bmi) : null;
    const healthTip = bmi ? getHealthTip(bmi) : "Enter your weight and height to see your BMI";

    return (
      <SafeAreaView style={styles.dashboardContainer}>
        <ExpoStatusBar style="light" />
        
        {/* Header with Hamburger Menu */}
        <View style={styles.dashboardHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.dashboardTitle}>Your Fitness Dashboard</Text>
            <Text style={styles.dashboardSubtitle}>Welcome back! Let's crush your goals today</Text>
          </View>
        </View>

        <ScrollView style={styles.dashboardContent} showsVerticalScrollIndicator={false}>
          {/* BMI Section */}
          <View style={styles.bmiCard}>
            <Text style={styles.bmiTitle}>Your BMI (IMC)</Text>
            
            {bmi ? (
              <>
                <View style={styles.bmiResult}>
                  <Text style={styles.bmiNumber}>{bmi}</Text>
                  <Text style={styles.bmiLabel}>BMI Score</Text>
                </View>
                
                <View style={styles.bmiCategory}>
                  <Text style={[styles.categoryText, { color: bmiData.color }]}>
                    {bmiData.category}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${bmiData.progress * 100}%`,
                          backgroundColor: bmiData.color 
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>Underweight</Text>
                    <Text style={styles.progressLabel}>Normal</Text>
                    <Text style={styles.progressLabel}>Overweight</Text>
                    <Text style={styles.progressLabel}>Obese</Text>
                  </View>
                </View>

                <Text style={styles.healthTip}>{healthTip}</Text>
              </>
            ) : (
              <Text style={styles.healthTip}>{healthTip}</Text>
            )}
          </View>

          {/* Interactive Cards */}
          <View style={styles.cardsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.cardsGrid}>
              <TouchableOpacity 
                style={styles.dashboardCard}
                onPress={() => {
                  setActiveTab('workouts');
                  setCurrentPage('workout');
                }}
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>🏋️</Text>
                </View>
                <Text style={styles.cardTitle}>Start Workout</Text>
                <Text style={styles.cardDescription}>Begin your fitness journey</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dashboardCard}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📊</Text>
                </View>
                <Text style={styles.cardTitle}>Track Progress</Text>
                <Text style={styles.cardDescription}>Monitor your achievements</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dashboardCard} onPress={() => {
                setActiveTab('nutrition');
                setCurrentPage('nutrition');
              }}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>🥗</Text>
                </View>
                <Text style={styles.cardTitle}>View Nutrition</Text>
                <Text style={styles.cardDescription}>Plan your meals</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dashboardCard}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>🎯</Text>
                </View>
                <Text style={styles.cardTitle}>Set Goals</Text>
                <Text style={styles.cardDescription}>Define your targets</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.modernBottomNav}>
          <View style={styles.modernNavItems}>
            <TouchableOpacity 
              style={[styles.modernNavItem, activeTab === 'dashboard' && styles.modernNavItemActive]}
              onPress={() => setActiveTab('dashboard')}
            >
              <DashboardIcon active={activeTab === 'dashboard'} />
              <Text style={[styles.modernNavLabel, activeTab === 'dashboard' && styles.modernNavLabelActive]}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernNavItem, activeTab === 'workouts' && styles.modernNavItemActive]}
              onPress={() => {
                setActiveTab('workouts');
                setCurrentPage('workout');
              }}
            >
              <WorkoutIcon active={activeTab === 'workouts'} />
              <Text style={[styles.modernNavLabel, activeTab === 'workouts' && styles.modernNavLabelActive]}>Workouts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernNavItem, activeTab === 'nutrition' && styles.modernNavItemActive]}
              onPress={() => {
                setActiveTab('nutrition');
                setCurrentPage('nutrition');
              }}
            >
              <NutritionIcon active={activeTab === 'nutrition'} />
              <Text style={[styles.modernNavLabel, activeTab === 'nutrition' && styles.modernNavLabelActive]}>Nutrition</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernNavItem, activeTab === 'progress' && styles.modernNavItemActive]}
              onPress={() => {
                setActiveTab('progress');
                setCurrentPage('progress');
              }}
            >
              <ProgressIcon active={activeTab === 'progress'} />
              <Text style={[styles.modernNavLabel, activeTab === 'progress' && styles.modernNavLabelActive]}>Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modernNavItem, activeTab === 'profile' && styles.modernNavItemActive]}
              onPress={() => {
  setActiveTab('profile');
  setCurrentPage('profile');
}}
            >
              <ProfileIcon active={activeTab === 'profile'} />
              <Text style={[styles.modernNavLabel, activeTab === 'profile' && styles.modernNavLabelActive]}>Profile</Text>
            </TouchableOpacity>
          </View>
           </View>
      </SafeAreaView>
    );
  }; // <--- Add this closing brace for the function!
const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 0.6, // Less vertical space for logo
    justifyContent: 'flex-end', // Push logo to bottom of its area
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100, // Place button just below logo
  },
  getStartedButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Fitness Page Styles
  fitnessContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  footerContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  fitnessButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  fitnessButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  fitnessButtonIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fitnessArrowIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Personal Info Page Styles
  personalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  personalHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  personalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  personalSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  personalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    marginRight: 12,
  },
  unitContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    overflow: 'hidden',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  unitButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  unitButtonTextActive: {
    color: '#ffffff',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  genderButtonTextActive: {
    color: '#ffffff',
  },
  personalButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  personalButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  personalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  personalButtonIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalArrowIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dashboardContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bmiCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bmiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  bmiResult: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  bmiLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  bmiCategory: {
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  healthTip: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cardsSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },

  // Bottom Navigation Styles
  modernBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: '#2d2d2d',
  },
  modernNavItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  modernNavItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 50,
    justifyContent: 'center',
  },
  modernNavItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  modernNavLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  modernNavLabelActive: {
    color: '#8b5cf6',
    fontWeight: '600',
  },

  // Workout Page Styles
  workoutContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  workoutHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  workoutContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bodyPartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bodyPartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  bodyPartScroll: {
    alignItems: 'center',
  },
  bodyPartCard: {
    width: 120,
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  bodyPartCardActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  bodyPartIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bodyPartIconActive: {
    backgroundColor: '#ffffff',
  },
  bodyPartEmoji: {
    fontSize: 28,
  },
  bodyPartText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
  bodyPartTextActive: {
    color: '#ffffff',
  },
  workoutDetailsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  workoutDetailsHeader: {
    marginBottom: 16,
  },
  workoutDetailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutDetailsDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  exercisesSection: {
    marginBottom: 100,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  startWorkoutContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  startWorkoutButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  startWorkoutText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  startWorkoutIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
