import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthTest: React.FC = () => {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'admin@portfolio.com', 
          password: 'admin123' 
        }),
      });

      const data = await response.json();
      console.log('Test login response:', data);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      }
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.name : 'None'}</p>
            <p><strong>Token:</strong> {token ? 'Exists' : 'None'}</p>
          </div>
          
          <div className="space-y-2">
            <Button onClick={testLogin} className="w-full">
              Test Login
            </Button>
            {isAuthenticated && (
              <Button onClick={logout} variant="outline" className="w-full">
                Logout
              </Button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Check browser console for debug logs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
