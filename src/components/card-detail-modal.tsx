import { useState, useEffect } from 'react';
import { ScryfallPriceDetailed } from '@/components/scryfall-price';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Copy, Check, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string | null;
  onAddToCollection?: (cardData: ScryfallCard) => void;
}

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
    large?: string;
    small?: string;
  };
  set_name: string;
  rarity: string;
}

interface CardDetails {
  id: string;
  name: string;
  printed_name?: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  printed_type_line?: string;
  oracle_text?: string;
  printed_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  image_uris?: {
    normal: string;
    large: string;
    png: string;
  };
  prices?: {
    usd?: string;
    eur?: string;
  };
  set_name: string;
  set: string;
  rarity: string;
  artist?: string;
  flavor_text?: string;
  legalities?: Record<string, string>;
  rulings_uri?: string;
  scryfall_uri?: string;
  related_uris?: {
    gatherer?: string;
    tcgplayer_infinite_articles?: string;
    tcgplayer_infinite_decks?: string;
  };
}

interface UserCardCount {
  total_quantity: number;
  conditions: Array<{
    condition: string;
    foil: boolean;
    quantity: number;
    language: string;
  }>;
}

export function CardDetailModal({ isOpen, onClose, cardId, onAddToCollection }: CardDetailModalProps) {
  const { data: session } = useSession();
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [userCardCount, setUserCardCount] = useState<UserCardCount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!isOpen || !cardId) {
      setCardDetails(null);
      setUserCardCount(null);
      setTranslatedText('');
      setError(null);
      return;
    }

    const fetchCardDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar detalhes da carta
        const response = await fetch(`https://api.scryfall.com/cards/${cardId}`, {
          headers: {
            'User-Agent': 'MTG-Manager/1.0',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes da carta');
        }

        const data = await response.json();
        setCardDetails(data);

        // Buscar quantidade do usuário se estiver logado
        if (session?.user?.email) {
          try {
            const countResponse = await fetch(`/api/collection/count?cardId=${cardId}`);
            if (countResponse.ok) {
              const countData = await countResponse.json();
              setUserCardCount(countData);
            }
          } catch (error) {
            console.error('Erro ao buscar quantidade:', error);
          }
        }

        // Traduzir texto da carta se existir
        if (data.oracle_text) {
          translateCardText(data.oracle_text);
        }

      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        setError('Erro ao carregar detalhes da carta');
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [isOpen, cardId, session?.user?.email]);

  const formatManaSymbols = (manaCost: string) => {
    if (!manaCost) return '';
    
    // Substitui símbolos de mana por representação textual
    return manaCost
      .replace(/{([^}]+)}/g, '($1)')
      .replace(/([WUBRG])/g, '($1)');
  };

  const copyCardName = async () => {
    if (cardDetails) {
      try {
        await navigator.clipboard.writeText(cardDetails.name);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar:', error);
      }
    }
  };

  const handleAddToCollection = () => {
    if (cardDetails && onAddToCollection) {
      onAddToCollection({
        id: cardDetails.id,
        name: cardDetails.name,
        mana_cost: cardDetails.mana_cost,
        type_line: cardDetails.type_line,
        oracle_text: cardDetails.oracle_text,
        power: cardDetails.power,
        toughness: cardDetails.toughness,
        image_uris: cardDetails.image_uris,
        set_name: cardDetails.set_name,
        rarity: cardDetails.rarity,
      });
    }
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

  const translateCardText = async (text: string) => {
    if (!text) return;
    
    setTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translated_text);
      }
    } catch (error) {
      console.error('Erro ao traduzir:', error);
    } finally {
      setTranslating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalhes da Carta
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando detalhes...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={onClose} variant="outline">
                Fechar
              </Button>
            </div>
          )}

          {cardDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Imagem da carta */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={cardDetails.image_uris?.large || cardDetails.image_uris?.normal || '/placeholder-card.png'}
                    alt={cardDetails.name}
                    width={488}
                    height={680}
                    className="rounded-lg shadow-lg w-full h-auto"
                    priority
                  />
                </div>
                
                {/* Links externos */}
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {cardDetails.scryfall_uri && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(cardDetails.scryfall_uri, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Scryfall
                    </Button>
                  )}
                  {cardDetails.related_uris?.gatherer && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(cardDetails.related_uris?.gatherer, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Gatherer
                    </Button>
                  )}
                </div>
              </div>

              {/* Detalhes da carta */}
              <div className="space-y-4">
                {/* Nome e custo de mana */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {cardDetails.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyCardName}
                      className="h-6 w-6 p-0"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  
                  {cardDetails.mana_cost && (
                    <p className="text-lg font-mono text-blue-600 dark:text-blue-400">
                      {formatManaSymbols(cardDetails.mana_cost)} • CMC {cardDetails.cmc}
                    </p>
                  )}
                </div>

                {/* Tipo e raridade */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {cardDetails.type_line}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(cardDetails.rarity)}`}>
                    {cardDetails.rarity.charAt(0).toUpperCase() + cardDetails.rarity.slice(1)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {cardDetails.set_name} ({cardDetails.set.toUpperCase()})
                  </span>
                </div>

                {/* Poder/Resistência ou Lealdade */}
                {(cardDetails.power || cardDetails.toughness || cardDetails.loyalty) && (
                  <div className="flex gap-4">
                    {cardDetails.power && cardDetails.toughness && (
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {cardDetails.power}/{cardDetails.toughness}
                      </div>
                    )}
                    {cardDetails.loyalty && (
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        Lealdade: {cardDetails.loyalty}
                      </div>
                    )}
                  </div>
                )}

                <hr className="border-0 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Texto da carta */}
                {cardDetails.oracle_text && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Texto da Carta:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm leading-relaxed">
                      <div className="text-gray-700 dark:text-gray-300 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original (EN):</span>
                        {cardDetails.oracle_text.split('\n').map((line, index) => (
                          <p key={index} className="mb-1 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                      
                      {translating && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                          Traduzindo...
                        </div>
                      )}
                      
                      {translatedText && (
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tradução (PT-BR):</span>
                          <div className="text-gray-700 dark:text-gray-300">
                            {translatedText.split('\n').map((line, index) => (
                              <p key={index} className="mb-1 last:mb-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Texto de ambientação */}
                {cardDetails.flavor_text && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Texto de Ambientação:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm italic text-gray-600 dark:text-gray-400">
                      {cardDetails.flavor_text}
                    </div>
                  </div>
                )}

                {/* Artista */}
                {cardDetails.artist && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Artista:</strong> {cardDetails.artist}
                  </div>
                )}

                <hr className="border-0 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Quantidade na coleção do usuário */}
                {session?.user?.email && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Suas Cartas:
                    </h4>
                    {userCardCount ? (
                      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-green-700 dark:text-green-300">
                            {userCardCount.total_quantity} carta(s)
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            na sua coleção
                          </span>
                        </div>
                        {userCardCount.conditions.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {userCardCount.conditions.map((condition, index) => (
                              <div key={index} className="flex justify-between text-green-700 dark:text-green-300">
                                <span>
                                  {condition.condition}
                                  {condition.foil && ' (Foil)'}
                                  {condition.language !== 'pt' && ` (${condition.language.toUpperCase()})`}
                                </span>
                                <span className="font-medium">{condition.quantity}x</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Você ainda não possui esta carta na sua coleção
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <hr className="border-0 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Preços */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Preços:
                  </h4>
                  <ScryfallPriceDetailed scryfallId={cardDetails.id} />
                </div>

                <hr className="border-0 h-px bg-gray-200 dark:bg-gray-700" />

                {/* Ações */}
                <div className="flex gap-3">
                  {onAddToCollection && (
                    <Button onClick={handleAddToCollection} className="flex-1">
                      Adicionar à Coleção
                    </Button>
                  )}
                  <Button variant="outline" onClick={onClose}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
