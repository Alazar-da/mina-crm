// lib/storage.ts
export interface StoredUserData {
  userId: string;
  email: string;
  sessionExpiry: string;
}

export class LocalStorageManager {
  // Store user session
  static setUserSession(userId: string, email: string) {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 8); // 8-hour session
    
    const sessionData: StoredUserData = {
      userId,
      email,
      sessionExpiry: expiry.toISOString()
    };
    
    localStorage.setItem('crm_user_session', JSON.stringify(sessionData));
  }
  
  // Get user session
  static getUserSession(): StoredUserData | null {
    const session = localStorage.getItem('crm_user_session');
    if (!session) return null;
    
    const sessionData: StoredUserData = JSON.parse(session);
    
    // Check if session expired
    if (new Date(sessionData.sessionExpiry) < new Date()) {
      this.clearUserSession();
      return null;
    }
    
    return sessionData;
  }
  
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getUserSession() !== null;
  }
  
  // Clear user session
  static clearUserSession() {
    localStorage.removeItem('crm_user_session');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }
  
  // Store remember me credentials
  static setRememberMe(email: string, password: string, remember: boolean) {
    if (remember) {
      localStorage.setItem('remembered_email', email);
      localStorage.setItem('remembered_password', password);
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('remembered_email');
      localStorage.removeItem('remembered_password');
      localStorage.removeItem('remember_me');
    }
  }
  
  // Get remembered credentials
  static getRememberedCredentials(): { email: string; password: string; remember: boolean } | null {
    const remember = localStorage.getItem('remember_me') === 'true';
    if (!remember) return null;
    
    const email = localStorage.getItem('remembered_email');
    const password = localStorage.getItem('remembered_password');
    
    if (!email) return null;
    
    return { email, password: password || '', remember: true };
  }
}