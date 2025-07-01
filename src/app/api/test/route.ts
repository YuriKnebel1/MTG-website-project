import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tentar criar um usuário de teste
    const testUser = {
      name: 'Teste Usuario',
      email: 'teste@email.com',
      password: 'teste123'
    };

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: testUser.email }
    });

    if (existing) {
      return NextResponse.json({
        message: 'Usuário de teste já existe',
        user: {
          id: existing.id,
          name: existing.name,
          email: existing.email
        }
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(testUser.password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      message: 'Usuário de teste criado com sucesso',
      user,
      testCredentials: {
        email: testUser.email,
        password: testUser.password
      }
    });

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário de teste' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Listar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      message: 'Lista de usuários',
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar usuários' },
      { status: 500 }
    );
  }
}
