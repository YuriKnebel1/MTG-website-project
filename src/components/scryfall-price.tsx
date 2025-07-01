import { useState, useEffect } from 'react';
import { DollarSign, Banknote, Info } from 'lucide-react';

interface ScryfallPriceProps {
  cardName?: string;
  scryfallId?: string;
  showEstimateInfo?: boolean;
}

interface PriceData {
  card: {
    id: string;
    name: string;
    set: string;
    rarity: string;
    image?: string;
  };
  prices: {
    usd: number | null;
    eur: number | null;
    brl: number | null;
    brl_estimated: boolean;
    source: string;
    last_updated: string;
    conversion_info?: {
      usd_to_brl_rate: number;
      store_margin: number;
    };
  };
}

export function ScryfallPrice({ cardName, scryfallId, showEstimateInfo = false }: ScryfallPriceProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!cardName && !scryfallId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (scryfallId) {
          params.set('id', scryfallId);
        } else if (cardName) {
          params.set('name', cardName);
        }
        
        const response = await fetch(`/api/prices/scryfall?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          setPriceData(data);
        } else {
          throw new Error('Erro ao buscar preços');
        }
      } catch (error) {
        console.error('Erro ao buscar preços:', error);
        setError('Erro ao carregar preços');
        setPriceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [cardName, scryfallId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
        <DollarSign className="h-3 w-3 animate-spin" />
        Carregando preços...
      </div>
    );
  }

  if (error || !priceData) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
        <DollarSign className="h-3 w-3" />
        Preços indisponíveis
      </div>
    );
  }

  const { prices } = priceData;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        {/* Preço USD */}
        {prices.usd && (
          <div className="flex items-center text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
            <DollarSign className="h-3 w-3 mr-1" />
            ${prices.usd.toFixed(2)} USD
          </div>
        )}

        {/* Preço BRL */}
        {prices.brl && (
          <div className="flex items-center text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
            <Banknote className="h-3 w-3 mr-1" />
            R$ {prices.brl.toFixed(2)}
            {prices.brl_estimated && (
              <span className="ml-1 text-xs opacity-75">*</span>
            )}
          </div>
        )}

        {/* Preço EUR (se disponível) */}
        {prices.eur && (
          <div className="flex items-center text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded">
            <DollarSign className="h-3 w-3 mr-1" />
            €{prices.eur.toFixed(2)} EUR
          </div>
        )}
      </div>

      {/* Informação sobre estimativa BRL */}
      {showEstimateInfo && prices.brl_estimated && prices.conversion_info && (
        <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded text-left">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            * Preço BRL estimado com base no USD (taxa ~{prices.conversion_info.usd_to_brl_rate}x + margem {((prices.conversion_info.store_margin - 1) * 100).toFixed(0)}%)
          </span>
        </div>
      )}

      {/* Timestamp */}
      {showEstimateInfo && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Atualizado: {new Date(prices.last_updated).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  );
}

// Componente compacto para uso em listas
export function ScryfallPriceCompact({ cardName, scryfallId }: ScryfallPriceProps) {
  return (
    <ScryfallPrice 
      cardName={cardName} 
      scryfallId={scryfallId} 
      showEstimateInfo={false} 
    />
  );
}

// Componente detalhado para uso em modais/páginas de detalhes
export function ScryfallPriceDetailed({ cardName, scryfallId }: ScryfallPriceProps) {
  return (
    <ScryfallPrice 
      cardName={cardName} 
      scryfallId={scryfallId} 
      showEstimateInfo={true} 
    />
  );
}
