import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Shield, 
  LogOut,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Building,
  Phone
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';

interface UserSettings {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  industry: string;
  address: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  invoiceReminders: boolean;
  paymentAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');

  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    industry: '',
    address: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    invoiceReminders: true,
    paymentAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    setUserSettings({
      name: userData.name || '',
      email: userData.email || '',
      businessName: userData.businessName || 'BizFlow Finance',
      phone: userData.phone || '+1 (555) 123-4567',
      industry: userData.industry || 'Consulting',
      address: userData.address || '123 Business St, City, State 12345'
    });

    // Load theme settings from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'normal' | 'large' | null;
    const savedColorScheme = localStorage.getItem('colorScheme') as 'blue' | 'green' | 'purple' | 'orange' | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedColorScheme) setColorScheme(savedColorScheme);

    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveProfile = () => {
    setSaveError('');
    setSaveSuccess('');

    // Validation
    if (!userSettings.name.trim()) {
      setSaveError('Name is required');
      return;
    }
    if (!userSettings.email.trim()) {
      setSaveError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userSettings.email)) {
      setSaveError('Please enter a valid email address');
      return;
    }

    // Save to localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...user,
      ...userSettings
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setSaveSuccess('Profile updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleChangePassword = () => {
    setSaveError('');
    setSaveSuccess('');

    if (!passwordData.currentPassword) {
      setSaveError('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      setSaveError('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setSaveError('Password must be at least 8 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('Passwords do not match');
      return;
    }

    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setSaveSuccess('Password changed successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleSaveNotifications = () => {
    setSaveError('');
    setSaveSuccess('');
    // Save notification settings
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    setSaveSuccess('Notification settings updated!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleSaveSecurity = () => {
    setSaveError('');
    setSaveSuccess('');
    // Save security settings
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    setSaveSuccess('Security settings updated!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleNotificationToggle = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSecurityToggle = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: typeof prev[setting] === 'boolean' ? !prev[setting] : prev[setting]
    }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setSaveSuccess('Theme changed successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleFontSizeChange = (newSize: 'small' | 'normal' | 'large') => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    
    // Apply font size to document
    document.documentElement.style.fontSize = 
      newSize === 'small' ? '14px' : newSize === 'large' ? '18px' : '16px';
    
    setSaveSuccess('Font size changed successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleColorSchemeChange = (newColor: 'blue' | 'green' | 'purple' | 'orange') => {
    setColorScheme(newColor);
    localStorage.setItem('colorScheme', newColor);
    
    setSaveSuccess('Color scheme changed successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleSaveAppearance = () => {
    setSaveError('');
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('colorScheme', colorScheme);
    setSaveSuccess('Appearance settings saved!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account, notifications, and security settings</p>
          </div>

          {/* Alert Messages */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">{saveSuccess}</p>
            </div>
          )}

          {saveError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">{saveError}</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account" className="gap-2">
                <User size={18} />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell size={18} />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield size={18} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette size={18} />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal and business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userSettings.name}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={userSettings.businessName}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Your business name"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userSettings.phone}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={userSettings.industry}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="Your industry"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={userSettings.address}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Your business address"
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save size={18} />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password to keep it secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleChangePassword} className="gap-2">
                    <Lock size={18} />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                    <div>
                      <p className="font-medium text-foreground">Log Out</p>
                      <p className="text-sm text-muted-foreground">End your current session</p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowLogoutDialog(true)}
                      className="gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Invoice Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminded about pending invoices</p>
                      </div>
                      <Switch
                        checked={notificationSettings.invoiceReminders}
                        onCheckedChange={() => handleNotificationToggle('invoiceReminders')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Payment Alerts</p>
                        <p className="text-sm text-muted-foreground">Be notified when payments are received</p>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={() => handleNotificationToggle('paymentAlerts')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Receive weekly business summary</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Monthly Reports</p>
                        <p className="text-sm text-muted-foreground">Receive comprehensive monthly reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.monthlyReports}
                        onCheckedChange={() => handleNotificationToggle('monthlyReports')}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save size={18} />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Protect your account with advanced security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Login Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                      </div>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onCheckedChange={() => handleSecurityToggle('loginAlerts')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">Auto-logout after inactivity (minutes)</p>
                      </div>
                      <Input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        className="w-20"
                        min="5"
                        max="120"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Security Tip</p>
                        <p className="text-sm text-blue-800 mt-1">Use a strong, unique password and enable two-factor authentication for maximum security.</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSecurity} className="gap-2">
                    <Save size={18} />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize your application experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium mb-3">Theme</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleThemeChange('light')}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                            theme === 'light' 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:bg-accent'
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            theme === 'light' ? 'bg-primary-foreground' : 'bg-foreground'
                          )}></div>
                          Light
                        </button>
                        <button 
                          onClick={() => handleThemeChange('dark')}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                            theme === 'dark' 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:bg-accent'
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-full",
                            theme === 'dark' ? 'bg-primary-foreground' : 'bg-foreground'
                          )}></div>
                          Dark
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium mb-3">Font Size</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleFontSizeChange('small')}
                          className={cn(
                            "px-4 py-2 rounded-lg border transition-all text-sm",
                            fontSize === 'small' 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:bg-accent'
                          )}
                        >
                          Small
                        </button>
                        <button 
                          onClick={() => handleFontSizeChange('normal')}
                          className={cn(
                            "px-4 py-2 rounded-lg border transition-all",
                            fontSize === 'normal' 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:bg-accent'
                          )}
                        >
                          Normal
                        </button>
                        <button 
                          onClick={() => handleFontSizeChange('large')}
                          className={cn(
                            "px-4 py-2 rounded-lg border transition-all text-lg",
                            fontSize === 'large' 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:bg-accent'
                          )}
                        >
                          Large
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <p className="font-medium mb-3">Color Scheme</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleColorSchemeChange('blue')}
                          className={cn(
                            "w-10 h-10 rounded-lg bg-blue-500 hover:ring-2 ring-offset-2 ring-blue-500 transition-all",
                            colorScheme === 'blue' && 'ring-2 ring-offset-2 ring-blue-500'
                          )}
                        ></button>
                        <button 
                          onClick={() => handleColorSchemeChange('green')}
                          className={cn(
                            "w-10 h-10 rounded-lg bg-green-500 hover:ring-2 ring-offset-2 ring-green-500 transition-all",
                            colorScheme === 'green' && 'ring-2 ring-offset-2 ring-green-500'
                          )}
                        ></button>
                        <button 
                          onClick={() => handleColorSchemeChange('purple')}
                          className={cn(
                            "w-10 h-10 rounded-lg bg-purple-500 hover:ring-2 ring-offset-2 ring-purple-500 transition-all",
                            colorScheme === 'purple' && 'ring-2 ring-offset-2 ring-purple-500'
                          )}
                        ></button>
                        <button 
                          onClick={() => handleColorSchemeChange('orange')}
                          className={cn(
                            "w-10 h-10 rounded-lg bg-orange-500 hover:ring-2 ring-offset-2 ring-orange-500 transition-all",
                            colorScheme === 'orange' && 'ring-2 ring-offset-2 ring-orange-500'
                          )}
                        ></button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveAppearance} className="gap-2">
                    <Save size={18} />
                    Save Appearance
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to login again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
            Yes, Logout
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
