import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando processo de adicionar carta...');
    
    const session = await getServerSession(authOptions);
    console.log('📊 Sessão:', session?.user?.email ? 'Usuário logado' : 'Usuário não logado');

    if (!session?.user?.email) {
      console.log('❌ Usuário não autorizado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📝 Dados recebidos:', JSON.stringify(body, null, 2));
    
    const {
      scryfallId,
      name,
      type_line,
      manaCost,
      oracleText,
      power,
      toughness,
      imageUrl,
      setName,
      rarity,
      quantity = 1,
    } = body;

    if (!scryfallId || !name) {
      console.log('❌ Dados inválidos - scryfallId ou name ausentes');
      return NextResponse.json(
        { error: 'ID da carta e nome são obrigatórios' },
        { status: 400 }
      );
    }

    // Encontrar o usuário
    console.log('🔍 Buscando usuário...');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    console.log('✅ Usuário encontrado:', user.id);

    // Verificar se a carta já existe na base de dados (usando scryfallId como id)
    console.log('🔍 Verificando se carta existe...');
    let card = await prisma.card.findUnique({
      where: { id: scryfallId }
    });

    // Se não existe, criar a carta
    if (!card) {
      console.log('📝 Criando nova carta...');
      
      // Calcular CMC a partir do mana cost
      const calculateCMC = (manaCost: string): number => {
        if (!manaCost) return 0;
        // Remove símbolos e conta números
        const matches = manaCost.match(/\{(\d+|[WUBRG]|[XYZ])\}/g);
        if (!matches) return 0;
        
        return matches.reduce((total, match) => {
          const symbol = match.slice(1, -1);
          if (/^\d+$/.test(symbol)) {
            return total + parseInt(symbol);
          } else {
            return total + 1; // Cada símbolo colorido ou híbrido = 1
          }
        }, 0);
      };

      const cmc = calculateCMC(manaCost || '');
      
      card = await prisma.card.create({
        data: {
          id: scryfallId,
          name,
          manaCost: manaCost || '',
          cmc: cmc,
          type: type_line || '',
          rarity: rarity || 'common',
          set: setName || '',
          setName: setName || '',
          text: oracleText || '',
          power: power || null,
          toughness: toughness || null,
          imageUrl: imageUrl || null,
        }
      });
      console.log('✅ Carta criada:', card.id);
    } else {
      console.log('✅ Carta já existe:', card.id);
    }

    // Verificar se o usuário já tem esta carta na coleção
    console.log('🔍 Verificando se usuário já possui a carta...');
    const existingUserCard = await prisma.userCard.findFirst({
      where: {
        userId: user.id,
        cardId: card.id,
      }
    });

    if (existingUserCard) {
      // Se já tem, aumenta a quantidade
      console.log('📈 Atualizando quantidade da carta...');
      const updatedUserCard = await prisma.userCard.update({
        where: {
          id: existingUserCard.id
        },
        data: {
          quantity: existingUserCard.quantity + quantity,
        },
        include: {
          card: true,
        }
      });
      console.log('✅ Quantidade atualizada');

      return NextResponse.json({
        message: 'Quantidade da carta atualizada na coleção',
        userCard: updatedUserCard,
      });
    } else {
      // Se não tem, cria nova entrada
      console.log('➕ Criando nova entrada na coleção...');
      const newUserCard = await prisma.userCard.create({
        data: {
          userId: user.id,
          cardId: card.id,
          quantity,
        },
        include: {
          card: true,
        }
      });
      console.log('✅ Carta adicionada à coleção');

      return NextResponse.json({
        message: 'Carta adicionada à coleção',
        userCard: newUserCard,
      });
    }

  } catch (error) {
    console.error('Erro ao adicionar carta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
