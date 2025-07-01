import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface UserCardWithCard {
  id: string;
  quantity: number;
  card: {
    name: string;
  };
}

export async function GET() {
  try {
    console.log('🔍 Buscando coleção do usuário...');
    const session = await getServerSession(authOptions);
    console.log('👤 Sessão:', session?.user?.email || 'Não logado');

    if (!session?.user?.email) {
      console.log('❌ Usuário não autorizado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cards: {
          include: {
            card: true,
          },
          orderBy: {
            card: {
              name: 'asc',
            }
          }
        }
      }
    });

    console.log('📊 Cartas encontradas:', user?.cards?.length || 0);
    console.log('📝 Dados das cartas:', user?.cards?.map((uc: UserCardWithCard) => ({
      id: uc.id,
      quantity: uc.quantity,
      cardName: uc.card.name
    })));

    return NextResponse.json({
      userCards: user?.cards || [],
    });

  } catch (error) {
    console.error('❌ Erro ao buscar coleção:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
