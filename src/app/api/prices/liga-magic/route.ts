import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardName = searchParams.get('name');
  
  if (!cardName) {
    return NextResponse.json(
      { error: 'Nome da carta é obrigatório' },
      { status: 400 }
    );
  }

  try {
    console.log(`🇧🇷 Buscando preço Liga Magic para: ${cardName}`);

    // Como Liga Magic não tem API pública, vamos simular preços realísticos
    // baseados em dados históricos e conversão de preços USD
    
    // Primeiro, tentar buscar preço USD do Scryfall para conversão
    let usdPrice = null;
    try {
      const scryfallResponse = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardName)}&unique=cards&order=released&dir=desc`, {
        headers: {
          'User-Agent': 'MTG-Manager/1.0',
        },
      });

      if (scryfallResponse.ok) {
        const scryfallData = await scryfallResponse.json();
        if (scryfallData.data && scryfallData.data.length > 0) {
          const firstCard = scryfallData.data[0];
          usdPrice = firstCard.prices?.usd ? parseFloat(firstCard.prices.usd) : null;
        }
      }
    } catch (error) {
      console.log('Erro ao buscar preço USD:', error);
    }

    // Simular preço BRL baseado no USD (se disponível) ou dados mock
    let brlPrice = null;
    
    if (usdPrice && usdPrice > 0) {
      // Conversão USD para BRL com taxa de ~5.0 + margem de 20-40%
      const conversionRate = 5.2; // Taxa BRL/USD
      const margin = 1.3; // Margem de 30%
      brlPrice = parseFloat((usdPrice * conversionRate * margin).toFixed(2));
      console.log(`💰 Preço calculado: USD $${usdPrice} → BRL R$ ${brlPrice}`);
    } else {
      // Preços mock baseados em raridade estimada
      const mockPrices = generateMockPrice(cardName);
      brlPrice = mockPrices.brl;
      console.log(`🎲 Preço mock para ${cardName}: R$ ${brlPrice}`);
    }

    const response = {
      prices: {
        brl: brlPrice,
        source: 'liga-magic-simulation',
        last_updated: new Date().toISOString(),
        based_on_usd: usdPrice
      }
    };

    console.log(`✅ Retornando preço Liga Magic: R$ ${brlPrice}`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar preços Liga Magic:', error);
    
    // Fallback para preços mock
    const mockPrice = generateMockPrice(cardName || 'Unknown');
    return NextResponse.json({
      prices: {
        brl: mockPrice.brl,
        source: 'mock-fallback'
      }
    });
  }
}

// Função para gerar preços mock realísticos
function generateMockPrice(cardName: string) {
  const cardNameLower = cardName.toLowerCase();
  
  // Preços baseados em padrões conhecidos
  if (cardNameLower.includes('lightning bolt') || cardNameLower.includes('bolt')) {
    return { brl: 2.50 };
  }
  
  if (cardNameLower.includes('teferi') || cardNameLower.includes('jace') || cardNameLower.includes('liliana')) {
    return { brl: Math.round((Math.random() * 100 + 50) * 100) / 100 }; // R$ 50-150
  }
  
  if (cardNameLower.includes('fetch') || cardNameLower.includes('shock')) {
    return { brl: Math.round((Math.random() * 40 + 20) * 100) / 100 }; // R$ 20-60
  }
  
  if (cardNameLower.includes('basic') || cardNameLower.includes('plains') || 
      cardNameLower.includes('island') || cardNameLower.includes('swamp') ||
      cardNameLower.includes('mountain') || cardNameLower.includes('forest')) {
    return { brl: 0.50 };
  }
  
  // Preço padrão baseado em hash do nome
  const hash = cardName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const basePrice = (hash % 50) + 1; // R$ 1-50
  
  return { brl: Math.round(basePrice * 100) / 100 };
}
