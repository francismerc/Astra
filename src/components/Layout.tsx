import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Nutrition from '@/pages/Nutrition';
import Progress from '@/pages/Progress';
import SplitWorkout from '@/pages/SplitWorkout';

export type Page = 'dashboard' | 'split-workout' | 'nutrition' | 'progress';

export default function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'split-workout': return <SplitWorkout />;
      case 'nutrition': return <Nutrition />;
      case 'progress': return <Progress />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-[#09090b] min-h-screen text-slate-200 font-sans selection:bg-neon/30">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
