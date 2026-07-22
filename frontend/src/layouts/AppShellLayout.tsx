import { Home, Package, Plus, Recycle, User, type LucideIcon } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end: boolean;
}

// Tupla (não NavItem[]) para indexar NAV_ITEMS[0]/[1]/[2] abaixo sem que o
// noUncheckedIndexedAccess trate cada acesso como possivelmente undefined.
const NAV_ITEMS: readonly [NavItem, NavItem, NavItem] = [
  { to: '/app', label: 'Início', icon: Home, end: true },
  { to: '/app/meus-anuncios', label: 'Meus anúncios', icon: Package, end: false },
  { to: '/app/perfil', label: 'Perfil', icon: User, end: false },
];

/**
 * Shell único e responsivo: no desktop se comporta como um dashboard normal
 * (nav horizontal no header); abaixo do breakpoint md, vira bottom
 * navigation + FAB - a experiência de "app instalado" pedida no edital,
 * sem duplicar telas entre mobile e desktop.
 */
export function AppShellLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/app" className="flex items-center gap-2 font-bold text-foreground">
            <Recycle className="h-6 w-6 text-primary" aria-hidden="true" />
            ReCampus
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <DesktopNavLink key={item.to} {...item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="hidden md:flex" onClick={() => navigate('/app/anuncios/novo')}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Anunciar
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Outlet />
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur-sm md:hidden"
        aria-label="Navegação principal"
      >
        <BottomNavLink {...NAV_ITEMS[0]} />

        <button
          type="button"
          onClick={() => navigate('/app/anuncios/novo')}
          aria-label="Criar anúncio"
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </button>

        <BottomNavLink {...NAV_ITEMS[1]} />
        <BottomNavLink {...NAV_ITEMS[2]} />
      </nav>
    </div>
  );
}

function DesktopNavLink({ to, label, icon: Icon, end }: NavItem) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
        )
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

function BottomNavLink({ to, label, icon: Icon, end }: NavItem) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium',
          isActive ? 'text-primary' : 'text-muted-foreground',
        )
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </NavLink>
  );
}
