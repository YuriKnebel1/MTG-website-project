import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    // Usando MyMemory Translator API (gratuita)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`,
      {
        headers: {
          'User-Agent': 'MTG-Manager/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro na API de tradução');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return NextResponse.json({
        translated_text: data.responseData.translatedText,
        original_text: text,
      });
    } else {
      throw new Error('Erro ao traduzir texto');
    }

  } catch (error) {
    console.error('Erro ao traduzir:', error);
    return NextResponse.json(
      { error: 'Erro ao traduzir texto' },
      { status: 500 }
    );
  }
}
