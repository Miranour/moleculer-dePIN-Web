import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowRight, Loader2, Lock, Mail, User } from 'lucide-react';

import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    try {
      if (!credentialResponse.credential) throw new Error('Google Kimliği alınamadı.');
      const response = await authService.googleLogin(credentialResponse.credential);
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google ile kayıt başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.register(email, password, name);
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
      
      <div className="z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="bg-primary/20 p-3 rounded-2xl ring-1 ring-primary/30">
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Aramıza Katılın</h1>
          <p className="text-zinc-400 mt-2">Merkeziyetsiz hesaplama ağına araştırmacı olarak katılın.</p>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Hesap Oluşturun</CardTitle>
            <CardDescription>DePIN moleküler platformunda yerinizi alın</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center py-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google kaydı başlatılamadı.')}
                theme="filled_black"
                shape="rectangular"
                width="100%"
                text="signup_with"
              />
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">veya e-posta ile</span>
              </div>
            </div>
          </CardContent>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Adınız Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-primary"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 mt-2">
              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Kayıt Ol'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
              <div className="text-center text-sm text-zinc-400">
                Zaten hesabınız var mı? <Link to="/login" className="text-primary hover:underline">Giriş Yapın</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
