'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewDeck() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Verificar se está autenticado
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Campo obrigatório',
        message: 'O nome do deck é obrigatório.'
      });
      return;
    }

    if (!formData.format) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Campo obrigatório',
        message: 'O formato do deck é obrigatório.'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          format: formData.format
        }),
      });

      if (response.ok) {
        await response.json();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Deck criado!',
          message: `O deck "${formData.name}" foi criado com sucesso.`
        });
        
        // Redirecionar para a lista de decks após 2 segundos
        setTimeout(() => {
          router.push('/decks');
        }, 2000);
      } else {
        const error = await response.json();
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Erro ao criar deck',
          message: error.message || 'Ocorreu um erro inesperado. Tente novamente.'
        });
      }
    } catch (err) {
      console.error('Erro ao criar deck:', err);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível conectar ao servidor. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/decks">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Novo Deck
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crie um novo deck para sua coleção
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Informações do Deck
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Preencha as informações básicas do seu novo deck
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Deck */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome do Deck *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Azorius Control, Burn, Combo Deck..."
                  className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.name.length}/100 caracteres
                </p>
              </div>

              {/* Formato */}
              <div>
                <Label htmlFor="format" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato *
                </Label>
                <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                  <SelectTrigger className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="pioneer">Pioneer</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="legacy">Legacy</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="commander">Commander/EDH</SelectItem>
                    <SelectItem value="historic">Historic</SelectItem>
                    <SelectItem value="alchemy">Alchemy</SelectItem>
                    <SelectItem value="explorer">Explorer</SelectItem>
                    <SelectItem value="pauper">Pauper</SelectItem>
                    <SelectItem value="brawl">Brawl</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição (opcional)
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva a estratégia do deck, cartas principais, sideboard..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Link href="/decks" className="flex-1">
                  <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={loading || !formData.name.trim() || !formData.format}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Deck
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Próximos passos
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Após criar o deck, você poderá adicionar cartas da sua coleção
              </li>
              <li className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Configure o sideboard e ajuste as quantidades
              </li>
              <li className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Compartilhe com outros jogadores e receba feedback
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        type={modalState.type}
      >
        <p className="text-gray-700 dark:text-gray-300">{modalState.message}</p>
      </Modal>
    </div>
  );
}
