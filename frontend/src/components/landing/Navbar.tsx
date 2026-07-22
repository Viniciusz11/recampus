import { Menu, Recycle, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Categorias', href: '#categorias' },
  { label: 'Anúncios', href: '/anuncios' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <Recycle className="h-6 w-6 text-primary" aria-hidden="true" />
          ReCampus
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <Button size="sm" onClick={() => navigate('/app')}>
              Ir para o app
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button size="sm" onClick={() => navigate('/cadastro')}>
                Anunciar item
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-3 px-3">
            <ThemeToggle />
            {user ? (
              <Button size="sm" className="flex-1" onClick={() => navigate('/app')}>
                Ir para o app
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate('/cadastro')}>
                  Anunciar
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
