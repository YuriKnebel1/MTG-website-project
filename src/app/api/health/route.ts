import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Teste de conexão com o banco
    const userCount = await prisma.user.count();
    
    // Tentar buscar ou criar usuário de teste
    let testUser = await prisma.user.findUnique({
      where: { email: 'admin@teste.com' }
    });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('123456', 12);
      testUser = await prisma.user.create({
        data: {
          name: 'Admin Teste',
          email: 'admin@teste.com',
          password: hashedPassword,
        }
      });
    }

    return NextResponse.json({
      status: 'OK',
      database: 'Conectado',
      userCount,
      testUser: {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      },
      credentials: {
        email: 'admin@teste.com',
        password: '123456'
      }
    });

  } catch (error) {
    console.error('Erro no healthcheck:', error);
    return NextResponse.json(
      { 
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
