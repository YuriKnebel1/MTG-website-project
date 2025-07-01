import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { userCardId, quantity } = await request.json();

    if (!userCardId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Verificar se o userCard pertence ao usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userCard = await prisma.userCard.findFirst({
      where: {
        id: userCardId,
        userId: user.id,
      }
    });

    if (!userCard) {
      return NextResponse.json(
        { error: 'Carta não encontrada na coleção' },
        { status: 404 }
      );
    }

    // Atualizar quantidade
    const updatedUserCard = await prisma.userCard.update({
      where: { id: userCardId },
      data: { quantity },
      include: { card: true }
    });

    return NextResponse.json({
      message: 'Quantidade atualizada com sucesso',
      userCard: updatedUserCard,
    });

  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
