import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Ready to scan');

  const handleScan = () => {
    setStatus('Scanning...');

    setTimeout(() => {
      setStatus('No items yet — ready to scan.');
    }, 1400);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Top Budget Bar */}
      <View style={styles.budgetBar}>
        <Text style={styles.budgetLabel}>Budget</Text>
        <Text style={styles.budgetValue}>$100.00 left</Text>
      </View>

      {/* Center Scan Area */}
      <View style={styles.center}>
        <Pressable
          onPress={handleScan}
          style={({ pressed }) => [
            styles.scanBtn,
            pressed && styles.scanBtnPressed,
          ]}
        >
          <Text style={styles.scanText}>SCAN</Text>
        </Pressable>

        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text style={styles.navActive}>Scan</Text>
        <Text style={styles.navItem}>History</Text>
        <Text style={styles.navItem}>Settings</Text>
      </View>

    </SafeAreaView>
  );
}

const NEON = '#00ff6a';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071012',
  },

  budgetBar: {
    height: 64,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,255,106,0.06)',
    backgroundColor: 'rgba(0,255,106,0.03)',
  },

  budgetLabel: {
    color: '#9aa6a6',
    fontSize: 13,
  },

  budgetValue: {
    color: NEON,
    fontWeight: '700',
    fontSize: 18,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#05211a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEON,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },

  scanBtnPressed: {
    transform: [{ scale: 0.98 }],
  },

  scanText: {
    color: '#eaffef',
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 22,
  },

  statusText: {
    marginTop: 16,
    color: '#9aa6a6',
  },

  bottomNav: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.02)',
  },

  navItem: {
    color: '#9aa6a6',
  },

  navActive: {
    color: NEON,
    fontWeight: '700',
  },
});
