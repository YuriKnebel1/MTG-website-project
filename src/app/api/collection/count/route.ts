import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json(
        { error: 'ID da carta é obrigatório' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userCards = await prisma.userCard.findMany({
      where: {
        userId: user.id,
        cardId: cardId,
      },
    });

    const totalQuantity = userCards.reduce((sum, card) => sum + card.quantity, 0);

    const conditions = userCards.map(card => ({
      condition: card.condition,
      foil: card.foil,
      quantity: card.quantity,
      language: card.language,
    }));

    return NextResponse.json({
      total_quantity: totalQuantity,
      conditions: conditions,
    });

  } catch (error) {
    console.error('Erro ao buscar quantidade da carta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
