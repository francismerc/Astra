import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Check, Trash2, ArrowLeft, ChevronDown, ChevronRight, Search, Edit2, GripVertical, Settings2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { cn } from "@/lib/utils";

// --- Types & Mock Data ---
type WorkoutSet = { id: string; reps: string; weight: string; completed: boolean; };
type MuscleActivation = { name: string; percentage: number };
type WorkoutExercise = { id: string; name: string; sets: WorkoutSet[]; muscles: MuscleActivation[]; };
type SplitDay = { id: string; name: string; exercises: WorkoutExercise[]; isExpanded?: boolean; };
type SplitProgram = { id: string; name: string; days: SplitDay[]; };

const EXERCISE_DB = [
  // Chest
  { name: 'Barbell Bench Press', muscles: [{name: 'chest', percentage: 70}, {name: 'shoulders', percentage: 20}, {name: 'triceps', percentage: 10}] },
  { name: 'Incline Dumbbell Press', muscles: [{name: 'chest', percentage: 65}, {name: 'shoulders', percentage: 35}] },
  { name: 'Chest Press Machine', muscles: [{name: 'chest', percentage: 80}, {name: 'triceps', percentage: 20}] },
  { name: 'Cable Fly', muscles: [{name: 'chest', percentage: 100}] },
  { name: 'Push-up', muscles: [{name: 'chest', percentage: 60}, {name: 'triceps', percentage: 25}, {name: 'shoulders', percentage: 15}] },
  
  // Shoulders
  { name: 'Overhead Press', muscles: [{name: 'shoulders', percentage: 70}, {name: 'triceps', percentage: 30}] },
  { name: 'Dumbbell Shoulder Press', muscles: [{name: 'shoulders', percentage: 80}, {name: 'triceps', percentage: 20}] },
  { name: 'Lateral Raises', muscles: [{name: 'shoulders', percentage: 100}] },
  { name: 'Front Raises', muscles: [{name: 'shoulders', percentage: 100}] },
  { name: 'Face Pulls', muscles: [{name: 'shoulders', percentage: 60}, {name: 'back', percentage: 40}] },
  
  // Back
  { name: 'Deadlift', muscles: [{name: 'back', percentage: 50}, {name: 'legs', percentage: 50}] },
  { name: 'Pull-up', muscles: [{name: 'back', percentage: 70}, {name: 'biceps', percentage: 30}] },
  { name: 'Lat Pulldown', muscles: [{name: 'back', percentage: 80}, {name: 'biceps', percentage: 20}] },
  { name: 'Barbell Row', muscles: [{name: 'back', percentage: 80}, {name: 'biceps', percentage: 20}] },
  { name: 'Seated Cable Row', muscles: [{name: 'back', percentage: 90}, {name: 'biceps', percentage: 10}] },
  
  // Arms
  { name: 'Dumbbell Curl', muscles: [{name: 'biceps', percentage: 100}] },
  { name: 'Hammer Curl', muscles: [{name: 'biceps', percentage: 100}] },
  { name: 'Preacher Curl', muscles: [{name: 'biceps', percentage: 100}] },
  { name: 'Triceps Pushdown', muscles: [{name: 'triceps', percentage: 100}] },
  { name: 'Skull Crushers', muscles: [{name: 'triceps', percentage: 100}] },
  { name: 'Dips', muscles: [{name: 'triceps', percentage: 60}, {name: 'chest', percentage: 30}, {name: 'shoulders', percentage: 10}] },
  
  // Legs
  { name: 'Squat', muscles: [{name: 'legs', percentage: 70}, {name: 'core', percentage: 30}] },
  { name: 'Leg Press', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Romanian Deadlift', muscles: [{name: 'legs', percentage: 80}, {name: 'back', percentage: 20}] },
  { name: 'Leg Extension', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Leg Curl', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Calf Raises', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Lunges', muscles: [{name: 'legs', percentage: 90}, {name: 'core', percentage: 10}] },

  // Core
  { name: 'Plank', muscles: [{name: 'core', percentage: 100}] },
  { name: 'Crunch', muscles: [{name: 'core', percentage: 100}] },
  { name: 'Leg Raises', muscles: [{name: 'core', percentage: 100}] },
  { name: 'Cable Woodchopper', muscles: [{name: 'core', percentage: 100}] }
];

const INITIAL_SPLIT: SplitProgram = {
  id: 'split-1',
  name: 'Push Pull Legs',
  days: [
    {
      id: 'day-1',
      name: 'Push Day',
      isExpanded: true,
      exercises: [
        { id: 'ex-1', name: 'Barbell Bench Press', muscles: [{name: 'chest', percentage: 70}, {name: 'shoulders', percentage: 20}, {name: 'triceps', percentage: 10}], sets: [{ id: 's1', reps: '10', weight: '80', completed: false }] }
      ]
    }
  ]
};

const MuscleVisualization = ({ days }: { days: SplitDay[] }) => {
  const muscleData: Record<string, { load: number, sets: number }> = {};
  
  days.forEach(day => {
    day.exercises.forEach(ex => {
      ex.muscles.forEach(m => {
        if (!muscleData[m.name]) {
          muscleData[m.name] = { load: 0, sets: 0 };
        }
        muscleData[m.name].load += (m.percentage / 100) * ex.sets.length;
        muscleData[m.name].sets += ex.sets.length;
      });
    });
  });

  const muscles = [
    { id: 'chest', label: 'Chest', color: 'rgb(239, 68, 68)' },
    { id: 'back', label: 'Back', color: 'rgb(59, 130, 246)' },
    { id: 'shoulders', label: 'Shoulders', color: 'rgb(249, 115, 22)' },
    { id: 'legs', label: 'Legs', color: 'rgb(14, 165, 233)' },
    { id: 'biceps', label: 'Biceps', color: 'rgb(168, 85, 247)' },
    { id: 'triceps', label: 'Triceps', color: 'rgb(234, 179, 8)' },
    { id: 'core', label: 'Core', color: 'rgb(34, 197, 94)' },
  ];

  const getIntensity = (muscle: string) => {
    const data = muscleData[muscle];
    if (!data) return 0;
    return Math.min(data.load / 10, 1);
  };

  const BodyModel = ({ flipped = false }: { flipped?: boolean }) => (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 150" className="w-full h-full relative z-10 transition-all duration-500">
        <defs>
          <linearGradient id="bodyFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#121214" />
          </linearGradient>
        </defs>

        {/* Silhouette - Anatomical Path Improvement */}
        <g fill="url(#bodyFill)" stroke="#333" strokeWidth="0.5">
          {/* Head & Neck */}
          <path d="M42 12 C42 6, 58 6, 58 12 C58 18, 55 22, 50 22 C45 22, 42 18, 42 12 M48 22 Q50 28 52 22" />
          
          {/* Torso & Arms */}
          <path d="M30 35 C22 35, 15 38, 10 50 C8 60, 5 85, 12 92 C15 95, 20 95, 22 90 L20 65 L26 48 C30 42, 40 40, 50 40 C60 40, 70 42, 74 48 L80 65 L78 90 C80 95, 85 95, 88 92 C95 85, 92 60, 90 50 C85 38, 78 35, 70 35 L30 35 Z" />
          <path d="M32 40 L68 40 L65 88 L35 88 Z" />

          {/* Legs */}
          <path d="M35 88 L48 88 L46 142 C45 145, 40 145, 38 142 Z" />
          <path d="M65 88 L52 88 L54 142 C55 145, 60 145, 62 142 Z" />
        </g>

        {/* Muscle Highlight Layers */}
        {!flipped ? (
          <>
            {/* Chest */}
            <path d="M35 45 Q50 42 65 45 L62 62 Q50 58 38 62 Z" 
              fill={muscles.find(m => m.id === 'chest')?.color} 
              fillOpacity={0.1 + getIntensity('chest') * 0.7}
              className="transition-all duration-700" />
            
            {/* Shoulders */}
            <circle cx="22" cy="45" r="6" fill={muscles.find(m => m.id === 'shoulders')?.color} fillOpacity={0.1 + getIntensity('shoulders') * 0.7} className="transition-all duration-700" />
            <circle cx="78" cy="45" r="6" fill={muscles.find(m => m.id === 'shoulders')?.color} fillOpacity={0.1 + getIntensity('shoulders') * 0.7} className="transition-all duration-700" />
            
            {/* Biceps */}
            <path d="M22 55 Q18 65 22 75 L26 72 Q25 65 26 55 Z" fill={muscles.find(m => m.id === 'biceps')?.color} fillOpacity={0.1 + getIntensity('biceps') * 0.7} className="transition-all duration-700" />
            <path d="M78 55 Q82 65 78 75 L74 72 Q75 65 74 55 Z" fill={muscles.find(m => m.id === 'biceps')?.color} fillOpacity={0.1 + getIntensity('biceps') * 0.7} className="transition-all duration-700" />
            
            {/* Abs */}
            <rect x="42" y="65" width="16" height="20" rx="2" fill={muscles.find(m => m.id === 'core')?.color} fillOpacity={0.1 + getIntensity('core') * 0.7} className="transition-all duration-700" />
            
            {/* Legs (Quads) */}
            <path d="M36 92 L48 92 L45 130 L38 130 Z" fill={muscles.find(m => m.id === 'legs')?.color} fillOpacity={0.1 + getIntensity('legs') * 0.5} className="transition-all duration-700" />
            <path d="M64 92 L52 92 L55 130 L62 130 Z" fill={muscles.find(m => m.id === 'legs')?.color} fillOpacity={0.1 + getIntensity('legs') * 0.5} className="transition-all duration-700" />
          </>
        ) : (
          <>
            {/* Back */}
            <path d="M32 42 L68 42 L64 88 L36 88 Z" fill={muscles.find(m => m.id === 'back')?.color} fillOpacity={0.1 + getIntensity('back') * 0.7} className="transition-all duration-700" />
            
            {/* Triceps */}
            <path d="M20 50 L15 70 L22 74 L26 52 Z" fill={muscles.find(m => m.id === 'triceps')?.color} fillOpacity={0.1 + getIntensity('triceps') * 0.7} className="transition-all duration-700" />
            <path d="M80 50 L85 70 L78 74 L74 52 Z" fill={muscles.find(m => m.id === 'triceps')?.color} fillOpacity={0.1 + getIntensity('triceps') * 0.7} className="transition-all duration-700" />
            
            {/* Hamstrings */}
            <path d="M37 92 L63 92 L60 125 L40 125 Z" fill={muscles.find(m => m.id === 'legs')?.color} fillOpacity={0.1 + getIntensity('legs') * 0.4} className="transition-all duration-700" />
          </>
        )}
      </svg>
    </div>
  );

  return (
    <Card className="bg-[#0a0a0b] border-white/5 overflow-hidden relative group">
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Muscle Load</CardTitle>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Heatmap Active</span>
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 relative z-10">
        <div className="flex flex-col xl:flex-row gap-8 items-center lg:items-start xl:items-center">
          {/* Body Models */}
          <div className="flex gap-4 items-end">
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-44 sm:w-40 sm:h-56">
                <BodyModel />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Front View</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-44 sm:w-40 sm:h-56">
                <BodyModel flipped />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Back View</span>
            </div>

            {/* Intensity Scale */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-1.5 h-32 bg-white/5 rounded-full relative overflow-hidden flex flex-col justify-end">
                <motion.div 
                  className="w-full bg-gradient-to-t from-red-600 to-red-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(...muscles.map(m => getIntensity(m.id)), 0.1) * 100}%` }}
                />
              </div>
              <div className="[writing-mode:vertical-lr] rotate-180 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Intensity</div>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="flex-1 w-full space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {muscles.map((muscle) => {
                const intensity = getIntensity(muscle.id);
                const data = muscleData[muscle.id] || { sets: 0 };
                
                return (
                  <div key={muscle.id} className="space-y-1.5 group/m">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: muscle.color }} />
                        <span className="text-xs font-bold text-slate-300 group-hover/m:text-white transition-colors">{muscle.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{data.sets} Sets</span>
                        <span className="text-xs font-bold text-white">{(intensity * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: muscle.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${intensity * 100}%` }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Weekly Sets</p>
                  <p className="text-xl font-bold text-white tabular-nums">
                    {Object.values(muscleData).reduce((userSets, m) => userSets + m.sets, 0)}
                  </p>
               </div>
               <div className="col-span-2 space-y-1 text-right">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Primary Focus</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-red-500">
                      {muscles.reduce((prev, current) => (getIntensity(prev.id) > getIntensity(current.id) ? prev : current)).label}
                    </span>
                    <div className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black uppercase">Hypertrophy</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SplitWorkout() {
  const [view, setView] = useState<'splits_list' | 'viewer' | 'editor'>('splits_list');
  const [splits, setSplits] = useState<SplitProgram[]>([INITIAL_SPLIT]);
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);
  
  const [isEditingSplitName, setIsEditingSplitName] = useState(false);
  const [exercisePickerDayId, setExercisePickerDayId] = useState<string | null>(null);
  const [isAddingNewDay, setIsAddingNewDay] = useState(false);
  const [pickerStep, setPickerStep] = useState<'choice' | 'preset' | 'exercise'>('choice');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [showNewSplitChoice, setShowNewSplitChoice] = useState(false);
  const [openDayMenuId, setOpenDayMenuId] = useState<string | null>(null);

  const activeSplit = splits.find(s => s.id === activeSplitId) || splits[0];

  const updateActiveSplit = (updater: (prev: SplitProgram) => SplitProgram) => {
    setSplits(prev => prev.map(s => s.id === activeSplitId ? updater(s) : s));
  };

  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps', 'Core'];

  const addWorkoutDay = () => {
    const newDay: SplitDay = {
      id: `day-${Date.now()}`,
      name: `Day ${activeSplit.days.length + 1}`,
      isExpanded: true,
      exercises: []
    };
    updateActiveSplit(prev => ({ ...prev, days: [...prev.days, newDay] }));
  };

  const removeWorkoutDay = (dayId: string) => {
    updateActiveSplit(prev => ({ ...prev, days: prev.days.filter(d => d.id !== dayId) }));
  };

  const toggleDayExpansion = (dayId: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d)
    }));
  };

  const updateDayName = (dayId: string, name: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, name } : d)
    }));
  };

  const addExerciseToDay = (dayId: string, exTemplate: any) => {
    const newExercise: WorkoutExercise = {
      id: `ex-${Date.now()}-${Math.random()}`,
      name: exTemplate.name,
      muscles: exTemplate.muscles,
      sets: [{ id: `s-${Date.now()}`, reps: '10', weight: '60', completed: false }]
    };
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, exercises: [...d.exercises, newExercise] } : d)
    }));
    setExercisePickerDayId(null);
    setSearchQuery('');
  };

  const removeExerciseFromDay = (dayId: string, exId: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, exercises: d.exercises.filter(ex => ex.id !== exId) } : d)
    }));
  };

  const addSet = (dayId: string, exId: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          exercises: d.exercises.map(ex => {
            if (ex.id !== exId) return ex;
            const lastSet = ex.sets[ex.sets.length - 1];
            return {
              ...ex,
              sets: [...ex.sets, { 
                id: `s-${Date.now()}-${Math.random()}`, 
                reps: lastSet?.reps || '10', 
                weight: lastSet?.weight || '60', 
                completed: false 
              }]
            };
          })
        };
      })
    }));
  };

  const updateSet = (dayId: string, exId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          exercises: d.exercises.map(ex => {
            if (ex.id !== exId) return ex;
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
            };
          })
        };
      })
    }));
  };

  const toggleSetComplete = (dayId: string, exId: string, setId: string) => {
    updateActiveSplit(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          exercises: d.exercises.map(ex => {
            if (ex.id !== exId) return ex;
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
            };
          })
        };
      })
    }));
  };

  const createNewSplit = () => {
    const newSplit: SplitProgram = {
      id: `split-${Date.now()}`,
      name: 'New Workout Split',
      days: []
    };
    setSplits(prev => [...prev, newSplit]);
    setActiveSplitId(newSplit.id);
    setView('editor');
    setShowNewSplitChoice(false);
  };

  const recommendations = EXERCISE_DB.slice(0, 4);
  const filteredExercises = EXERCISE_DB.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      ex.muscles.some(m => m.name.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (view === 'splits_list') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-32">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">My Splits</h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage your gym training programs</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {splits.map(s => (
            <Card 
              key={s.id} 
              className="bg-[#111113] border-white/5 hover:border-red-500/50 transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => {
                setActiveSplitId(s.id);
                setView('viewer');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors tracking-tight">{s.name}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{s.days.length} Days Split</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Exercises</p>
                    <p className="text-lg font-bold text-white">{s.days.reduce((acc, d) => acc + d.exercises.length, 0)}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-red-500 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            className="w-full py-12 bg-red-600/5 hover:bg-red-600/10 text-red-500 border-2 border-red-500/20 border-dashed rounded-[24px] font-bold text-xl flex flex-col gap-2 h-auto"
            onClick={createNewSplit}
          >
            <Plus className="w-8 h-8" />
            Add New Split
          </Button>
        </div>

        <AnimatePresence>
          {showNewSplitChoice && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setShowNewSplitChoice(false)}
            >
              <motion.div 
                initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
                className="bg-[#0c0c0e] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <header className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Choose Workout Type</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowNewSplitChoice(false)} className="text-slate-500">
                      <Plus className="w-6 h-6 rotate-45" />
                    </Button>
                  </header>

                  <div className="grid grid-cols-1 gap-4 py-4">
                    <button 
                      onClick={() => setShowNewSplitChoice(false)}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Preset Workout</p>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Coming Soon</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Choose from pre-built routines (PPL, Upper/Lower, etc.)</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-red-500 transition-colors" />
                    </button>

                    <button 
                      onClick={createNewSplit}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Create Workout</p>
                        <p className="text-sm text-slate-500 mt-1">Build your own custom split from scratch</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
           <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" onClick={() => setView('splits_list')}>
             <ArrowLeft className="w-6 h-6" />
           </Button>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Back to Library</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            {isEditingSplitName ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={activeSplit.name} 
                  onChange={(e) => updateActiveSplit(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => setIsEditingSplitName(false)}
                  className="bg-[#111113] border-b-2 border-red-500 text-2xl font-bold text-white px-2 py-1 outline-none w-full"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">{activeSplit.name}</h1>
                {view === 'editor' && (
                  <Button variant="ghost" size="icon" className="text-slate-500" onClick={() => setIsEditingSplitName(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider h-8" onClick={() => setUnit(u => u === 'kg' ? 'lbs' : 'kg')}>
                {unit}
             </Button>
             {view === 'viewer' ? (
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-8 px-4 text-xs" onClick={() => setView('editor')}>
                   Edit Split
                </Button>
             ) : (
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-8 px-4 text-xs" onClick={() => setView('viewer')}>
                   Save Split
                </Button>
             )}
          </div>
        </div>
        <MuscleVisualization days={activeSplit.days} />
      </header>

      {/* Split Days */}
      <Reorder.Group axis="y" values={activeSplit.days} onReorder={(newDays) => updateActiveSplit(prev => ({ ...prev, days: newDays }))} className="space-y-4">
        {activeSplit.days.map((day) => (
          <Reorder.Item key={day.id} value={day} className="list-none" dragListener={view === 'editor'}>
            <Card className="bg-[#111113] border-white/5 overflow-hidden">
              <div className="flex items-center p-4 bg-white/[0.02]">
                {view === 'editor' && (
                  <div className="cursor-grab active:cursor-grabbing mr-3 text-slate-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 flex items-center gap-3" onClick={() => toggleDayExpansion(day.id)}>
                   <div className="cursor-pointer">
                      {day.isExpanded ? <ChevronDown className="w-5 h-5 text-red-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                   </div>
                    <div className="flex items-center gap-2">
                      {view === 'editor' ? (
                        <input 
                           id={`day-input-${day.id}`}
                           type="text"
                           className="bg-transparent text-lg font-bold text-white focus:outline-none focus:text-red-400 max-w-[200px]"
                           value={day.name}
                           onClick={(e) => e.stopPropagation()}
                           onChange={(e) => updateDayName(day.id, e.target.value)}
                        />
                      ) : (
                        <span className="text-lg font-bold text-white">{day.name}</span>
                      )}
                    </div>
                </div>
                {view === 'editor' && (
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDayMenuId(openDayMenuId === day.id ? null : day.id);
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>

                    <AnimatePresence>
                      {openDayMenuId === day.id && (
                        <>
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDayMenuId(null)}
                          />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-10 w-32 bg-[#1a1a1c] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
                          >
                            <button 
                              className="w-full px-4 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`day-input-${day.id}`)?.focus();
                                setOpenDayMenuId(null);
                              }}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Rename
                            </button>
                            <button 
                              className="w-full px-4 py-2 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-white/5"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeWorkoutDay(day.id);
                                setOpenDayMenuId(null);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {day.isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 bg-black/20">
                      {day.exercises.map(ex => (
                        <Card key={ex.id} className="bg-white/[0.03] border-white/5 p-4 space-y-3 relative group">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-bold text-white tracking-tight">{ex.name}</h3>
                              <div className="flex gap-2 flex-wrap">
                                {ex.muscles.map(m => (
                                  <span key={m.name} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                    {m.name} {m.percentage}%
                                  </span>
                                ))}
                              </div>
                            </div>
                            {view === 'editor' && (
                              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExerciseFromDay(day.id, ex.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                             <div className="grid grid-cols-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 mb-1">
                                <div>Set</div>
                                <div>{unit}</div>
                                <div>Reps</div>
                                <div className="text-right pr-2">Done</div>
                             </div>
                              {ex.sets.map((set, i) => (
                               <div key={set.id} className={cn("grid grid-cols-4 items-center gap-2 p-1 rounded-lg transition-colors", set.completed ? "bg-red-500/5 shadow-inner" : "hover:bg-white/[0.02]")}>
                                  <div className="text-xs font-bold text-slate-500 pl-2">#{i + 1}</div>
                                  <div className="flex justify-center">
                                    {view === 'editor' ? (
                                      <input 
                                        type="number"
                                        className="bg-white/5 text-center text-sm font-bold text-white rounded-md py-1.5 focus:ring-1 focus:ring-red-500 outline-none border border-white/5 w-full"
                                        value={set.weight}
                                        onChange={(e) => updateSet(day.id, ex.id, set.id, 'weight', e.target.value)}
                                      />
                                    ) : (
                                      <span className="text-sm font-bold text-white">{set.weight}</span>
                                    )}
                                  </div>
                                  <div className="flex justify-center">
                                    {view === 'editor' ? (
                                      <input 
                                        type="number"
                                        className="bg-white/5 text-center text-sm font-bold text-white rounded-md py-1.5 focus:ring-1 focus:ring-red-500 outline-none border border-white/5 w-full"
                                        value={set.reps}
                                        onChange={(e) => updateSet(day.id, ex.id, set.id, 'reps', e.target.value)}
                                      />
                                    ) : (
                                      <span className="text-sm font-bold text-white">{set.reps}</span>
                                    )}
                                  </div>
                                  <div className="flex justify-end pr-2">
                                     <button 
                                      onClick={() => toggleSetComplete(day.id, ex.id, set.id)}
                                      className={cn("w-6 h-6 rounded-md flex items-center justify-center border transition-all", set.completed ? "bg-red-600 border-red-500 text-white" : "border-white/10 text-slate-500 hover:border-red-500/50")}>
                                        {set.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                     </button>
                                  </div>
                               </div>
                             ))}
                             {view === 'editor' && (
                               <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white mt-1 border border-dashed border-white/10 h-8" onClick={() => addSet(day.id, ex.id)}>
                                  + Add Set
                               </Button>
                             )}
                          </div>
                        </Card>
                      ))}

                      {view === 'editor' && (
                        <Button 
                          variant="outline" 
                          className="w-full border-dashed border-white/10 bg-white/5 text-slate-400 font-bold tracking-wide hover:bg-white/10 hover:text-white py-6 rounded-xl"
                          onClick={() => {
                            setExercisePickerDayId(day.id);
                          }}
                        >
                          + Add Exercise
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {view === 'editor' && (
        <Button className="w-full py-8 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 border-dashed rounded-[20px] font-bold text-lg" onClick={addWorkoutDay}>
           <Plus className="w-6 h-6 mr-2" /> Add Workout Day
        </Button>
      )}

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {exercisePickerDayId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => {
                setExercisePickerDayId(null);
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              <motion.div 
                initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
                className="bg-[#0c0c0e] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">Select Exercise</h2>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setExercisePickerDayId(null);
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }} 
                      className="text-slate-500"
                    >
                      <Plus className="w-6 h-6 rotate-45" />
                    </Button>
                  </header>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                      <input 
                        autoFocus
                        type="text"
                        className="bg-white/5 border border-white/10 rounded-2xl w-full pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-red-500 outline-none"
                        placeholder="Search exercises (e.g. Chest Press)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                          className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                            (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                              ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                              : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {filteredExercises.length > 0 ? (
                        filteredExercises.map((ex, i) => (
                          <div 
                            key={i} 
                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-red-500/5 hover:border-red-500/20 transition-all cursor-pointer flex justify-between items-center group"
                            onClick={() => addExerciseToDay(exercisePickerDayId, ex)}
                          >
                            <div className="space-y-1">
                              <span className="font-bold text-slate-200 group-hover:text-white">{ex.name}</span>
                              <div className="flex gap-2">
                                {ex.muscles.map(m => (
                                   <span key={m.name} className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{m.name}</span>
                                ))}
                              </div>
                            </div>
                            <Plus className="w-5 h-5 text-slate-600 group-hover:text-red-500 transition-colors" />
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5 font-medium text-slate-500">
                          No exercises found matching your search.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
