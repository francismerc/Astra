import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flame, Activity, Weight, Target, ChevronRight, Play, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const BODY_NODES = [
  { id: 'head', x: 100, y: 30 },
  { id: 'neck', x: 100, y: 60 },
  { id: 'shoulderL', x: 60, y: 60 },
  { id: 'shoulderR', x: 140, y: 60 },
  { id: 'chest', x: 100, y: 95 },
  { id: 'core', x: 100, y: 140 },
  { id: 'pelvis', x: 100, y: 190 },
  { id: 'hipL', x: 75, y: 190 },
  { id: 'hipR', x: 125, y: 190 },
  { id: 'elbowL', x: 40, y: 110 },
  { id: 'elbowR', x: 160, y: 110 },
  { id: 'handL', x: 30, y: 170 },
  { id: 'handR', x: 170, y: 170 },
  { id: 'kneeL', x: 75, y: 270 },
  { id: 'kneeR', x: 125, y: 270 },
  { id: 'footL', x: 75, y: 360 },
  { id: 'footR', x: 125, y: 360 },
];

const BODY_LINKS = [
  ['head', 'neck'],
  ['neck', 'shoulderL'], ['neck', 'shoulderR'], ['neck', 'chest'],
  ['shoulderL', 'elbowL'], ['elbowL', 'handL'],
  ['shoulderR', 'elbowR'], ['elbowR', 'handR'],
  ['shoulderL', 'chest'], ['shoulderR', 'chest'],
  ['chest', 'core'], ['core', 'pelvis'],
  ['pelvis', 'hipL'], ['pelvis', 'hipR'],
  ['hipL', 'kneeL'], ['kneeL', 'footL'],
  ['hipR', 'kneeR'], ['kneeR', 'footR'],
  ['core', 'hipL'], ['core', 'hipR']
];

const MUSCLE_DATA = [
  { name: 'Chest & Shoulders', value: 85, color: 'bg-gradient-to-r from-red-900 to-orange-700', hex: '#7f1d1d', points: ['chest', 'shoulderL', 'shoulderR'], intensity: 'high' },
  { name: 'Core & Abs', value: 45, color: 'bg-orange-500', hex: '#f97316', points: ['core', 'pelvis'], intensity: 'low' },
  { name: 'Arms', value: 65, color: 'bg-purple-500', hex: '#a855f7', points: ['elbowL', 'elbowR', 'handL', 'handR'], intensity: 'medium' },
  { name: 'Legs', value: 30, color: 'bg-blue-500', hex: '#3b82f6', points: ['kneeL', 'kneeR', 'hipL', 'hipR', 'footL', 'footR'], intensity: 'low' }
];

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Welcome back, Alex</h1>
          <p className="text-sm sm:text-base text-slate-500">Let's crush your fitness goals today.</p>
        </div>
        <Button variant="neon" className="gap-2 w-full sm:w-auto">
          <Play fill="currentColor" className="w-4 h-4" /> Start Workout
        </Button>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {[ 
          { label: 'Current Weight', value: '74.5', unit: 'kg', diff: '-1.0 kg this week', icon: Weight, color: 'text-blue-400' },
          { label: 'Daily Calories', value: '2,140', unit: 'kcal', diff: 'Target: 2,400 kcal', icon: Activity, color: 'text-orange-400' },
          { label: 'Workout Streak', value: '5 Day', unit: 'Streak', diff: 'Intensity', icon: Flame, color: 'text-white', bg: 'bg-gradient-to-br from-red-900 to-orange-700 text-white' },
          { label: 'Goal Progress', value: '65', unit: '%', diff: 'Lose 5 kg total', icon: Target, color: 'text-neon' }
        ].map((stat, i) => (
          <Card key={i} className={cn("p-5 sm:p-6 min-h-[150px] sm:min-h-[170px] flex flex-col justify-between relative group scale-100 transition-transform active:scale-[0.98]", stat.bg)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <span className={cn("px-3 py-1.5 text-xs font-bold rounded-full border", stat.bg ? "bg-black/20 text-white border-black/20" : "bg-white/5 text-slate-300 border-white/10")}>{stat.label}</span>
              <stat.icon className={cn("w-5 h-5 opacity-80", stat.color)} />
            </div>
            <div className="mt-6 sm:mt-auto">
              <h2 className={cn("text-3xl lg:text-4xl font-bold mt-2 uppercase tracking-tight", stat.bg ? "text-white italic" : "text-white")}>{stat.value} <span className={cn("text-sm font-normal", stat.bg ? "text-white/80 not-italic" : "text-slate-500")}>{stat.unit}</span></h2>
              <p className={cn("text-xs mt-2 uppercase tracking-widest font-bold", stat.bg ? "text-white/70" : "text-slate-500")}>{stat.diff}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-4 flex flex-col p-4 sm:p-6">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">Muscular Fatigue</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-0.5 sm:mt-1">Body <span className="text-xs sm:text-sm font-normal text-slate-500">Breakdown</span></h2>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] sm:text-xs text-neon font-bold uppercase tracking-widest bg-neon/10 px-2 py-1 rounded-md">8 hrs to full recovery</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-8 items-center bg-transparent mt-2">
            {/* Wireframe Body Map */}
            <div className="w-full md:w-5/12 flex justify-center relative min-h-[250px] sm:min-h-[300px]">
              <svg viewBox="0 0 200 400" className="w-full h-full max-h-[300px] overflow-visible">
                {/* Links */}
                {BODY_LINKS.map(([start, end], i) => {
                  const s = BODY_NODES.find(n => n.id === start);
                  const e = BODY_NODES.find(n => n.id === end);
                  if (!s || !e) return null;
                  return <line key={i} x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />;
                })}
                
                {/* Heatmaps */}
                {MUSCLE_DATA.map((group) => 
                  group.points.map(ptId => {
                    const pt = BODY_NODES.find(n => n.id === ptId);
                    if (!pt) return null;
                    return (
                      <circle 
                        key={`${group.name}-${ptId}`} 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={group.intensity === 'high' ? 35 : group.intensity === 'medium' ? 25 : 15} 
                        fill={group.hex} 
                        className={cn("blur-xl", group.intensity === 'high' ? "opacity-60" : group.intensity === 'medium' ? "opacity-40" : "opacity-20")} 
                      />
                    );
                  })
                )}
                
                {/* Nodes */}
                {BODY_NODES.map(n => (
                  <circle key={n.id} cx={n.x} cy={n.y} r="3" fill="rgba(255,255,255,0.4)" />
                ))}
              </svg>
            </div>
            
            {/* Progress Bars */}
            <div className="w-full md:w-7/12 flex flex-col justify-center gap-6 pr-0 md:pr-4">
              {MUSCLE_DATA.map((muscle) => (
                <div key={muscle.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-200">{muscle.name}</span>
                    <span className="text-xs font-medium text-slate-400">{muscle.value}% Fatigue</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${muscle.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", muscle.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Workouts */}
        <Card className="flex flex-col p-4 sm:p-6 lg:col-span-2">
          <div className="mb-4 sm:mb-6">
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Recent Workouts</p>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 sm:mt-1">Latest Sessions</h3>
          </div>
          <div className="flex-1 space-y-3 sm:space-y-4">
              {[
                { name: 'Upper Body Power', date: 'Today', duration: '45m', type: 'Strength' },
                { name: 'HIIT Cardio', date: 'Yesterday', duration: '30m', type: 'Cardio' },
                { name: 'Leg Day', date: '2 days ago', duration: '60m', type: 'Strength' },
                { name: 'Active Recovery', date: '3 days ago', duration: '20m', type: 'Mobility' },
              ].map((workout, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex gap-2.5 sm:gap-3 items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-200 truncate">{workout.name}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0 pl-2">
                    <span className="text-[9px] sm:text-[10px] text-neon font-bold px-2 py-0.5 rounded-full bg-neon/10 uppercase tracking-widest">{workout.type}</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium">{workout.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300 border border-white/5 transition-all">
              View all history <ChevronRight className="w-3 h-3 ml-1 inline" />
            </button>
        </Card>
      </div>
    </div>
  );
}
