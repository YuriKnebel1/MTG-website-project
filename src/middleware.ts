import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log('Middleware executado para:', req.nextUrl.pathname);
    console.log('Token existe:', !!req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Rotas que precisam de autenticação
        const protectedPaths = [
          '/dashboard',
          '/collection', 
          '/decks',
          '/cards/search'
        ];
        
        // Se a rota está protegida, verificar se há token
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          console.log(`Rota protegida acessada: ${pathname}, Token presente: ${!!token}`);
          return !!token;
        }
        
        // Para rotas públicas, sempre permitir
        return true;
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/collection/:path*',
    '/decks/:path*',
    '/meta/:path*',
    '/cards/:path*'
  ]
}
