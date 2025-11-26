import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Theme colors
const PRIMARY = '#9b59b6';
const DARK_BG = '#181824';
const CARD_BG = '#232336';
const TEXT = '#fff';
const MUTED = '#aaa';
const { width } = Dimensions.get('window');

export default function ProfilePage({ setCurrentPage, ...props }) {
  // Dummy user data (replace with real data as needed)
  const user = {
    profilePic: require('./assets/profile-placeholder.png'), 
    fullName: 'Drova',
    username: 'Drova',
    email: 'Drova@gmail.com',
    age: 21,
    height: 180,
    weight: 80,
    fitnessGoal: 'Muscle Gain',
    quote: 'Push yourself, because no one else is going to do it for you.'
  };

  // Stats data
  const stats = [
    { label: 'Workouts', value: '24', icon: 'barbell' },
    { label: 'Calories', value: '1.2k', icon: 'flame' },
    { label: 'Streak', value: '7d', icon: 'flame' },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentPage?.('dashboard')}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={user.profilePic} style={styles.profilePic} />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="camera" size={20} color={TEXT} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon} size={20} color={PRIMARY} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* User Details */}
        <View style={styles.detailsCard}>
          <DetailItem icon="person" label="Username" value={user.username} />
          <DetailItem icon="calendar" label="Age" value={`${user.age} years`} />
          <DetailItem icon="resize" label="Height" value={`${user.height} cm`} />
          <DetailItem icon="speedometer" label="Weight" value={`${user.weight} kg`} />
          <DetailItem icon="trophy" label="Fitness Goal" value={user.fitnessGoal} />
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <Ionicons name="quote" size={24} color={PRIMARY} style={styles.quoteIcon} />
          <Text style={styles.quote}>"{user.quote}"</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
            <Ionicons name="create-outline" size={20} color={TEXT} />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.settingsButton]}>
            <Ionicons name="settings-outline" size={20} color={PRIMARY} />
            <Text style={[styles.actionButtonText, { color: PRIMARY }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
            <Text style={[styles.actionButtonText, { color: '#ff6b6b' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
    </View>
  );
}

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={20} color={PRIMARY} />
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={MUTED} />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '700',
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  editIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: PRIMARY,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: DARK_BG,
  },
  userInfo: {
    alignItems: 'center',
  },
  fullName: {
    color: TEXT,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: MUTED,
    fontSize: 16,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: MUTED,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Details Card
  detailsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 2,
  },
  detailValue: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  // Quote Section
  quoteContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quoteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  quote: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontStyle: 'italic',
  },
  // Action Buttons
  actionButtons: {
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: PRIMARY,
  },
  settingsButton: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.5)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  actionButtonText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
