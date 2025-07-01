'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Target, ExternalLink, Filter, AlertTriangle, Trophy, Zap, Info } from 'lucide-react';

interface UntappedDeck {
  id: string;
  name: string;
  format: string;
  winRate: number;
  popularity: number;
  matches: number;
  averageCost: number;
  colors: string[];
  description: string;
  keyCards: string[];
  archetype: string;
  tier: number;
  lastUpdated: string;
  source: string;
  arenaData?: {
    bo1_winrate: number;
    bo3_winrate: number;
    rank_distribution?: Record<string, number>;
  };
  decklist?: Array<{
    name: string;
    quantity: number;
    category: 'main' | 'sideboard';
  }>;
}

interface MetaResponse {
  meta_decks: UntappedDeck[];
  format: string;
  total_decks: number;
  data_source: string;
  arena_specific: boolean;
  last_updated: string;
  disclaimer: string;
}

export default function MetaDecksPage() {
  const [metaDecks, setMetaDecks] = useState<UntappedDeck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [minWinRate, setMinWinRate] = useState('');
  const [sortBy, setSortBy] = useState('winRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [metaInfo, setMetaInfo] = useState<MetaResponse | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Buscar dados do meta
  const fetchMetaDecks = async (format: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/meta/untapped?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do meta');
      }
      
      const data: MetaResponse = await response.json();
      setMetaDecks(data.meta_decks);
      setMetaInfo(data);
    } catch (err) {
      setError('Erro ao carregar dados do meta. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaDecks(selectedFormat);
  }, [selectedFormat]);

  // Filtrar decks baseado na busca, arquétipo e outros filtros
  const filteredDecks = metaDecks.filter(deck => {
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.keyCards.some(card => card.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArchetype = selectedArchetype === 'all' || deck.archetype.toLowerCase() === selectedArchetype.toLowerCase();
    
    const matchesTier = selectedTier === 'all' || deck.tier.toString() === selectedTier;
    
    const matchesWinRate = !minWinRate || deck.winRate >= parseFloat(minWinRate);
    
    return matchesSearch && matchesArchetype && matchesTier && matchesWinRate;
  }).sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'popularity':
        aValue = a.popularity;
        bValue = b.popularity;
        break;
      case 'winRate':
        aValue = a.winRate;
        bValue = b.winRate;
        break;
      case 'matches':
        aValue = a.matches;
        bValue = b.matches;
        break;
      case 'cost':
        aValue = a.averageCost;
        bValue = b.averageCost;
        break;
      default:
        aValue = a.winRate;
        bValue = b.winRate;
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // Obter arquetipos únicos para filtros
  const archetypes = Array.from(new Set(metaDecks.map(deck => deck.archetype)));

  const getColorEmoji = (colors: string[]) => {
    if (colors.length === 0) return '⚫';
    if (colors.length === 1) {
      const colorMap: Record<string, string> = {
        'W': '⚪',
        'U': '🔵', 
        'B': '⚫',
        'R': '🔴',
        'G': '🟢'
      };
      return colorMap[colors[0]] || '⚫';
    }
    return '🌈'; // Multicolor
  };

  const getTierBadge = (tier: number) => {
    switch(tier) {
      case 1:
        return <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          Tier 1
        </span>;
      case 2:
        return <span className="bg-gray-400 text-white px-2 py-1 rounded text-xs font-medium">Tier 2</span>;
      default:
        return <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">Tier {tier}</span>;
    }
  };

  const getArchetypeBadge = (archetype: string) => {
    const colors = {
      'Aggro': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Control': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Midrange': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Combo': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Tempo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Ramp': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
    };
    
    return colors[archetype as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meta Decks - MTG Arena
          </h1>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Dados do MTG Arena via Untapped.gg
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Os decks mostrados abaixo representam o meta atual do <strong>MTG Arena</strong>, 
                  obtidos através da plataforma Untapped.gg. Estes dados refletem as estratégias 
                  mais populares e efetivas no ambiente digital do Arena, que pode diferir do meta 
                  do Magic físico.
                </p>
                {metaInfo && (
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    Última atualização: {new Date(metaInfo.last_updated).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Busca
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="historic">Historic</SelectItem>
                    <SelectItem value="explorer">Explorer</SelectItem>
                    <SelectItem value="alchemy">Alchemy</SelectItem>
                    <SelectItem value="brawl">Brawl</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="archetype">Arquétipo</Label>
                <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os arquetipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {archetypes.map(archetype => (
                      <SelectItem key={archetype} value={archetype.toLowerCase()}>
                        {archetype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="search">Buscar Deck</Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome do deck, cartas-chave..."
                />
              </div>
            </div>

            {/* Filtros Avançados */}
            {showAdvancedFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="1">Tier 1</SelectItem>
                        <SelectItem value="2">Tier 2</SelectItem>
                        <SelectItem value="3">Tier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="minWinRate">WinRate Mínimo (%)</Label>
                    <Input
                      id="minWinRate"
                      type="number"
                      value={minWinRate}
                      onChange={(e) => setMinWinRate(e.target.value)}
                      placeholder="50"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sortBy">Ordenar Por</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ordenação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="winRate">WinRate</SelectItem>
                        <SelectItem value="popularity">Popularidade</SelectItem>
                        <SelectItem value="matches">Partidas</SelectItem>
                        <SelectItem value="cost">Custo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sortOrder">Ordem</Label>
                    <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ordem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Decrescente</SelectItem>
                        <SelectItem value="asc">Crescente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedArchetype('all');
                        setSelectedTier('all');
                        setMinWinRate('');
                        setSortBy('winRate');
                        setSortOrder('desc');
                      }}
                      className="w-full"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas do Meta */}
        {metaInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Decks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metaInfo.total_decks}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Decks Filtrados</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredDecks.length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Formato</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{selectedFormat}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fonte</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Untapped.gg</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estado de Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Carregando dados do meta...
            </div>
          </div>
        )}

        {/* Estado de Erro */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => fetchMetaDecks(selectedFormat)} 
              variant="outline" 
              size="sm"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Lista de Decks */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDecks.map((deck) => (
              <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getColorEmoji(deck.colors)}</span>
                      <CardTitle className="text-lg">{deck.name}</CardTitle>
                    </div>
                    {getTierBadge(deck.tier)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getArchetypeBadge(deck.archetype)}`}>
                      {deck.archetype}
                    </span>
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                      {deck.format}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{deck.description}</p>
                  
                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">WinRate</p>
                        <p className="font-semibold text-green-600">{deck.winRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Popularidade</p>
                        <p className="font-semibold text-blue-600">{deck.popularity.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Partidas</p>
                        <p className="font-semibold text-purple-600">{deck.matches.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-xs text-gray-500">Custo</p>
                        <p className="font-semibold text-yellow-600">R$ {deck.averageCost.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Arena Data */}
                  {deck.arenaData && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                      <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Dados do Arena:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">BO1:</span>
                          <span className="ml-1 font-semibold">{deck.arenaData.bo1_winrate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">BO3:</span>
                          <span className="ml-1 font-semibold">{deck.arenaData.bo3_winrate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Cartas-chave */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Cartas-chave:</h4>
                    <div className="flex flex-wrap gap-1">
                      {deck.keyCards.slice(0, 4).map((card, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                          {card}
                        </span>
                      ))}
                      {deck.keyCards.length > 4 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                          +{deck.keyCards.length - 4} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://untapped.gg/meta/${selectedFormat}`, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver no Untapped.gg
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !error && filteredDecks.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum deck encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros para encontrar decks do meta.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedArchetype('all');
                setSelectedTier('all');
                setMinWinRate('');
              }}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
