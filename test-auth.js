/**
 * Script de teste para verificar se a autenticação está funcionando
 * Execute: node test-auth.js
 */

const testAuth = async () => {
  try {
    console.log("🧪 Testando sistema de autenticação...\n");

    // 1. Testar endpoint de saúde
    console.log("1. Testando endpoint de saúde...");
    const healthResponse = await fetch("http://localhost:3000/api/health");
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData.status);
    console.log("👤 Usuário de teste:", healthData.credentials);
    console.log("");

    // 2. Testar registro de novo usuário
    console.log("2. Testando registro de novo usuário...");
    const randomEmail = `teste${Date.now()}@exemplo.com`;
    const registerResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Usuário Teste",
          email: randomEmail,
          password: "123456",
        }),
      }
    );

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log("✅ Usuário criado:", registerData.user.email);
    } else {
      const errorData = await registerResponse.json();
      console.log("❌ Erro no registro:", errorData.error);
    }
    console.log("");

    // 3. Testar se as páginas protegidas estão realmente protegidas
    console.log("3. Testando proteção de rotas...");
    const dashboardResponse = await fetch("http://localhost:3000/dashboard");
    if (
      dashboardResponse.status === 401 ||
      dashboardResponse.url.includes("/login")
    ) {
      console.log("✅ Dashboard protegido - redirecionando para login");
    } else {
      console.log("❌ Dashboard deveria estar protegido");
    }

    console.log("\n🎉 Testes concluídos!");
    console.log("\n📋 Para testar manualmente:");
    console.log("1. Acesse http://localhost:3000");
    console.log("2. Use as credenciais: admin@teste.com / 123456");
    console.log("3. Ou registre uma nova conta");
  } catch (error) {
    console.error("❌ Erro nos testes:", error.message);
  }
};

// Executar se o servidor estiver rodando
fetch("http://localhost:3000/api/health")
  .then(() => testAuth())
  .catch(() => {
    console.log("❌ Servidor não está rodando.");
    console.log("💡 Execute: npm run dev");
  });
