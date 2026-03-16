import * as UsageStats from 'expo-android-usagestats';
import { AppState, Linking } from 'react-native';

/**
 * FocusShieldLogic
 * Monitors Android Usage Events to detect distraction apps during Focus.
 */

export const checkForegroundApp = async (blocklist) => {
  try {
    const hasPermission = await UsageStats.hasUsageStatsPermission();
    if (!hasPermission) return null;

    const endTime = Date.now();
    const startTime = endTime - 10000; // Check last 10 seconds

    const events = await UsageStats.queryEvents(startTime, endTime);
    
    if (!events || events.length === 0) return null;

    // Type 1 is MOVE_TO_FOREGROUND
    const foregroundEvents = events.filter(e => e.eventType === 1 || e.type === 1);
    if (foregroundEvents.length === 0) return null;

    // Get the latest one
    const latest = foregroundEvents[foregroundEvents.length - 1];
    const pkgName = latest.packageName;

    if (blocklist.includes(pkgName)) {
      return pkgName;
    }
    return null;
  } catch (e) {
    console.warn('Shield Error:', e);
    return null;
  }
};

export const intervene = () => {
  // Bring Focus Tracker back to foreground
  // In Expo, we can try opening our own app link or just alert
  Linking.openURL('exp://'); // For development/testing
  // In standalone, we'd use the package name: focus-tracker://
};

export const requestShieldPermissions = async () => {
    const hasPerm = await UsageStats.hasUsageStatsPermission();
    if (!hasPerm) {
        UsageStats.requestUsageStatsPermission();
        return false;
    }
    return true;
};
