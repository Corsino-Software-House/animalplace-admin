import { z } from 'zod';

const envSchema = z.object({
  BASE_URL_API: z.string()
    .min(1, 'BASE_URL_API é obrigatória')
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'BASE_URL_API deve ser uma URL válida' }
    ),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

// Validação das variáveis de ambiente
const validateEnv = () => {
  const envVars = {
    BASE_URL_API: import.meta.env.VITE_BASE_URL_API || 
                  process.env.VITE_BASE_URL_API || 
                  process.env.BASE_URL_API ||
                  'https://b94d9ce85a43.ngrok-free.app', // Fallback para desenvolvimento
    NODE_ENV: import.meta.env.MODE || process.env.NODE_ENV || 'development',
  };

  try {
    return envSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro nas variáveis de ambiente:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Certifique-se de que o arquivo .env.local existe e contém:');

      // Em desenvolvimento, podemos usar valores padrão
      if (envVars.NODE_ENV === 'development') {
        console.warn('\nUsando valores padrão para desenvolvimento...');
        return {
          BASE_URL_API: 'https://b94d9ce85a43.ngrok-free.app',
          NODE_ENV: 'development' as const,
        };
      }
      
      throw new Error(`Configuração inválida das variáveis de ambiente. Verifique o console para mais detalhes.`);
    }
    throw error;
  }
};

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

