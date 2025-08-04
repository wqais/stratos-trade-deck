import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { insertUserSchema, loginSchema, type InsertUser, type Login } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';

export function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const { login, register, isLoginLoading, isRegisterLoading, loginError, registerError } = useAuth();

  const loginForm = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onLoginSubmit = (data: Login) => {
    login(data);
  };

  const onRegisterSubmit = (data: InsertUser) => {
    register(data);
  };

  const currentForm = isRegister ? registerForm : loginForm;
  const isLoading = isRegister ? isRegisterLoading : isLoginLoading;
  const error = isRegister ? registerError : loginError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? 'Enter your details to create your trading account'
              : 'Sign in to access your trading dashboard'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={isRegister ? registerForm.handleSubmit(onRegisterSubmit) : loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...currentForm.register('username')}
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {currentForm.formState.errors.username && (
                <p className="text-sm text-destructive mt-1">
                  {currentForm.formState.errors.username.message}
                </p>
              )}
            </div>

            {isRegister && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register('email')}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...currentForm.register('password')}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {currentForm.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {currentForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : (isRegister ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <Button
            variant="link"
            onClick={() => setIsRegister(!isRegister)}
            disabled={isLoading}
            className="w-full"
          >
            {isRegister 
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}