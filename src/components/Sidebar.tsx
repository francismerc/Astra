import { Home, Dumbbell, Apple, LineChart } from 'lucide-react';
import { Page } from './Layout';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'split-workout' as Page, label: 'Split Workout', icon: Dumbbell },
    { id: 'nutrition' as Page, label: 'Nutrition', icon: Apple },
    { id: 'progress' as Page, label: 'Progress', icon: LineChart },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-screen bg-[#0c0c0e] border-r border-white/5 p-6 z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-900 to-orange-700 flex items-center justify-center shadow-[0_0_15px_rgba(127,29,29,0.5)]">
            <Dumbbell className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ASTRA</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium relative group",
                currentPage === item.id 
                  ? "bg-white/5 text-neon border-white/10" 
                  : "border-transparent text-slate-400 hover:text-white transition-colors"
              )}
            >
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto p-4 bg-gradient-to-br from-neon/10 to-transparent rounded-2xl border border-neon/20 text-left">
          <p className="text-xs font-semibold text-neon uppercase tracking-wider mb-2">Weekly Goal</p>
          <p className="text-sm text-white mb-3 font-medium">You're 2 sessions away from your goal!</p>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-900 to-orange-700 h-full w-[60%]"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0c0c0e]/90 backdrop-blur-xl border-t border-white/5 z-50 px-2 sm:px-6 pb-2 sm:pb-0 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="flex flex-col items-center justify-center w-16 h-16 relative"
          >
            {currentPage === item.id && (
              <motion.div 
                layoutId="active-nav-mobile"
                className="absolute inset-x-2 -top-1 h-1 bg-gradient-to-r from-red-900 to-orange-700 rounded-full shadow-[0_0_10px_rgba(127,29,29,0.8)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={cn(
              "w-6 h-6 mb-1 transition-colors", 
              currentPage === item.id ? "text-neon" : "text-slate-500"
            )} />
            <span className={cn(
              "text-[10px] font-medium transition-colors",
              currentPage === item.id ? "text-white" : "text-slate-500"
            )}>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
