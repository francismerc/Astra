import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, Medal, ArrowUpRight, ArrowDownRight, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "motion/react";

const volumeData = [
  { month: 'Jan', volume: 15400 },
  { month: 'Feb', volume: 18200 },
  { month: 'Mar', volume: 22100 },
  { month: 'Apr', volume: 21500 },
  { month: 'May', volume: 25000 },
  { month: 'Jun', volume: 28400 },
  { month: 'Jul', volume: 32000 },
];

const prData = [
  { 
    id: 1,
    lift: 'Bench Press', 
    weight: '85 kg',
    reps: 5,
    increase: '+2.5 kg', 
    date: 'Oct 24, 2023',
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    history: [
      { date: 'Aug', weight: 75 },
      { date: 'Sep', weight: 80 },
      { date: 'Oct', weight: 82.5 },
      { date: 'Now', weight: 85 }
    ]
  },
  { 
    id: 2,
    lift: 'Squat', 
    weight: '120 kg',
    reps: 3,
    increase: '+5 kg', 
    date: 'Oct 15, 2023',
    color: 'text-purple-400', 
    bg: 'bg-purple-500/10',
    history: [
      { date: 'Aug', weight: 100 },
      { date: 'Sep', weight: 110 },
      { date: 'Oct', weight: 115 },
      { date: 'Now', weight: 120 }
    ]
  },
  { 
    id: 3,
    lift: 'Deadlift', 
    weight: '140 kg',
    reps: 1,
    increase: '+10 kg', 
    date: 'Sep 28, 2023',
    color: 'text-orange-400', 
    bg: 'bg-orange-500/10',
    history: [
      { date: 'Jul', weight: 120 },
      { date: 'Aug', weight: 125 },
      { date: 'Sep', weight: 130 },
      { date: 'Now', weight: 140 }
    ]
  },
  { 
    id: 4,
    lift: 'Overhead Press', 
    weight: '55 kg',
    reps: 5,
    increase: '+2.5 kg', 
    date: 'Oct 28, 2023',
    color: 'text-sky-400', 
    bg: 'bg-sky-500/10',
    history: [
      { date: 'Aug', weight: 45 },
      { date: 'Sep', weight: 50 },
      { date: 'Oct', weight: 52.5 },
      { date: 'Now', weight: 55 }
    ]
  },
];

export default function Progress() {
  const [expandedIds, setExpandedIds] = useState<number[]>(prData.map(pr => pr.id));

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(expandedId => expandedId !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Progress</h1>
          <p className="text-sm sm:text-base text-slate-500">Track your journey and celebrate wins.</p>
        </div>
        <Button variant="neon" className="gap-2 w-full sm:w-auto mt-2 sm:mt-0 font-bold tracking-wide">
          <Camera className="w-4 h-4" /> Add Photo
        </Button>
      </header>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume Lifted', value: '1.2M', unit: 'kg', subtitle: '+12% this month' },
          { label: 'Workouts Logged', value: '142', unit: 'sessions', subtitle: 'Consistent for 8 mos' },
          { label: 'PRs Achieved', value: '24', unit: 'records', subtitle: '4 in the last 30 days' },
          { label: 'Current Bodyweight', value: '74.5', unit: 'kg', subtitle: '-0.5kg from last week' }
        ].map((stat, i) => (
          <Card key={i} className="p-5 bg-gradient-to-br from-[#111113] to-[#0c0c0e] border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</span>
            <div className="mt-3 mb-1">
              <span className="text-3xl font-mono font-bold text-white tracking-tighter">{stat.value}</span>
              <span className="text-sm font-bold text-slate-400 ml-1">{stat.unit}</span>
            </div>
            <span className="text-xs text-neon font-medium">{stat.subtitle}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Volume Chart - Main Column */}
        <Card className="lg:col-span-8 overflow-hidden relative border-white/5 bg-[#111113]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10" />
          <CardHeader>
            <CardTitle>Training Volume Over Time</CardTitle>
            <CardDescription>Total weight lifted per month (Sets × Reps × Weight)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorVolumeActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#991b1b" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="url(#colorVolume)" 
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: 'url(#colorVolumeActive)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Personal Records - Sidebar Column */}
        <Card className="lg:col-span-4 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-400" /> Personal Records
            </h2>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {prData.map((pr) => {
              const isExpanded = expandedIds.includes(pr.id);
              
              return (
                <motion.div 
                  layout
                  key={pr.id} 
                  className="flex flex-col rounded-[20px] bg-[#111113] border border-white/5 overflow-hidden cursor-pointer hover:border-white/10 transition-all font-sans relative group"
                  onClick={() => toggleExpand(pr.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-4 sm:p-5 relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pr.bg} ${pr.color} border border-white/5 shadow-inner`}>
                          <Medal className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-base sm:text-lg text-white tracking-tight">{pr.lift}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-xl sm:text-2xl text-white font-mono leading-none tracking-tighter">{pr.weight}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-slate-500 font-medium uppercase tracking-widest">{pr.date}</span>
                      <span className="text-green-400 flex items-center font-bold uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-1" strokeWidth={3} /> {pr.increase}
                      </span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-4 pb-4 pt-4 border-t border-white/5 bg-[#09090b]/50 relative z-10"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">Achieved</span>
                            <span className="text-base font-bold text-white mt-0.5">{pr.reps} Reps</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">History</span>
                            <span className="text-base font-bold text-white mt-0.5">{pr.history.length} Entries</span>
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-slate-500 mb-4 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span>Trend</span>
                          <span className="h-px flex-1 bg-white/5"></span>
                        </p>
                        <div className="h-32 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pr.history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id={`grad-${pr.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4}/>
                                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis 
                                dataKey="date" 
                                stroke="#64748b" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                dy={5}
                              />
                              <YAxis 
                                stroke="#64748b" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 5', 'dataMax + 5']}
                                tickFormatter={(val) => `${val}k`}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#f8fafc', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke={pr.color.replace('text-', '').replace('-400', '') === 'blue' ? '#3b82f6' : pr.color.replace('text-', '').replace('-400', '') === 'purple' ? '#a855f7' : pr.color.replace('text-', '').replace('-400', '') === 'orange' ? '#f97316' : '#38bdf8'} 
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#09090b', stroke: pr.color.replace('text-', '').replace('-400', '') === 'blue' ? '#3b82f6' : pr.color.replace('text-', '').replace('-400', '') === 'purple' ? '#a855f7' : pr.color.replace('text-', '').replace('-400', '') === 'orange' ? '#f97316' : '#38bdf8', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#fff', stroke: '#09090b', strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="w-full text-center py-2 opacity-50 hover:opacity-100 group transition-colors relative z-10 border-t border-white/5 bg-white/[0.01]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 mx-auto text-slate-400 group-hover:text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mx-auto text-slate-400 group-hover:text-white" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-[16px] text-xs font-bold uppercase tracking-widest text-slate-300 border border-white/5 transition-all">View All PRs</button>
        </Card>

        {/* Progress Photos Widget - Full Width Bottom */}
        <Card className="lg:col-span-12 overflow-hidden bg-transparent border-0 shadow-none mt-6">
          <div className="flex flex-row items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Before & After</h2>
              <p className="text-sm text-slate-500">Visual changes over time</p>
            </div>
            <Button variant="outline" className="text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold tracking-wider">Manage Gallery</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Day 1 (Jan)', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop' },
              { label: 'Month 3 (Mar)', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop' },
              { label: 'Month 6 (Jun)', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop' },
              { label: 'Upload Empty', empty: true },
            ].map((img, i) => (
              <div key={i} className="aspect-[3/4] relative rounded-[32px] overflow-hidden group bg-[#111113] flex items-center justify-center border border-white/5">
                {img.empty ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:text-white hover:bg-white/5 transition-colors absolute inset-0 w-full h-full">
                    <div className="w-16 h-16 rounded-full border border-dashed border-slate-500/50 flex items-center justify-center mb-3 group-hover:border-white transition-colors bg-white/[0.01]">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest mt-2">Add Photo</span>
                  </div>
                ) : (
                  <>
                    <img src={img.url} alt={`Progress ${i}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 grayscale hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                      <span className="text-sm font-bold text-white uppercase tracking-widest">{img.label}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
