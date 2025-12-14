import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login({ 
        ...(loginType === 'phone' ? { phone_number: identifier } : { email: identifier }),
        password 
      });
      if (res.data) {
        login(res.data.user, res.data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className={cn('flex flex-col gap-6 w-full max-w-4xl')}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your AyarFarm account
                  </p>
                </div>
                <Field>
                  <FieldLabel>Login with</FieldLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={loginType === 'phone' ? 'default' : 'outline'}
                      onClick={() => setLoginType('phone')}
                      className="flex-1"
                    >
                      Phone
                    </Button>
                    <Button
                      type="button"
                      variant={loginType === 'email' ? 'default' : 'outline'}
                      onClick={() => setLoginType('email')}
                      className="flex-1"
                    >
                      Email
                    </Button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="identifier">
                    {loginType === 'phone' ? 'Phone Number' : 'Email'}
                  </FieldLabel>
                  <Input
                    id="identifier"
                    type={loginType === 'phone' ? 'tel' : 'email'}
                    placeholder={loginType === 'phone' ? '+959...' : 'm@example.com'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" className="w-full">Login</Button>
                </Field>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
            <div className="bg-muted relative hidden md:block">
              <div className="absolute inset-0 bg-green-600 opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-green-600">AyarFarm</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
