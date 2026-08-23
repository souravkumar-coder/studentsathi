import { ExpoRoot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import './global.css';

export function App() {
  const ctx = require.context('./app');
  return (
    <View style={styles.container}>
      <ExpoRoot context={ctx} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    minHeight: '100vh',
    overflow: 'auto',
  },
});

export default App;