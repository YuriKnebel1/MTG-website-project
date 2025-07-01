'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { ScryfallPriceCompact } from '@/components/scryfall-price';
import { CardDetailModal } from '@/components/card-detail-modal';
import { useCollectionStore } from '@/lib/collection-store';
import { Search, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
}

export default function CardSearch() {
  const { data: session } = useSession();
  const router = useRouter();
  const triggerRefresh = useCollectionStore((state) => state.triggerRefresh);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
  const [cardDetailModal, setCardDetailModal] = useState<{
    isOpen: boolean;
    cardId: string | null;
  }>({
    isOpen: false,
    cardId: null
  });

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Erro ao buscar sugestões:', err);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() && searchTerm.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSuggestions]);

  const searchCards = async () => {
    if (!searchTerm.trim() && !selectedCategory && !selectedColor && !selectedRarity) {
      setError('Digite um termo para buscar ou selecione algum filtro');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Construir query para Scryfall com filtros
      let query = searchTerm.trim();
      
      if (selectedCategory) {
        if (query) query += ' ';
        query += `type:${selectedCategory}`;
      }
      
      if (selectedColor) {
        if (query) query += ' ';
        query += `color:${selectedColor}`;
      }
      
      if (selectedRarity) {
        if (query) query += ' ';
        query += `rarity:${selectedRarity}`;
      }
      
      // Se não há query, buscar cartas gerais
      if (!query) {
        query = '*'; // Buscar todas as cartas
      }
      
      const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=name`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setCards([]);
          setError('Nenhuma carta encontrada com os filtros selecionados.');
          return;
        }
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

  const addToCollection = async (card: ScryfallCard) => {
    if (!session) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Login Necessário',
        message: 'Você precisa estar logado para adicionar cartas à coleção'
      });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      const response = await fetch('/api/collection/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scryfallId: card.id,
          name: card.name,
          type_line: card.type_line,
          manaCost: card.mana_cost,
          oracleText: card.oracle_text,
          power: card.power,
          toughness: card.toughness,
          imageUrl: card.image_uris?.normal,
          setName: card.set_name,
          rarity: card.rarity,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Sucesso!',
          message: result.message
        });
        // Atualizar a coleção
        triggerRefresh();
      } else {
        const error = await response.json();
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Erro',
          message: error.message || 'Erro ao adicionar carta à coleção'
        });
      }
    } catch {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro de rede. Tente novamente.'
      });
    }
  };

  const formatManaSymbols = (manaCost: string) => {
    if (!manaCost) return '';
    
    return manaCost
      .replace(/{W}/g, '⚪')
      .replace(/{U}/g, '🔵')
      .replace(/{B}/g, '⚫')
      .replace(/{R}/g, '🔴')
      .replace(/{G}/g, '🟢')
      .replace(/{C}/g, '◯')
      .replace(/{([0-9XYZ]+)}/g, '$1');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedColor('');
    setSelectedRarity('');
    setCards([]);
    setError('');
  };

  const hasActiveFilters = selectedCategory || selectedColor || selectedRarity;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Buscar Cartas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Digite o nome da carta, tipo, ou qualquer texto para buscar
        </p>

        {/* Search Form */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Search className="h-5 w-5" />
              Pesquisar na Base Scryfall
              {hasActiveFilters && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  Filtros ativos
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Digite o nome da carta, tipo, ou qualquer texto para buscar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">Termo de busca</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Ex: Lightning Bolt, Creature, Blue"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchCards();
                        setShowSuggestions(false);
                      }
                    }}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-auto">
                      {suggestions.slice(0, 10).map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setShowSuggestions(false);
                            setTimeout(() => searchCards(), 100);
                          }}
                        >
                          <span className="font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>
                  <Button onClick={searchCards} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Categoria/Tipo</Label>
                      <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os tipos</SelectItem>
                          {/* Tipos básicos */}
                          <SelectItem value="creature">Creature (Criatura)</SelectItem>
                          <SelectItem value="instant">Instant (Instantâneo)</SelectItem>
                          <SelectItem value="sorcery">Sorcery (Feitiço)</SelectItem>
                          <SelectItem value="enchantment">Enchantment (Encantamento)</SelectItem>
                          <SelectItem value="artifact">Artifact (Artefato)</SelectItem>
                          <SelectItem value="planeswalker">Planeswalker</SelectItem>
                          <SelectItem value="land">Land (Terreno)</SelectItem>
                          <SelectItem value="tribal">Tribal</SelectItem>
                          {/* Supertypes */}
                          <SelectItem value="legendary">Legendary (Lendário)</SelectItem>
                          <SelectItem value="basic">Basic Land (Terreno Básico)</SelectItem>
                          <SelectItem value="snow">Snow (Neve)</SelectItem>
                          {/* Tipos de criatura populares */}
                          <SelectItem value="angel">Angel (Anjo)</SelectItem>
                          <SelectItem value="demon">Demon (Demônio)</SelectItem>
                          <SelectItem value="dragon">Dragon (Dragão)</SelectItem>
                          <SelectItem value="elf">Elf (Elfo)</SelectItem>
                          <SelectItem value="goblin">Goblin</SelectItem>
                          <SelectItem value="human">Human (Humano)</SelectItem>
                          <SelectItem value="zombie">Zombie (Zumbi)</SelectItem>
                          <SelectItem value="wizard">Wizard (Mago)</SelectItem>
                          <SelectItem value="warrior">Warrior (Guerreiro)</SelectItem>
                          <SelectItem value="soldier">Soldier (Soldado)</SelectItem>
                          <SelectItem value="knight">Knight (Cavaleiro)</SelectItem>
                          <SelectItem value="beast">Beast (Fera)</SelectItem>
                          <SelectItem value="spirit">Spirit (Espírito)</SelectItem>
                          <SelectItem value="vampire">Vampire (Vampiro)</SelectItem>
                          <SelectItem value="merfolk">Merfolk (Sireno)</SelectItem>
                          <SelectItem value="elemental">Elemental</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="color" className="text-gray-700 dark:text-gray-300">Cor</Label>
                      <Select value={selectedColor || ""} onValueChange={setSelectedColor}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Selecione a cor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas as cores</SelectItem>
                          <SelectItem value="w">⚪ Branco</SelectItem>
                          <SelectItem value="u">🔵 Azul</SelectItem>
                          <SelectItem value="b">⚫ Preto</SelectItem>
                          <SelectItem value="r">🔴 Vermelho</SelectItem>
                          <SelectItem value="g">🟢 Verde</SelectItem>
                          <SelectItem value="c">Incolor</SelectItem>
                          <SelectItem value="m">Multicolorido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="rarity" className="text-gray-700 dark:text-gray-300">Raridade</Label>
                      <Select value={selectedRarity || ""} onValueChange={setSelectedRarity}>
                        <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Selecione a raridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas as raridades</SelectItem>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="uncommon">Uncommon</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="mythic">Mythic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        disabled={!hasActiveFilters && !searchTerm}
                        className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        Limpar Filtros
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card 
              key={card.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => setCardDetailModal({ isOpen: true, cardId: card.id })}
            >
              {/* Card Image */}
              {card.image_uris && (
                <div className="aspect-[5/7] bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={card.image_uris.normal}
                    alt={card.name}
                    width={200}
                    height={280}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent 
                className="p-4 bg-white dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()} // Evita que cliques no conteúdo abram o modal
              >
                <div className="mb-3">
                  <h3 
                    className="font-semibold text-lg mb-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    onClick={() => setCardDetailModal({ isOpen: true, cardId: card.id })}
                  >
                    {card.name}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {formatManaSymbols(card.mana_cost || '')}
                  </p>
                </div>

                <div className="text-sm mb-3">
                  <p className="mb-1 text-gray-800 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{card.type_line}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{card.set_name} • <span className="capitalize font-medium">{card.rarity}</span></p>
                </div>

                {card.power && card.toughness && (
                  <div className="text-sm font-bold mb-3 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded w-fit">
                    {card.power}/{card.toughness}
                  </div>
                )}

                <div className="mb-3">
                  <ScryfallPriceCompact scryfallId={card.id} />
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCollection(card);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar à Coleção
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && !loading && (searchTerm || hasActiveFilters) && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma carta encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou usar outros termos de busca.
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[5/7] bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        type={modalState.type}
      >
        <p className="text-gray-700 dark:text-gray-300">{modalState.message}</p>
      </Modal>

      {/* Card Detail Modal */}
      <CardDetailModal
        isOpen={cardDetailModal.isOpen}
        onClose={() => setCardDetailModal({ isOpen: false, cardId: null })}
        cardId={cardDetailModal.cardId}
      />
    </div>
  );
}
