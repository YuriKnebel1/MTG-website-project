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
  const [metaInfo, setMetaInfo] = useState<MetaResponse | null>(null);

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

  // Filtrar decks baseado na busca e arquétipo
  const filteredDecks = metaDecks.filter(deck => {
    const matchesSearch = deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deck.keyCards.some(card => card.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArchetype = selectedArchetype === 'all' || deck.archetype.toLowerCase() === selectedArchetype.toLowerCase();
    
    return matchesSearch && matchesArchetype;
  });

  // Obter arquetipos únicos para filtros
  const archetypes = Array.from(new Set(metaDecks.map(deck => deck.archetype)));

  const getColorEmoji = (colors: string[]) => {
    if (colors.length === 0) return '⚫';
    if (colors.length === 1) {
      switch (colors[0]) {
        case 'W': return '⚪';
        case 'U': return '🔵';
        case 'B': return '⚫';
        case 'R': return '🔴';
        case 'G': return '🟢';
        default: return '⚫';
      }
    }
    return '🌈'; // Multi-colored
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
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
      'Tempo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
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
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="historic">Historic</SelectItem>
                    <SelectItem value="alchemy">Alchemy</SelectItem>
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
                  placeholder="Nome do deck, carta, ou descrição..."
                />
              </div>
            </div>

            {loading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Carregando dados do meta...
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => fetchMetaDecks(selectedFormat)} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas do Meta */}
        {metaInfo && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Decks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metaInfo.total_decks}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Formato</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{metaInfo.format}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fonte</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Untapped.gg</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Arena Only</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">Sim</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => (
            <Card key={deck.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {getColorEmoji(deck.colors)} {deck.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTierBadge(deck.tier)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getArchetypeBadge(deck.archetype)}`}>
                        {deck.archetype}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deck.description}
                </p>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">{deck.winRate.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Win Rate</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                      <Users className="h-4 w-4" />
                      <span className="font-bold">{deck.popularity.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Popularidade</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                      <Target className="h-4 w-4" />
                      <span className="font-bold">{deck.matches.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">Matches</p>
                  </div>
                </div>

                {/* Arena Data */}
                {deck.arenaData && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                      Dados do Arena:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">BO1:</span>
                        <span className="font-medium ml-1">{deck.arenaData.bo1_winrate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">BO3:</span>
                        <span className="font-medium ml-1">{deck.arenaData.bo3_winrate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cartas Principais */}
                <div>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                    Cartas Principais:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {deck.keyCards.slice(0, 4).map((card, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                      >
                        {card}
                      </span>
                    ))}
                    {deck.keyCards.length > 4 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{deck.keyCards.length - 4} mais
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open('https://untapped.gg', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver no Untapped.gg
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDecks.length === 0 && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Nenhum deck encontrado
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
