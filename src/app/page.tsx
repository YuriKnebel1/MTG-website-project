import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Search,
  BarChart3,
  Sparkles,
  Shield,
  User,
  Key
} from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            MTG Manager
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            O sistema completo para gerenciar sua coleção de Magic: The Gathering
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Organize suas cartas, construa decks, acompanhe o meta e monitore preços. 
            Tudo em um só lugar, com integração direta com a base de dados Scryfall.
          </p>

          {/* Credenciais de Teste */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-12 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center justify-center">
              <Key className="h-5 w-5 mr-2" />
              Credenciais de Teste
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center text-yellow-700 dark:text-yellow-300">
                <User className="h-4 w-4 mr-2" />
                <span className="font-mono">admin@teste.com</span>
              </div>
              <div className="flex items-center justify-center text-yellow-700 dark:text-yellow-300">
                <Shield className="h-4 w-4 mr-2" />
                <span className="font-mono">123456</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                Criar Conta Gratuita
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Recursos Principais
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tudo que você precisa para gerenciar sua coleção de MTG
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Gestão de Coleção</CardTitle>
              <CardDescription>
                Organize e catalogue todas as suas cartas com facilidade. Busque por nome, cor, tipo e muito mais.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Construção de Decks</CardTitle>
              <CardDescription>
                Monte e gerencie seus decks com sugestões inteligentes baseadas na sua coleção.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Análise de Meta</CardTitle>
              <CardDescription>
                Acompanhe os decks mais populares e como eles se comparam à sua coleção.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Busca Avançada</CardTitle>
              <CardDescription>
                Integração completa com Scryfall para dados atualizados de todas as cartas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle>Monitoramento de Preços</CardTitle>
              <CardDescription>
                Acompanhe o valor da sua coleção e receba alertas de mudanças de preço.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Dados Seguros</CardTitle>
              <CardDescription>
                Seus dados são protegidos com criptografia e backup automático.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crie sua conta gratuita e comece a organizar sua coleção hoje mesmo.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
