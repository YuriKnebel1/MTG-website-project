'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Deck {
  id: string;
  name: string;
  description: string | null;
  format: string;
  createdAt: string; // Mudado de Date para string
  updatedAt: string; // Mudado de Date para string
  _count: {
    deckCards: number;
  };
}

export default function Decks() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.email) {
      fetchUserDecks();
    }
  }, [session, status, router]);

  const fetchUserDecks = async () => {
    try {
      const response = await fetch('/api/decks');
      if (response.ok) {
        const data = await response.json();
        setUserDecks(data.decks || []);
      }
    } catch (error) {
      console.error('Erro ao buscar decks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Decks
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {userDecks.length} {userDecks.length === 1 ? 'deck' : 'decks'} criados
            </p>
          </div>
          <Link href="/decks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Deck
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Decks</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userDecks.length}</div>
              <p className="text-xs text-muted-foreground">
                Decks criados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(userDecks.map((deck: Deck) => deck.format)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos diferentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Deck</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userDecks.length > 0 ? formatDate(userDecks[0].createdAt) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">
                Data de criação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Decks Grid */}
        {userDecks.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum deck criado ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Comece criando seu primeiro deck com as cartas da sua coleção
            </p>
            <Link href="/decks/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Deck
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userDecks.map((deck: Deck) => (
              <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-1">{deck.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {deck.format} • {deck._count.deckCards} cartas
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {deck.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {deck.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Criado em {formatDate(deck.createdAt)}</span>
                    <span>Atualizado em {formatDate(deck.updatedAt)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/decks/${deck.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Visualizar
                      </Button>
                    </Link>
                    <Link href={`/decks/${deck.id}/edit`} className="flex-1">
                      <Button className="w-full">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
