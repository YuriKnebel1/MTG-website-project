// Script para testar funcionalidades do site MGT
console.log("🧪 Iniciando testes das funcionalidades...");

// Teste 1: Verificar se todos os decks estão sendo mostrados
console.log("📋 Testando quantidade de decks...");
fetch("http://localhost:3001/meta")
  .then((response) => response.text())
  .then((html) => {
    const deckCount = (html.match(/deck\.id/g) || []).length;
    console.log(`✅ Total de decks encontrados: ${deckCount}`);
  })
  .catch((err) => console.error("❌ Erro ao testar decks:", err));

// Teste 2: Verificar API Scryfall
console.log("🔍 Testando API Scryfall...");
fetch("https://api.scryfall.com/cards/autocomplete?q=bolt")
  .then((response) => response.json())
  .then((data) => {
    console.log(
      `✅ API Scryfall funcionando! ${data.data.length} sugestões para "bolt"`
    );
  })
  .catch((err) => console.error("❌ Erro na API Scryfall:", err));

// Teste 3: Verificar se as páginas principais carregam
const pages = ["/meta", "/cards/search", "/collection", "/decks"];
pages.forEach((page) => {
  fetch(`http://localhost:3001${page}`)
    .then((response) => {
      if (response.ok) {
        console.log(`✅ Página ${page} carregando corretamente`);
      } else {
        console.log(`❌ Erro na página ${page}: ${response.status}`);
      }
    })
    .catch((err) => console.error(`❌ Erro ao acessar ${page}:`, err));
});

console.log("🏁 Testes iniciados! Verifique os resultados acima.");
