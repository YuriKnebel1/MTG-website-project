import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'standard';
    
    console.log(`🎣 Buscando meta decks para formato: ${format}`);

    // MTGGoldfish não tem API pública oficial, então vamos usar dados mock realísticos
    // Em produção, você poderia usar web scraping ou APIs alternativas como MTGTop8
    
    const mockMetaDecks = {
      standard: [
        {
          id: 'std-1',
          name: 'Esper Midrange',
          format: 'Standard',
          winRate: 64.2,
          popularity: 18.7,
          averageCost: 420.50,
          colors: ['W', 'U', 'B'],
          description: 'Deck midrange versátil com remoção e card advantage.',
          keyCards: ['Teferi, Hero of Dominaria', 'Raffine, Scheming Seer', 'Void Rend'],
          decklist: generateStandardDecklist('esper-midrange'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'std-2',
          name: 'Mono-Red Aggro',
          format: 'Standard',
          winRate: 58.9,
          popularity: 22.1,
          averageCost: 180.75,
          colors: ['R'],
          description: 'Estratégia agressiva com criaturas rápidas e queimar.',
          keyCards: ['Monastery Swiftspear', 'Phoenix Chick', 'Lightning Strike'],
          decklist: generateStandardDecklist('mono-red-aggro'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'std-3',
          name: 'Golgari Midrange',
          format: 'Standard',
          winRate: 61.5,
          popularity: 15.3,
          averageCost: 350.20,
          colors: ['B', 'G'],
          description: 'Midrange com remoção e threats recursivos.',
          keyCards: ['Sheoldred, the Apocalypse', 'Liliana of the Veil', 'Gix, Yawgmoth Praetor'],
          decklist: generateStandardDecklist('golgari-midrange'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        }
      ],
      modern: [
        {
          id: 'mod-1',
          name: 'Izzet Murktide',
          format: 'Modern',
          winRate: 59.8,
          popularity: 16.4,
          averageCost: 890.30,
          colors: ['U', 'R'],
          description: 'Deck tempo com Murktide Regent e cantrips.',
          keyCards: ['Murktide Regent', 'Dragon\'s Rage Channeler', 'Expressive Iteration'],
          decklist: generateModernDecklist('izzet-murktide'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'mod-2',
          name: 'Hammer Time',
          format: 'Modern',
          winRate: 56.7,
          popularity: 12.8,
          averageCost: 650.85,
          colors: ['W'],
          description: 'Combo deck com Colossus Hammer e criaturas evasivas.',
          keyCards: ['Colossus Hammer', 'Sigarda\'s Aid', 'Puresteel Paladin'],
          decklist: generateModernDecklist('hammer-time'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        }
      ],
      pioneer: [
        {
          id: 'pio-1',
          name: 'Mono-Green Devotion',
          format: 'Pioneer',
          winRate: 62.3,
          popularity: 19.2,
          averageCost: 320.40,
          colors: ['G'],
          description: 'Ramp baseado em devoção com finalizadores poderosos.',
          keyCards: ['Nykthos, Shrine to Nyx', 'Karn, the Great Creator', 'Cavalier of Thorns'],
          decklist: generatePioneerDecklist('mono-green-devotion'),
          sideboard: generateSideboard(),
          source: 'mtggoldfish',
          lastUpdated: new Date().toISOString()
        }
      ]
    };

    const formatDecks = mockMetaDecks[format as keyof typeof mockMetaDecks] || [];
    
    console.log(`✅ Encontrados ${formatDecks.length} decks para ${format}`);
    
    return NextResponse.json({
      format,
      decks: formatDecks,
      totalDecks: formatDecks.length,
      source: 'mtggoldfish-mock',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar meta decks:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar meta decks' },
      { status: 500 }
    );
  }
}

// Funções auxiliares para gerar decklists realísticas
function generateStandardDecklist(archetype: string) {
  const decklists: Record<string, Array<{ name: string; quantity: number }>> = {
    'esper-midrange': [
      { name: 'Teferi, Hero of Dominaria', quantity: 3 },
      { name: 'Raffine, Scheming Seer', quantity: 4 },
      { name: 'Void Rend', quantity: 3 },
      { name: 'Farewell', quantity: 2 },
      { name: 'Memory Deluge', quantity: 3 },
      { name: 'Absorb', quantity: 3 },
      { name: 'Negate', quantity: 2 },
      { name: 'Bloodchief\'s Thirst', quantity: 3 },
      { name: 'Hallowed Fountain', quantity: 4 },
      { name: 'Watery Grave', quantity: 4 },
      { name: 'Godless Shrine', quantity: 4 },
      { name: 'Raffine\'s Tower', quantity: 4 },
      { name: 'Island', quantity: 4 },
      { name: 'Plains', quantity: 3 },
      { name: 'Swamp', quantity: 2 },
      { name: 'Obscura Interceptor', quantity: 3 },
      { name: 'Thirst for Discovery', quantity: 2 },
      { name: 'Otawara, Soaring City', quantity: 1 },
      { name: 'Eiganjo, Seat of the Empire', quantity: 1 },
      { name: 'Takenuma, Abandoned Mire', quantity: 1 }
    ],
    'mono-red-aggro': [
      { name: 'Monastery Swiftspear', quantity: 4 },
      { name: 'Phoenix Chick', quantity: 4 },
      { name: 'Kumano Faces Kakkazan', quantity: 4 },
      { name: 'Lightning Strike', quantity: 4 },
      { name: 'Play with Fire', quantity: 4 },
      { name: 'Sokenzan, Crucible of Defiance', quantity: 2 },
      { name: 'Mountain', quantity: 18 },
      { name: 'Fervent Champion', quantity: 4 },
      { name: 'Robber of the Rich', quantity: 3 },
      { name: 'Bonecrusher Giant', quantity: 4 },
      { name: 'Embercleave', quantity: 2 },
      { name: 'Roil Eruption', quantity: 3 },
      { name: 'Spikefield Hazard', quantity: 4 }
    ],
    'golgari-midrange': [
      { name: 'Sheoldred, the Apocalypse', quantity: 4 },
      { name: 'Liliana of the Veil', quantity: 3 },
      { name: 'Gix, Yawgmoth Praetor', quantity: 2 },
      { name: 'Fatal Push', quantity: 4 },
      { name: 'Thoughtseize', quantity: 3 },
      { name: 'Tear Asunder', quantity: 2 },
      { name: 'Overgrown Tomb', quantity: 4 },
      { name: 'Woodland Cemetery', quantity: 4 },
      { name: 'Swamp', quantity: 8 },
      { name: 'Forest', quantity: 6 },
      { name: 'Llanowar Wastes', quantity: 4 },
      { name: 'Boseiju, Who Endures', quantity: 2 },
      { name: 'Takenuma, Abandoned Mire', quantity: 1 },
      { name: 'Graveyard Trespasser', quantity: 3 },
      { name: 'Tenacious Underdog', quantity: 2 },
      { name: 'Invoke Despair', quantity: 2 },
      { name: 'Go Blank', quantity: 2 },
      { name: 'Duress', quantity: 2 },
      { name: 'Riveteers Charm', quantity: 2 }
    ]
  };

  return decklists[archetype] || [];
}

function generateModernDecklist(archetype: string) {
  const decklists: Record<string, Array<{ name: string; quantity: number }>> = {
    'izzet-murktide': [
      { name: 'Murktide Regent', quantity: 4 },
      { name: 'Dragon\'s Rage Channeler', quantity: 4 },
      { name: 'Expressive Iteration', quantity: 4 },
      { name: 'Lightning Bolt', quantity: 4 },
      { name: 'Counterspell', quantity: 2 },
      { name: 'Unholy Heat', quantity: 4 },
      { name: 'Consider', quantity: 4 },
      { name: 'Thought Scour', quantity: 4 },
      { name: 'Mishra\'s Bauble', quantity: 4 },
      { name: 'Scalding Tarn', quantity: 4 },
      { name: 'Steam Vents', quantity: 2 },
      { name: 'Spirebluff Canal', quantity: 4 },
      { name: 'Island', quantity: 4 },
      { name: 'Mountain', quantity: 2 },
      { name: 'Flooded Strand', quantity: 4 },
      { name: 'Ledger Shredder', quantity: 3 },
      { name: 'Dress Down', quantity: 2 },
      { name: 'Spell Pierce', quantity: 2 }
    ],
    'hammer-time': [
      { name: 'Colossus Hammer', quantity: 4 },
      { name: 'Sigarda\'s Aid', quantity: 4 },
      { name: 'Puresteel Paladin', quantity: 4 },
      { name: 'Ornithopter', quantity: 4 },
      { name: 'Esper Sentinel', quantity: 4 },
      { name: 'Steelshaper\'s Gift', quantity: 4 },
      { name: 'Springleaf Drum', quantity: 4 },
      { name: 'Mox Opal', quantity: 4 },
      { name: 'Plains', quantity: 12 },
      { name: 'Inkmoth Nexus', quantity: 4 },
      { name: 'Blinkmoth Nexus', quantity: 2 },
      { name: 'Shadowspear', quantity: 1 },
      { name: 'Nettlecyst', quantity: 1 },
      { name: 'Cranial Plating', quantity: 2 },
      { name: 'Blacksmith\'s Skill', quantity: 2 },
      { name: 'Giver of Runes', quantity: 4 }
    ]
  };

  return decklists[archetype] || [];
}

function generatePioneerDecklist(archetype: string) {
  const decklists: Record<string, Array<{ name: string; quantity: number }>> = {
    'mono-green-devotion': [
      { name: 'Nykthos, Shrine to Nyx', quantity: 4 },
      { name: 'Karn, the Great Creator', quantity: 4 },
      { name: 'Cavalier of Thorns', quantity: 3 },
      { name: 'Elvish Mystic', quantity: 4 },
      { name: 'Llanowar Elves', quantity: 4 },
      { name: 'Voracious Hydra', quantity: 2 },
      { name: 'Storm the Festival', quantity: 3 },
      { name: 'Castle Garenbrig', quantity: 2 },
      { name: 'Forest', quantity: 16 },
      { name: 'Old-Growth Troll', quantity: 4 },
      { name: 'Wolfwillow Haven', quantity: 3 },
      { name: 'Kiora, Behemoth Beckoner', quantity: 2 },
      { name: 'Ugin, the Spirit Dragon', quantity: 2 },
      { name: 'Goreclaw, Terror of Qal Sisma', quantity: 3 },
      { name: 'Boseiju, Who Endures', quantity: 4 }
    ]
  };

  return decklists[archetype] || [];
}

function generateSideboard() {
  const common_sideboard = [
    { name: 'Rest in Peace', quantity: 2 },
    { name: 'Mystical Dispute', quantity: 3 },
    { name: 'Negate', quantity: 2 },
    { name: 'Grafdigger\'s Cage', quantity: 2 },
    { name: 'Damping Sphere', quantity: 2 },
    { name: 'Brotherhood\'s End', quantity: 2 },
    { name: 'Duress', quantity: 2 }
  ];

  return common_sideboard;
}
