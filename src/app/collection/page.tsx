'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCollectionStore } from '@/lib/collection-store';
import { BookOpen, Plus, Minus, Trash2, Filter, X } from 'lucide-react';
import Link from 'next/link';

interface UserCard {
  id: string;
  quantity: number;
  card: {
    id: string;
    name: string;
    type: string | null;
    manaCost: string | null;
    power: string | null;
    toughness: string | null;
    imageUrl: string | null;
    setName: string | null;
    rarity: string | null;
  };
}

export default function Collection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { shouldRefresh, resetRefresh } = useCollectionStore();
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  
  // Estados dos filtros
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    rarity: '',
    setName: '',
    colors: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.email) {
      fetchUserCollection();
    }
  }, [session, status, router]);

  // Atualizar quando shouldRefresh mudar
  useEffect(() => {
    if (shouldRefresh && session?.user?.email) {
      fetchUserCollection();
      resetRefresh();
    }
  }, [shouldRefresh, session?.user?.email, resetRefresh]);

  const fetchUserCollection = async () => {
    try {
      console.log('📥 Buscando coleção do usuário...');
      const response = await fetch('/api/collection');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dados recebidos:', data);
        setUserCards(data.userCards || []);
      } else {
        console.error('❌ Erro na resposta:', response.status, response.statusText);
        setError('Erro ao carregar sua coleção');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar coleção:', error);
      setError('Erro de conexão ao buscar coleção');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (userCardId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeCard(userCardId);
      return;
    }

    setUpdating(userCardId);
    try {
      const response = await fetch('/api/collection/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCardId, quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchUserCollection();
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeCard = async (userCardId: string) => {
    setUpdating(userCardId);
    try {
      const response = await fetch('/api/collection/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCardId }),
      });

      if (response.ok) {
        await fetchUserCollection();
      }
    } catch (error) {
      console.error('Erro ao remover carta:', error);
    } finally {
      setUpdating(null);
    }
  };

  // Cartas filtradas
  const filteredCards = useMemo(() => {
    return userCards.filter((userCard) => {
      const card = userCard.card;
      
      // Filtro por nome
      if (filters.name && !card.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Filtro por tipo
      if (filters.type && !card.type?.toLowerCase().includes(filters.type.toLowerCase())) {
        return false;
      }
      
      // Filtro por raridade
      if (filters.rarity && card.rarity !== filters.rarity) {
        return false;
      }
      
      // Filtro por set
      if (filters.setName && !card.setName?.toLowerCase().includes(filters.setName.toLowerCase())) {
        return false;
      }
      
      // Filtro por cores (baseado no custo de mana)
      if (filters.colors) {
        const manaCost = card.manaCost || '';
        const hasColor = filters.colors.split('').some(color => 
          manaCost.includes(`{${color.toUpperCase()}}`));
        if (!hasColor) return false;
      }
      
      return true;
    });
  }, [userCards, filters]);

  const clearFilters = () => {
    setFilters({
      name: '',
      type: '',
      rarity: '',
      setName: '',
      colors: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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

  // Exibir erro se houver
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                Erro ao carregar coleção
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => {
                  setError('');
                  fetchUserCollection();
                }}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalCards = filteredCards.reduce((sum: number, userCard: UserCard) => sum + userCard.quantity, 0);
  const uniqueCards = filteredCards.length;

  const formatManaSymbols = (manaCost: string | null) => {
    if (!manaCost) return '';
    
    return manaCost
      .replace(/{([^}]+)}/g, '($1)')
      .replace(/([WUBRG])/g, '($1)');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Minha Coleção
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {totalCards} cartas • {uniqueCards} cartas únicas
            </p>
          </div>
          <Link href="/cards/search">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartas
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Filter className="h-5 w-5" />
                Filtros
                {hasActiveFilters && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v !== '').length} ativo(s)
                  </span>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Nome */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome da Carta
                  </Label>
                  <Input
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    placeholder="Digite o nome..."
                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo
                  </Label>
                  <Select
                    value={filters.type || ""}
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="Creature">Criatura</SelectItem>
                      <SelectItem value="Sorcery">Feitiço</SelectItem>
                      <SelectItem value="Instant">Instantâneo</SelectItem>
                      <SelectItem value="Enchantment">Encantamento</SelectItem>
                      <SelectItem value="Artifact">Artefato</SelectItem>
                      <SelectItem value="Land">Terreno</SelectItem>
                      <SelectItem value="Planeswalker">Planeswalker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Raridade */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Raridade
                  </Label>
                  <Select
                    value={filters.rarity || ""}
                    onValueChange={(value) => setFilters({ ...filters, rarity: value })}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione a raridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as raridades</SelectItem>
                      <SelectItem value="common">Comum</SelectItem>
                      <SelectItem value="uncommon">Incomum</SelectItem>
                      <SelectItem value="rare">Rara</SelectItem>
                      <SelectItem value="mythic">Mítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Set */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Coleção (Set)
                  </Label>
                  <Input
                    value={filters.setName}
                    onChange={(e) => setFilters({ ...filters, setName: e.target.value })}
                    placeholder="Digite o nome da coleção..."
                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Cores */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cores
                  </Label>
                  <Select
                    value={filters.colors || ""}
                    onValueChange={(value) => setFilters({ ...filters, colors: value })}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Selecione as cores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as cores</SelectItem>
                      <SelectItem value="W">Branco</SelectItem>
                      <SelectItem value="U">Azul</SelectItem>
                      <SelectItem value="B">Preto</SelectItem>
                      <SelectItem value="R">Vermelho</SelectItem>
                      <SelectItem value="G">Verde</SelectItem>
                      <SelectItem value="C">Incolor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão limpar */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total de Cartas</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCards}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cartas na sua coleção</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cartas Únicas</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{uniqueCards}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cartas diferentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Valor Estimado</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ --</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Em breve</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de cartas */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              {userCards.length === 0 ? 'Sua coleção está vazia' : 'Nenhuma carta corresponde aos filtros'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
              {userCards.length === 0 ? 'Comece adicionando algumas cartas à sua coleção' : 'Tente ajustar os filtros para encontrar suas cartas'}
            </p>
            <Link href="/cards/search">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Buscar Cartas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((userCard: UserCard) => (
              <Card key={userCard.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="aspect-[5/7] bg-gray-100 dark:bg-gray-700">
                  {userCard.card.imageUrl ? (
                    <Image
                      src={userCard.card.imageUrl}
                      alt={userCard.card.name}
                      width={200}
                      height={280}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {userCard.card.name}
                  </h3>
                  
                  {userCard.card.manaCost && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {formatManaSymbols(userCard.card.manaCost)}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{userCard.card.type}</p>
                  
                  {userCard.card.setName && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{userCard.card.setName}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(userCard.id, userCard.quantity - 1)}
                        disabled={updating === userCard.id}
                        className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-semibold text-lg min-w-[2rem] text-center text-gray-900 dark:text-white">
                        {userCard.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(userCard.id, userCard.quantity + 1)}
                        disabled={updating === userCard.id}
                        className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCard(userCard.id)}
                      disabled={updating === userCard.id}
                      className="h-8 w-8 p-0 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
