import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Utensils, Droplet, Flame } from "lucide-react";

export default function Nutrition() {
  const macros = [
    { label: 'Protein', current: 120, target: 160, color: 'bg-blue-500' },
    { label: 'Carbs', current: 180, target: 250, color: 'bg-orange-500' },
    { label: 'Fats', current: 55, target: 70, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Nutrition</h1>
          <p className="text-sm sm:text-base text-slate-500">Track your daily intake and macros.</p>
        </div>
        <Button variant="outline" className="gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Plus className="w-4 h-4" /> Add Food
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Summary</CardTitle>
            <CardDescription>Calories and Macronutrients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8 py-4">
              {/* Circular Progress */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center rounded-[24px] sm:rounded-[32px] bg-[#09090b] border-[8px] sm:border-[12px] border-white/5 shrink-0 mx-auto md:mx-0">
                <div 
                  className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border-[8px] sm:border-[12px] border-neon"
                  style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 60%, 50% 50%)' }}
                />
                <div className="text-center z-10 flex flex-col items-center">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-neon mb-1 opacity-80" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">2,140</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 flex flex-col items-center uppercase tracking-widest font-bold">
                    <span>kcal today</span>
                  </span>
                </div>
              </div>

              {/* Macros Breakdown */}
              <div className="flex-1 w-full space-y-6">
                {macros.map(macro => (
                  <div key={macro.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-300">{macro.label}</span>
                      <span className="text-white font-mono">{macro.current}g <span className="text-slate-500">/ {macro.target}g</span></span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${macro.color} rounded-full`}
                        style={{ width: `${(macro.current / macro.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Intake */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 pt-1">
              <Droplet className="w-5 h-5 text-blue-400" /> Water Intake
            </CardTitle>
            <CardDescription>Daily hydration goal</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-4xl font-bold mt-2 mb-1 text-white">1.5<span className="text-xl text-slate-500 ml-1">L</span></p>
            <p className="text-sm text-slate-400 mb-6 font-medium">of 3.0 L target</p>
            
            <div className="flex gap-2 w-full justify-center">
              {[1, 2, 3, 4, 5, 6].map((glass, i) => (
                <div 
                  key={glass} 
                  className={`w-10 h-10 rounded-sm border-2 transition-all cursor-pointer hover:border-blue-300 ${i < 3 ? 'bg-blue-500/20 border-blue-400' : 'border-white/10 bg-white/5'}`}
                  title="250ml glass"
                />
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              <Plus className="w-4 h-4 mr-2" /> Add 250ml
            </Button>
          </CardContent>
        </Card>

        {/* Meals Log */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Meals Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, i) => (
                <div key={meal} className="bg-white/5 border border-white/10 rounded-[20px] p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-slate-500" /> {meal}
                    </h4>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {i === 0 ? '450' : i === 1 ? '750' : '0'} kcal
                    </span>
                  </div>
                  
                  {i < 2 ? (
                    <ul className="space-y-3 text-sm text-slate-400 font-medium">
                      {i === 0 && (
                        <>
                          <li className="flex justify-between"><span>Oatmeal</span><span className="font-mono">250 kcal</span></li>
                          <li className="flex justify-between"><span>Protein Shake</span><span className="font-mono">120 kcal</span></li>
                          <li className="flex justify-between"><span>Banana</span><span className="font-mono">80 kcal</span></li>
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <li className="flex justify-between"><span>Chicken Breast</span><span className="font-mono">350 kcal</span></li>
                          <li className="flex justify-between"><span>Rice (1 cup)</span><span className="font-mono">200 kcal</span></li>
                          <li className="flex justify-between"><span>Broccoli</span><span className="font-mono">50 kcal</span></li>
                        </>
                      )}
                    </ul>
                  ) : (
                    <button className="w-full text-slate-400 border border-dashed border-white/20 mt-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors">
                      <Plus className="w-4 h-4 mr-1 inline" /> Add Items
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
