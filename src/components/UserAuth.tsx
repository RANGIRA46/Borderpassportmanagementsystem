import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  User, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  UserCheck,
  Settings
} from "lucide-react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'officer' | 'admin' | 'super-admin';
  department?: string;
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'pending';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'user' | 'admin') => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  userType: 'user' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize default users
  const getDefaultUsers = (): User[] => [
    {
      id: 'usr_001',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      permissions: ['apply_passport', 'apply_visa', 'view_status', 'book_appointment'],
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-21'),
      status: 'active'
    },
    {
      id: 'usr_002',
      email: 'mary.smith@immigration.gov.rw',
      firstName: 'Mary',
      lastName: 'Smith',
      role: 'officer',
      department: 'Immigration Services',
      permissions: ['process_applications', 'verify_identity', 'access_biometrics', 'view_records'],
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date('2024-01-21'),
      status: 'active'
    },
    {
      id: 'usr_003',
      email: 'admin@immigration.gov.rw',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'admin',
      department: 'System Administration',
      permissions: ['full_access', 'user_management', 'system_config', 'analytics', 'watchlist'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-21'),
      status: 'active'
    },
    {
      id: 'usr_004',
      email: 'superadmin@immigration.gov.rw',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'super-admin',
      department: 'National Security',
      permissions: ['system_admin', 'security_oversight', 'interpol_access', 'multi_agency'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-21'),
      status: 'active'
    }
  ];

  // Get users from localStorage or use defaults
  const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem('border_system_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, reset to defaults
        const defaults = getDefaultUsers();
        localStorage.setItem('border_system_users', JSON.stringify(defaults));
        return defaults;
      }
    } else {
      // Initialize with default users
      const defaults = getDefaultUsers();
      localStorage.setItem('border_system_users', JSON.stringify(defaults));
      return defaults;
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('border_system_users', JSON.stringify(users));
  };

  const login = async (email: string, password: string, userType: 'user' | 'admin'): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get current users from storage
    const currentUsers = getStoredUsers();
    
    // Find user in database
    const foundUser = currentUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (userType === 'user' ? u.role === 'customer' : ['officer', 'admin', 'super-admin'].includes(u.role))
    );
    
    if (foundUser && password === 'password123') { // Mock password validation
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      
      // Update user in storage
      const userIndex = currentUsers.findIndex(u => u.id === foundUser.id);
      if (userIndex >= 0) {
        currentUsers[userIndex] = updatedUser;
        saveUsers(currentUsers);
      }
      
      setUser(updatedUser);
      localStorage.setItem('border_system_user', JSON.stringify(updatedUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get current users from storage
    const currentUsers = getStoredUsers();
    
    // Check if user already exists
    const existingUser = currentUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.userType === 'user' ? 'customer' : 'officer',
      department: userData.userType === 'admin' ? 'Immigration Services' : undefined,
      permissions: userData.userType === 'user' 
        ? ['apply_passport', 'apply_visa', 'view_status', 'book_appointment']
        : ['process_applications', 'verify_identity', 'access_biometrics'],
      createdAt: new Date(),
      status: 'active'
    };
    
    // Add to users array and save to storage
    currentUsers.push(newUser);
    saveUsers(currentUsers);
    
    // Also create a user profile in the DataManager
    const userProfile = {
      personalInfo: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        nationality: userData.nationality
      },
      preferences: {
        language: 'en',
        notifications: true,
        theme: 'light' as const
      }
    };
    
    // Save to DataManager (will be done through localStorage)
    localStorage.setItem(`border_system_user_profile_${newUser.id}`, JSON.stringify(userProfile));
    
    setUser(newUser);
    localStorage.setItem('border_system_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('border_system_user');
  };

  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('border_system_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('border_system_user');
      }
    }
  }, []);

  const authValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isOfficer: user?.role === 'officer',
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'super-admin'
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Login/Register Component
interface AuthPageProps {
  onPageChange: (page: string) => void;
}

export function AuthPage({ onPageChange }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  
  const { login, register, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await login(email, password, userType);
    if (success) {
      onPageChange('home');
    } else {
      setError('Invalid credentials. Use password123 for demo accounts.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password || !firstName || !lastName || !phone || !nationality) {
      setError('Please fill in all fields');
      return;
    }
    
    const registerData: RegisterData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      nationality,
      userType
    };
    
    const success = await register(registerData);
    if (success) {
      setSuccess('Registration successful! You can now access the system.');
      setTimeout(() => onPageChange('home'), 2000);
    } else {
      setError('Registration failed. Email may already be in use.');
    }
  };

  const demoAccounts = [
    { email: 'john.doe@example.com', role: 'Customer', type: 'user' as const },
    { email: 'mary.smith@immigration.gov.rw', role: 'Immigration Officer', type: 'admin' as const },
    { email: 'admin@immigration.gov.rw', role: 'System Administrator', type: 'admin' as const },
    { email: 'superadmin@immigration.gov.rw', role: 'Super Administrator', type: 'admin' as const }
  ];

  return (
    <div className="min-h-screen bg-blue-lightest flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="p-3 bg-navy-medium/10 rounded-full border border-navy-medium/20">
              <Shield className="h-10 w-10 text-navy-medium" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-navy-dark">
            Border & Passport Management System
          </h1>
          <p className="text-navy-medium">Republic of Rwanda - Secure Access Portal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demo Accounts */}
          <div className="lg:col-span-1">
            <Card className="border-blue-light">
              <CardHeader>
                <CardTitle className="text-navy-dark flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Demo Accounts</span>
                </CardTitle>
                <CardDescription>Use these accounts to explore the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <div 
                    key={index}
                    className="border border-blue-light rounded-lg p-3 cursor-pointer hover:bg-blue-lightest transition-colors"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('password123');
                      setUserType(account.type);
                    }}
                  >
                    <div className="font-medium text-navy-dark text-sm">{account.role}</div>
                    <div className="text-xs text-navy-medium font-mono">{account.email}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        account.type === 'user' ? 'border-blue-medium text-blue-medium' : 'border-navy-medium text-navy-medium'
                      }`}
                    >
                      {account.type === 'user' ? 'Public User' : 'Staff/Admin'}
                    </Badge>
                  </div>
                ))}
                <div className="text-xs text-navy-medium mt-3 p-2 bg-blue-lightest rounded">
                  💡 Password for all demo accounts: <code className="font-mono">password123</code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login/Register Form */}
          <div className="lg:col-span-2">
            <Card className="border-blue-light">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-navy-dark">Access Portal</CardTitle>
                    <CardDescription>Sign in to your account or create a new one</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setUserType('user')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        userType === 'user' 
                          ? 'bg-blue-medium text-white' 
                          : 'bg-blue-lightest text-navy-medium hover:bg-blue-light'
                      }`}
                    >
                      Public User
                    </button>
                    <button
                      onClick={() => setUserType('admin')}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        userType === 'admin' 
                          ? 'bg-navy-medium text-white' 
                          : 'bg-blue-lightest text-navy-medium hover:bg-blue-light'
                      }`}
                    >
                      Staff/Admin
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email Address</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-navy-medium hover:text-navy-dark"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {error && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-600">{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-navy-medium hover:bg-navy-dark text-white"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="register-email">Email Address</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+250 7XX XXX XXX"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality">Nationality</Label>
                          <select
                            id="nationality"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-light rounded-md bg-white text-navy-dark"
                            required
                          >
                            <option value="">Select nationality</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-navy-medium hover:text-navy-dark"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {error && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-red-600">{error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {success && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-600">{success}</AlertDescription>
                        </Alert>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-navy-medium hover:bg-navy-dark text-white"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-4 border-t border-blue-light">
                  <Button 
                    variant="outline" 
                    onClick={() => onPageChange('home')}
                    className="w-full border-blue-medium text-navy-medium hover:bg-blue-lightest"
                  >
                    Continue as Guest (Limited Access)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}