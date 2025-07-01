import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        decks: {
          include: {
            _count: {
              select: {
                cards: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        }
      }
    });

    return NextResponse.json({
      decks: user?.decks || [],
    });

  } catch (error) {
    console.error('Erro ao buscar decks:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, format } = body;

    // Validações
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Nome do deck é obrigatório' },
        { status: 400 }
      );
    }

    if (!format) {
      return NextResponse.json(
        { error: 'Formato do deck é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Criar o deck
    const deck = await prisma.deck.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        format,
        userId: user.id,
      }
    });

    return NextResponse.json({
      message: 'Deck criado com sucesso',
      deck: {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        format: deck.format,
        createdAt: deck.createdAt,
      }
    });

  } catch (error) {
    console.error('Erro ao criar deck:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
