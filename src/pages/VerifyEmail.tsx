import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PawPrint as Paw, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useVerifyEmailCode, useResendVerification } from '../hooks/useAuth';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const verifyMutation = useVerifyEmailCode();
  const resendMutation = useResendVerification();

  useEffect(() => {
    // Pega o email dos parâmetros da URL ou do estado de navegação
    const urlParams = new URLSearchParams(location.search);
    const emailFromUrl = urlParams.get('email');
    const emailFromState = location.state?.email;
    
    const userEmail = emailFromUrl || emailFromState;
    
    if (userEmail) {
      setEmail(userEmail);
    } else {
      // Se não tem email, redireciona para o registro
      navigate('/register');
    }

    // Inicia countdown para reenvio
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location, navigate]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      toast({
        title: "Código inválido",
        description: "O código deve ter exatamente 6 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await verifyMutation.mutateAsync({ email, code });
      
      toast({
        title: "Email verificado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      });
      
      // Redireciona para o dashboard após verificação bem-sucedida
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Erro na verificação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      await resendMutation.mutateAsync({ email });
      
      // Reinicia o countdown
      setCanResend(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
    }
  };

  const formatCode = (value: string) => {
    // Remove tudo que não é número
    const digits = value.replace(/\D/g, '');
    // Limita a 6 dígitos
    return digits.slice(0, 6);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto font-space-grotesk">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Paw className="h-12 w-12" style={{ color: '#95CA3C' }} />
            <span className="text-3xl font-bold text-black">AnimalPlace</span>
          </div>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>

        <Card className="border w-full border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Verifique seu email
            </CardTitle>
            <p className="text-sm text-gray-600">
              Enviamos um código de 6 dígitos para<br />
              <strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Código de verificação
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 text-center">
                  Digite o código de 6 dígitos enviado para seu email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#95CA3C' }}
                disabled={isLoading || verifyMutation.isPending || code.length !== 6}
              >
                {isLoading || verifyMutation.isPending ? 'Verificando...' : 'Verificar código'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-gray-600">
                Não recebeu o código?
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={!canResend || resendMutation.isPending}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${resendMutation.isPending ? 'animate-spin' : ''}`} />
                {canResend 
                  ? (resendMutation.isPending ? 'Reenviando...' : 'Reenviar código')
                  : `Reenviar em ${countdown}s`
                }
              </Button>

              <div className="text-sm">
                <Link
                  to="/register"
                  className="font-medium hover:underline"
                  style={{ color: '#95CA3C' }}
                >
                  Voltar ao cadastro
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
