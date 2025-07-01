'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScryfallPriceDetailed } from '@/components/scryfall-price';
import { CardDetailModal } from '@/components/card-detail-modal';
import { Search, DollarSign, Info, ExternalLink, Eye } from 'lucide-react';
import Image from 'next/image';

interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  image_uris?: {
    normal: string;
    small?: string;
    large?: string;
  };
  prices?: {
    usd?: string;
    eur?: string;
  };
  set_name: string;
  rarity: string;
  artist?: string;
  set: string;
}

export default function PricesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const searchCards = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, digite um termo de busca');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}&unique=cards&order=released&dir=desc`,
        {
          headers: {
            'User-Agent': 'MTG-Manager/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar cartas');
      }

      const data = await response.json();
      setCards(data.data || []);
    } catch (err) {
      setError('Erro ao buscar cartas. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatManaSymbols = (manaCost: string) => {
    if (!manaCost) return '';
    
    return manaCost
      .replace(/{([^}]+)}/g, '($1)')
      .replace(/([WUBRG])/g, '($1)');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'mythic': return 'bg-orange-500 text-white';
      case 'rare': return 'bg-yellow-500 text-black';
      case 'uncommon': return 'bg-gray-400 text-white';
      case 'common': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    setLoading(true);
    setError('');

    fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(term)}&unique=cards&order=released&dir=desc`,
      {
        headers: {
          'User-Agent': 'MTG-Manager/1.0',
        },
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar cartas');
      }
      return response.json();
    })
    .then(data => {
      setCards(data.data || []);
    })
    .catch(err => {
      setError('Erro ao buscar cartas. Tente novamente.');
      console.error('Erro:', err);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Preços de Cartas MTG
          </h1>
          <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 dark:text-green-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Preços via Scryfall API
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Os preços são obtidos diretamente da API do Scryfall, que agrega dados de várias fontes confiáveis. 
                  Valores em USD são oficiais, valores em BRL são estimados com base na cotação atual e margem das lojas brasileiras.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Search className="h-5 w-5" />
              Buscar Cartas por Preço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">Termo de busca</Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ex: Lightning Bolt, creature, planeswalker..."
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchCards();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={searchCards} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {cards.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resultados ({cards.length} cartas encontradas)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {/* Card Image */}
                  {card.image_uris && (
                    <div className="aspect-[5/7] bg-gray-100 dark:bg-gray-700 cursor-pointer"
                         onClick={() => setSelectedCard(card.id)}>
                      <Image
                        src={card.image_uris.normal}
                        alt={card.name}
                        width={200}
                        height={280}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => setSelectedCard(card.id)}>
                        {card.name}
                      </h3>
                      
                      {card.mana_cost && (
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded w-fit mb-2">
                          {formatManaSymbols(card.mana_cost)}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(card.rarity)}`}>
                          {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {card.set_name} ({card.set.toUpperCase()})
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {card.type_line}
                      </p>
                    </div>

                    {/* Preços */}
                    <div className="mb-4">
                      <ScryfallPriceDetailed scryfallId={card.id} />
                    </div>

                    {/* Official Prices from Scryfall */}
                    {card.prices && (card.prices.usd || card.prices.eur) && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                          Preços Oficiais (Scryfall):
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {card.prices.usd && (
                            <div className="flex items-center text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${card.prices.usd} USD
                            </div>
                          )}
                          {card.prices.eur && (
                            <div className="flex items-center text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
                              <DollarSign className="h-3 w-3 mr-1" />
                              €{card.prices.eur} EUR
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCard(card.id)}
                        className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://scryfall.com/card/${card.set}/${card.id}`, '_blank')}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Artist */}
                    {card.artist && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Arte: {card.artist}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {cards.length === 0 && !loading && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              Nenhuma carta encontrada
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Tente ajustar o termo de busca
            </p>
          </div>
        )}

        {/* Quick suggestions when no search is made */}
        {cards.length === 0 && !loading && !searchTerm && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              Busque por cartas para ver seus preços atualizados
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickSearch('Lightning Bolt')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Lightning Bolt
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickSearch('Black Lotus')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Black Lotus
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickSearch('Teferi')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Teferi
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickSearch('fetch land')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Fetch Lands
              </Button>
            </div>
          </div>
        )}

        {/* Card Detail Modal */}
        <CardDetailModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          cardId={selectedCard}
        />
      </div>
    </div>
  );
}
