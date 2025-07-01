import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardName = searchParams.get('name');
    const scryfallId = searchParams.get('id');
    
    if (!cardName && !scryfallId) {
      return NextResponse.json(
        { error: 'Nome da carta ou ID do Scryfall é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`💰 Buscando preços Scryfall para: ${cardName || scryfallId}`);

    let scryfallUrl = '';
    if (scryfallId) {
      scryfallUrl = `https://api.scryfall.com/cards/${scryfallId}`;
    } else {
      scryfallUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardName!)}&unique=cards&order=released&dir=desc`;
    }

    const scryfallResponse = await fetch(scryfallUrl, {
      headers: {
        'User-Agent': 'MTG-Manager/1.0',
      },
    });

    if (!scryfallResponse.ok) {
      throw new Error(`Scryfall API error: ${scryfallResponse.status}`);
    }

    const scryfallData = await scryfallResponse.json();
    let card = null;

    if (scryfallId) {
      card = scryfallData;
    } else if (scryfallData.data && scryfallData.data.length > 0) {
      card = scryfallData.data[0];
    }

    if (!card) {
      return NextResponse.json(
        { error: 'Carta não encontrada' },
        { status: 404 }
      );
    }

    const usdPrice = card.prices?.usd ? parseFloat(card.prices.usd) : null;
    const eurPrice = card.prices?.eur ? parseFloat(card.prices.eur) : null;
    
    // Conversão USD para BRL (taxa aproximada + margem de lojas brasileiras)
    const conversionRate = 5.5; // Taxa USD/BRL
    const storeMargin = 1.35; // Margem de 35% das lojas
    const brlPrice = usdPrice ? parseFloat((usdPrice * conversionRate * storeMargin).toFixed(2)) : null;

    const response = {
      card: {
        id: card.id,
        name: card.name,
        set: card.set_name,
        rarity: card.rarity,
        image: card.image_uris?.normal || card.image_uris?.large
      },
      prices: {
        usd: usdPrice,
        eur: eurPrice,
        brl: brlPrice,
        brl_estimated: !!brlPrice, // Indica que o BRL é estimado
        source: 'scryfall',
        last_updated: new Date().toISOString(),
        conversion_info: {
          usd_to_brl_rate: conversionRate,
          store_margin: storeMargin
        }
      }
    };

    console.log(`✅ Preços encontrados - USD: $${usdPrice}, BRL: R$${brlPrice}`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar preços Scryfall:', error);
    
    return NextResponse.json(
      { error: 'Erro ao buscar preços' },
      { status: 500 }
    );
  }
}

// Endpoint para buscar preços de múltiplas cartas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards } = body; // Array de { name, id }
    
    if (!cards || !Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Array de cartas é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`💰 Buscando preços para ${cards.length} cartas`);

    const promises = cards.map(async (card: { name?: string; id?: string }) => {
      try {
        const url = new URL('/api/prices/scryfall', request.url);
        if (card.id) {
          url.searchParams.set('id', card.id);
        } else if (card.name) {
          url.searchParams.set('name', card.name);
        }
        
        const response = await fetch(url.toString());
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        console.error(`Erro ao buscar preço para carta:`, card, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter(result => result !== null);

    return NextResponse.json({
      prices: validResults,
      total_requested: cards.length,
      total_found: validResults.length
    });

  } catch (error) {
    console.error('Erro ao buscar preços múltiplos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar preços' },
      { status: 500 }
    );
  }
}
