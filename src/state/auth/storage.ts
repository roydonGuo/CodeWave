import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from './AuthContext';

const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.user';

export async function loadAuthFromStorage(): Promise<{
  token: string | null;
  user: AuthUser | null;
}> {
  const [token, userJson] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);

  const user = userJson ? safeJsonParse<AuthUser>(userJson) : null;
  return { token, user };
}

export async function saveAuthToStorage(token: string, user: AuthUser): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}


