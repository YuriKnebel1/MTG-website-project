// Script de teste para verificar se a API do Scryfall está funcionando
async function testScryfallSearch() {
  try {
    console.log("Testando busca no Scryfall...");
    const response = await fetch(
      "https://api.scryfall.com/cards/search?q=lightning+bolt&order=name"
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Busca funcionando!");
    console.log(`📦 ${data.total_cards} cartas encontradas`);
    console.log("🔍 Primeira carta:", data.data[0]?.name);

    return data;
  } catch (error) {
    console.error("❌ Erro na busca:", error);
    return null;
  }
}

async function testAutoComplete() {
  try {
    console.log("Testando autocomplete...");
    const response = await fetch(
      "https://api.scryfall.com/cards/autocomplete?q=light"
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Autocomplete funcionando!");
    console.log("💡 Sugestões:", data.data.slice(0, 5));

    return data;
  } catch (error) {
    console.error("❌ Erro no autocomplete:", error);
    return null;
  }
}

// Executar testes
console.log("🧪 Iniciando testes da API Scryfall...");
testScryfallSearch()
  .then(() => {
    return testAutoComplete();
  })
  .then(() => {
    console.log("🎉 Testes concluídos!");
  });
