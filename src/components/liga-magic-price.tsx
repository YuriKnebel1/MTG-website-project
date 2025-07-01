import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface LigaMagicPriceProps {
  cardName: string;
}

export function LigaMagicPrice({ cardName }: LigaMagicPriceProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLigaMagicPrice = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/prices/liga-magic?name=${encodeURIComponent(cardName)}`);
        if (response.ok) {
          const data = await response.json();
          setPrice(data.prices?.brl || null);
        }
      } catch (error) {
        console.error('Erro ao buscar preço Liga Magic:', error);
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLigaMagicPrice();
  }, [cardName]);

  if (loading) {
    return (
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
        <DollarSign className="h-3 w-3 mr-1" />
        Carregando...
      </div>
    );
  }

  if (price) {
    return (
      <div className="flex items-center text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">
        <DollarSign className="h-3 w-3 mr-1" />
        R$ {price.toFixed(2)}
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
      <DollarSign className="h-3 w-3 mr-1" />
      BRL indisponível
    </div>
  );
}
