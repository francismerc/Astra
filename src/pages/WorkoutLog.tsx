import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Play, Check, Clock, Trash2, ArrowLeft, ChevronDown, ChevronRight, Activity, Search, Edit2, Flame } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { cn } from "@/lib/utils";

// --- Types & Mock Data ---
type AppView = 'hub' | 'split_selection' | 'split_builder' | 'active_workout' | 'workout_summary';

type WorkoutSet = { id: string; reps: string; weight: string; completed: boolean; };
type MuscleActivation = { name: string; percentage: number };
type WorkoutExercise = { id: string; name: string; sets: WorkoutSet[]; muscles: MuscleActivation[]; };
type SplitDay = { id: string; name: string; exercises: WorkoutExercise[]; isExpanded?: boolean; };
type SplitProgram = { id: string; name: string; days: SplitDay[]; };

const PRESETS = [
  { id: 'fullbody', name: 'Full Body', description: 'Train all major muscle groups.', days: ['Full Body A', 'Full Body B', 'Full Body C'] },
  { id: 'upperlower', name: 'Upper / Lower', description: 'Split between upper and lower body.', days: ['Upper', 'Lower', 'Upper', 'Lower'] },
  { id: 'ppl', name: 'Push Pull Legs', description: 'Grouped by movement patterns.', days: ['Push Day', 'Pull Day', 'Leg Day'] },
  { id: 'arnold', name: 'Arnold Split', description: 'Chest/Back, Shoulders/Arms, Legs.', days: ['Chest & Back', 'Shoulders & Arms', 'Legs'] },
  { id: 'bro', name: 'Bro Split', description: 'One muscle group per day.', days: ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms'] },
  { id: 'custom', name: 'Custom Split', description: 'Build from scratch.', days: [] }
];

const EXERCISE_DB = [
  { name: 'Barbell Bench Press', muscles: [{name: 'chest', percentage: 70}, {name: 'shoulders', percentage: 20}, {name: 'triceps', percentage: 10}] },
  { name: 'Incline Dumbbell Press', muscles: [{name: 'chest', percentage: 65}, {name: 'shoulders', percentage: 35}] },
  { name: 'Cable Fly', muscles: [{name: 'chest', percentage: 100}] },
  { name: 'Overhead Press', muscles: [{name: 'shoulders', percentage: 70}, {name: 'triceps', percentage: 30}] },
  { name: 'Lateral Raises', muscles: [{name: 'shoulders', percentage: 100}] },
  { name: 'Triceps Pushdown', muscles: [{name: 'triceps', percentage: 100}] },
  { name: 'Deadlift', muscles: [{name: 'back', percentage: 50}, {name: 'legs', percentage: 50}] },
  { name: 'Pull-up', muscles: [{name: 'back', percentage: 70}, {name: 'biceps', percentage: 30}] },
  { name: 'Barbell Row', muscles: [{name: 'back', percentage: 80}, {name: 'biceps', percentage: 20}] },
  { name: 'Face Pulls', muscles: [{name: 'shoulders', percentage: 60}, {name: 'back', percentage: 40}] },
  { name: 'Dumbbell Curl', muscles: [{name: 'biceps', percentage: 100}] },
  { name: 'Squat', muscles: [{name: 'legs', percentage: 70}, {name: 'core', percentage: 30}] },
  { name: 'Leg Press', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Romanian Deadlift', muscles: [{name: 'legs', percentage: 80}, {name: 'back', percentage: 20}] },
  { name: 'Leg Extension', muscles: [{name: 'legs', percentage: 100}] },
  { name: 'Calf Raises', muscles: [{name: 'legs', percentage: 100}] }
];

const DEFAULT_SPLIT: SplitProgram = {
  id: 'current-split',
  name: 'PPL Program',
  days: [
    {
      id: 'day-1',
      name: 'Push Day',
      isExpanded: false,
      exercises: [
        { id: 'ex-1', name: 'Barbell Bench Press', muscles: [{name: 'chest', percentage: 70}, {name: 'shoulders', percentage: 20}, {name: 'triceps', percentage: 10}], sets: [{ id: 's1', reps: '10', weight: '80', completed: false }] },
        { id: 'ex-2', name: 'Incline Dumbbell Press', muscles: [{name: 'chest', percentage: 65}, {name: 'shoulders', percentage: 35}], sets: [{ id: 's2', reps: '10', weight: '30', completed: false }] }
      ]
    },
    {
      id: 'day-2',
      name: 'Pull Day',
      isExpanded: false,
      exercises: [
        { id: 'ex-3', name: 'Pull-up', muscles: [{name: 'back', percentage: 70}, {name: 'biceps', percentage: 30}], sets: [{ id: 's3', reps: '8', weight: '0', completed: false }] },
        { id: 'ex-4', name: 'Barbell Row', muscles: [{name: 'back', percentage: 80}, {name: 'biceps', percentage: 20}], sets: [{ id: 's4', reps: '10', weight: '60', completed: false }] }
      ]
    },
    {
      id: 'day-3',
      name: 'Leg Day',
      isExpanded: false,
      exercises: [
        { id: 'ex-5', name: 'Squat', muscles: [{name: 'legs', percentage: 70}, {name: 'core', percentage: 30}], sets: [{ id: 's5', reps: '5', weight: '100', completed: false }] }
      ]
    }
  ]
};

const LiveMuscleModel = ({ muscles }: { muscles: string[] }) => {
  const isGlow = (muscle: string) => muscles.includes(muscle);
  
  return (
    <div className="relative w-32 h-40 mx-auto opacity-80 mix-blend-screen scale-110 mb-4 mt-2">
      <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="chest-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="shoulders-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="triceps-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="biceps-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="back-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="legs-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Abstract Base Body */}
        <path d="M40 10 C40 5, 60 5, 60 10 C65 20, 65 30, 50 35 C35 30, 35 20, 40 10 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Head */}
        <path d="M30 40 C20 40, 15 45, 10 55 L20 65 L25 50 C30 45, 40 40, 50 40 C60 40, 70 45, 75 50 L80 65 L90 55 C85 45, 80 40, 70 40 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Shoulders/Upper Arms */}
        <path d="M15 65 L5 90 L15 95 L25 70 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Forearms L */}
        <path d="M85 65 L95 90 L85 95 L75 70 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Forearms R */}
        <path d="M30 45 L70 45 L65 90 L35 90 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Torso */}
        <path d="M35 90 L65 90 L60 140 L40 140 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" /> {/* Legs */}
        
        {/* Glow Overlays based on active muscles */}
        {isGlow('chest') && <circle cx="50" cy="55" r="15" fill="url(#chest-glow)" className="animate-pulse" />}
        {isGlow('shoulders') && (
          <>
            <circle cx="25" cy="45" r="12" fill="url(#shoulders-glow)" className="animate-pulse" style={{ animationDelay: '200ms' }} />
            <circle cx="75" cy="45" r="12" fill="url(#shoulders-glow)" className="animate-pulse" style={{ animationDelay: '400ms' }} />
          </>
        )}
        {(isGlow('triceps') || isGlow('arms')) && (
          <>
            <circle cx="15" cy="55" r="10" fill="url(#triceps-glow)" className="animate-pulse" />
            <circle cx="85" cy="55" r="10" fill="url(#triceps-glow)" className="animate-pulse" />
          </>
        )}
        {(isGlow('biceps') || isGlow('arms')) && (
          <>
            <circle cx="20" cy="65" r="10" fill="url(#biceps-glow)" className="animate-pulse" style={{ animationDelay: '100ms' }} />
            <circle cx="80" cy="65" r="10" fill="url(#biceps-glow)" className="animate-pulse" style={{ animationDelay: '300ms' }} />
          </>
        )}
        {isGlow('back') && <circle cx="50" cy="65" r="20" fill="url(#back-glow)" className="animate-pulse" style={{ animationDelay: '500ms' }} />}
        {isGlow('core') && <circle cx="50" cy="80" r="15" fill="url(#core-glow)" className="animate-pulse" />}
        {isGlow('legs') && (
          <>
            <circle cx="42" cy="110" r="15" fill="url(#legs-glow)" className="animate-pulse" style={{ animationDelay: '200ms' }} />
            <circle cx="58" cy="110" r="15" fill="url(#legs-glow)" className="animate-pulse" style={{ animationDelay: '400ms' }} />
          </>
        )}
      </svg>
    </div>
  );
};

export default function WorkoutLog() {
  const [view, setView] = useState<AppView>('hub');
  
  // App State Data
  const [activeSplit, setActiveSplit] = useState<SplitProgram>(DEFAULT_SPLIT);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Split Builder State
  const [builderSplit, setBuilderSplit] = useState<SplitProgram>({ id: '', name: '', days: [] });
  const [exercisePickerForDay, setExercisePickerForDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Workout State
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<SplitDay | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);

  // --- Helpers ---
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getMuscleColor = (muscle: string) => {
    const m = muscle.toLowerCase();
    if (['chest', 'back'].includes(m)) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (['shoulders', 'core'].includes(m)) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    if (['triceps', 'biceps', 'arms'].includes(m)) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    if (['legs'].includes(m)) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    return 'text-white bg-white/10 border-white/20';
  };

  // --- Effects ---
  useEffect(() => {
    if (view === 'active_workout' && workoutStartTime) {
      const interval = setInterval(() => {
        setElapsed(Date.now() - workoutStartTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [view, workoutStartTime]);

  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      return () => clearInterval(interval);
    } else if (restTimer === 0) {
      setRestTimer(null);
    }
  }, [restTimer]);

  // --- Dispatch Actions ---
  const startWorkout = (day: SplitDay) => {
    setActiveWorkoutDay(JSON.parse(JSON.stringify(day))); // Deep copy
    setWorkoutStartTime(Date.now());
    setElapsed(0);
    setRestTimer(null);
    setView('active_workout');
  };

  const finishWorkout = () => {
    setView('workout_summary');
    setRestTimer(null);
  };

  const handleBuildSplitSelect = (preset: typeof PRESETS[0]) => {
    const newDays = preset.days.map((d, i) => ({
      id: `day-${Date.now()}-${i}`,
      name: d,
      exercises: [],
      isExpanded: true
    }));
    setBuilderSplit({
      id: `split-${Date.now()}`,
      name: preset.id === 'custom' ? 'My Custom Split' : preset.name,
      days: newDays
    });
    setView('split_builder');
  };

  const toggleBuilderDay = (dayId: string) => {
    setBuilderSplit(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d)
    }));
  };

  const addDayToBuilder = () => {
    setBuilderSplit(prev => ({
      ...prev,
      days: [...prev.days, { id: `day-${Date.now()}`, name: `Workout Day ${prev.days.length + 1}`, exercises: [], isExpanded: true }]
    }));
  };

  const removeDayFromBuilder = (dayId: string) => {
    setBuilderSplit(prev => ({
      ...prev,
      days: prev.days.filter(d => d.id !== dayId)
    }));
  };

  const addExerciseToBuilderDay = (dayId: string, exDef: any) => {
    setBuilderSplit(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (d.id === dayId) {
          return {
            ...d,
            exercises: [...d.exercises, {
              id: `ex-${Date.now()}-${Math.random()}`,
              name: exDef.name,
              muscles: exDef.muscles,
              sets: [{ id: `set-${Date.now()}`, reps: '', weight: '', completed: false }]
            }]
          }
        }
        return d;
      })
    }));
    setExercisePickerForDay(null);
    setSearchQuery('');
  };

  // Used for both Active Workout and Split Builder
  const handleSetUpdate = (isBuilder: boolean, dayId: string, exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    const updateFn = (days: SplitDay[]) => days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: d.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) };
            }
            return ex;
          })
        }
      }
      return d;
    });

    if (isBuilder) setBuilderSplit(prev => ({ ...prev, days: updateFn(prev.days) }));
    else setActiveWorkoutDay(prev => prev ? { ...prev, ...updateFn([prev])[0] } : prev);
  };

  const handleAddSet = (isBuilder: boolean, dayId: string, exerciseId: string) => {
    const updateFn = (days: SplitDay[]) => days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: d.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const lastSet = ex.sets[ex.sets.length - 1];
              // Smart Autofill
              const newSet = { 
                id: `set-${Date.now()}-${Math.random()}`, 
                reps: lastSet ? lastSet.reps : '', 
                weight: lastSet ? lastSet.weight : '', 
                completed: false 
              };
              return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
          })
        }
      }
      return d;
    });

    if (isBuilder) setBuilderSplit(prev => ({ ...prev, days: updateFn(prev.days) }));
    else setActiveWorkoutDay(prev => prev ? { ...prev, ...updateFn([prev])[0] } : prev);
  };
  
  const removeExercise = (isBuilder: boolean, dayId: string, exerciseId: string) => {
    const updateFn = (days: SplitDay[]) => days.map(d => {
      if (d.id === dayId) {
        return { ...d, exercises: d.exercises.filter(ex => ex.id !== exerciseId) };
      }
      return d;
    });
    if (isBuilder) setBuilderSplit(prev => ({ ...prev, days: updateFn(prev.days) }));
    else setActiveWorkoutDay(prev => prev ? { ...prev, ...updateFn([prev])[0] } : prev);
  };

  const completeActiveWorkoutSet = (exerciseId: string, setId: string) => {
    if (!activeWorkoutDay) return;
    setActiveWorkoutDay(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => {
                if (s.id === setId) {
                  const newlyCompleted = !s.completed;
                  if (newlyCompleted) {
                    setRestTimer(90); // Start 90s rest timer
                  }
                  return { ...s, completed: newlyCompleted };
                }
                return s;
              })
            };
          }
          return ex;
        })
      };
    });
  };

  // --- Render Views ---

  const renderExerciseSets = (isBuilder: boolean, day: SplitDay, exercise: WorkoutExercise) => (
    <Card key={exercise.id} className="overflow-hidden border-white/10 mt-3">
      <CardHeader className="p-3 bg-white/[0.02] border-b border-white/5 flex flex-row justify-between items-start space-y-0">
        <div>
          <CardTitle className="text-base font-bold text-white tracking-tight">{exercise.name}</CardTitle>
          {!isBuilder && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Previous: 80{weightUnit} × 8</p>}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {exercise.muscles.map(m => (
              <span key={m.name} className={cn("text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border", getMuscleColor(m.name))}>
                {m.name} {m.percentage}%
              </span>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => removeExercise(isBuilder, day.id, exercise.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/10">
          <div className="col-span-2 text-center">Set</div>
          <div className="col-span-4 text-center">{weightUnit}</div>
          <div className="col-span-4 text-center">Reps</div>
          <div className="col-span-2 text-center"><Check className="w-3 h-3 mx-auto" /></div>
        </div>
        <AnimatePresence>
          {exercise.sets.map((set, setIndex) => (
            <motion.div key={set.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className={cn("grid grid-cols-12 gap-2 px-3 py-2 items-center border-b border-white/5 transition-colors", set.completed ? "bg-neon/5" : "hover:bg-white/[0.02]")}>
              <div className="col-span-2 text-center text-xs font-bold text-slate-400">
                {setIndex + 1}
              </div>
              <div className="col-span-4">
                <input 
                  type="number" value={set.weight} onChange={(e) => handleSetUpdate(isBuilder, day.id, exercise.id, set.id, 'weight', e.target.value)}
                  disabled={set.completed && !isBuilder} placeholder="-"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-neon focus:ring-1 disabled:opacity-50"
                />
              </div>
              <div className="col-span-4">
                <input 
                  type="number" value={set.reps} onChange={(e) => handleSetUpdate(isBuilder, day.id, exercise.id, set.id, 'reps', e.target.value)}
                  disabled={set.completed && !isBuilder} placeholder="-"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-center text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-neon focus:ring-1 disabled:opacity-50"
                />
              </div>
              <div className="col-span-2 flex justify-center">
                {isBuilder ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <button 
                    onClick={() => completeActiveWorkoutSet(exercise.id, set.id)}
                    className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", 
                      set.completed ? "bg-gradient-to-br from-red-900 to-orange-700 text-white shadow-[0_0_10px_rgba(127,29,29,0.5)]" : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                    )}>
                    <Check className={cn("w-4 h-4", set.completed ? "text-white" : "text-current")} strokeWidth={set.completed ? 3 : 2} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="p-2">
          <Button variant="ghost" className="w-full text-slate-400 hover:text-white uppercase tracking-widest text-[10px] font-bold bg-white/[0.02]" onClick={() => handleAddSet(isBuilder, day.id, exercise.id)}>
            + Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const getSmartRecommendations = (day: SplitDay) => {
    // Basic recommendation logic: what's not in the day already
    const existingNames = day.exercises.map(e => e.name);
    return EXERCISE_DB.filter(ex => !existingNames.includes(ex.name)).slice(0, 5);
  };

  const getMuscleLoadForDay = (day: SplitDay) => {
    const muscles = new Set(day.exercises.flatMap(e => e.muscles.map(m => m.name)));
    return Array.from(muscles);
  };

  if (view === 'hub') {
    return (
      <div className="relative space-y-6 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800/10 rounded-full blur-[80px] pointer-events-none -z-10" />
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Training Hub</h1>
            <p className="text-base text-slate-500">Your current active programming.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" className="gap-2 w-full sm:w-auto bg-white/5 hover:bg-white/10 font-bold uppercase tracking-widest text-xs" onClick={() => setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg')}>
              {weightUnit}
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => setView('split_selection')}>
              <Edit2 className="w-4 h-4" /> Change Split
            </Button>
          </div>
        </header>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">{activeSplit.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSplit.days.map((day, i) => (
              <Card key={day.id} className="hover:border-white/20 transition-colors flex flex-col p-5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-lg leading-snug">{day.name}</CardTitle>
                    <p className="text-xs text-slate-400 mt-1">{day.exercises.length} Exercises</p>
                  </div>
                </div>
                
                <LiveMuscleModel muscles={getMuscleLoadForDay(day)} />
                
                <div className="flex gap-1.5 flex-wrap mb-6 justify-center">
                  {getMuscleLoadForDay(day).map(m => (
                    <span key={m} className={cn("text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border", getMuscleColor(m))}>
                      {m}
                    </span>
                  ))}
                  {getMuscleLoadForDay(day).length === 0 && <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold px-1.5 py-0.5">Empty Day</span>}
                </div>
                <Button variant="neon" className="w-full mt-auto font-bold tracking-wide" onClick={() => startWorkout(day)}>
                   Start Workout
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'split_selection') {
    return (
      <div className="space-y-6 pb-24">
        <header className="flex items-center gap-4 pb-4 border-b border-white/5">
          <Button variant="ghost" size="icon" onClick={() => setView('hub')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Choose Training Setup</h1>
            <p className="text-sm text-slate-500">Pick a preset or build a custom split.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESETS.map((preset) => (
            <Card key={preset.id} className="p-5 cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleBuildSplitSelect(preset)}>
              <h3 className="font-bold text-lg text-white group-hover:text-neon transition-colors">{preset.name}</h3>
              <p className="text-sm text-slate-400 mt-1 mb-4">{preset.description}</p>
              <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex-wrap">
                {preset.days.length > 0 ? preset.days.map((d, i) => <span key={i} className="bg-white/5 px-2 py-1 rounded">{d}</span>) : <span className="bg-white/5 px-2 py-1 rounded">Empty Layout</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'split_builder') {
    const activeDayForPicker = exercisePickerForDay ? builderSplit.days.find(d => d.id === exercisePickerForDay) : null;

    if (exercisePickerForDay && activeDayForPicker) {
      const recs = getSmartRecommendations(activeDayForPicker);
      const filteredDb = EXERCISE_DB.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        <div className="space-y-6 pb-24">
          <header className="flex items-center gap-4 pb-4 border-b border-white/5">
            <Button variant="ghost" size="icon" onClick={() => setExercisePickerForDay(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Add Exercise</h1>
          </header>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" placeholder="Search exercises..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-neon focus:ring-1"
            />
          </div>

          {!searchQuery && recs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-neon uppercase tracking-widest mb-3">Smart Recommendations</h3>
              <div className="space-y-2">
                {recs.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-neon/5 border border-neon/10 flex justify-between items-center cursor-pointer hover:bg-neon/10 transition-colors" onClick={() => addExerciseToBuilderDay(activeDayForPicker.id, ex)}>
                    <div>
                      <p className="font-bold text-white">{ex.name}</p>
                      <div className="flex gap-1 mt-1.5">
                        {ex.muscles.map(m => <span key={m.name} className={cn("text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border", getMuscleColor(m.name))}>{m.name}</span>)}
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-neon" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">All Exercises</h3>
            <div className="divide-y divide-white/5">
              {filteredDb.map((ex, i) => (
                <div key={i} className="py-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors px-2 rounded-lg" onClick={() => addExerciseToBuilderDay(activeDayForPicker.id, ex)}>
                  <div>
                    <p className="font-bold text-slate-200">{ex.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{ex.muscles.map(m => m.name).join(' • ')}</p>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-32">
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
          <div className="w-full">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-6 h-6 p-0" onClick={() => setView('split_selection')}><ArrowLeft className="w-4 h-4" /></Button>
              Split Builder
            </p>
            <input 
              type="text" value={builderSplit.name} onChange={(e) => setBuilderSplit(prev => ({...prev, name: e.target.value}))}
              className="bg-transparent border-b border-dashed border-white/20 text-3xl font-bold text-white focus:outline-none focus:border-neon w-full pb-1"
              placeholder="Split Name"
            />
          </div>
        </header>

        <Reorder.Group axis="y" values={builderSplit.days} onReorder={(newDays) => setBuilderSplit(prev => ({ ...prev, days: newDays }))} className="space-y-4">
          {builderSplit.days.map((day, i) => (
            <Reorder.Item key={day.id} value={day} className="list-none">
              <Card className="overflow-hidden bg-black/40 border-white/10">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => toggleBuilderDay(day.id)}>
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white" onClick={(e) => e.stopPropagation()}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grip-vertical"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                    </div>
                    {day.isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    <div>
                      <input 
                        type="text" value={day.name} onClick={(e) => e.stopPropagation()} onChange={(e) => setBuilderSplit(prev => ({...prev, days: prev.days.map(d => d.id === day.id ? {...d, name: e.target.value} : d)}))}
                        className="bg-transparent font-bold text-lg text-white focus:outline-none px-1 rounded hover:bg-white/10 w-48"
                      />
                      <p className="text-xs text-slate-500 ml-1">{day.exercises.length} Exercises</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400" onClick={(e) => { e.stopPropagation(); removeDayFromBuilder(day.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {day.isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="p-4 pt-0 bg-white/[0.01] border-t border-white/5 space-y-4">
                        {day.exercises.map(ex => renderExerciseSets(true, day, ex))}
                        <Button variant="outline" className="w-full border-dashed border-white/20 text-slate-400 hover:text-white" onClick={() => setExercisePickerForDay(day.id)}>
                          <Plus className="w-4 h-4 mr-2" /> Add Exercise
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reorder.Item>
          ))}
          <Button variant="secondary" className="w-full py-6 bg-white/5 hover:bg-white/10 text-white font-bold" onClick={addDayToBuilder}>
            <Plus className="w-5 h-5 mr-2" /> Add Workout Day
          </Button>
        </Reorder.Group>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 z-50">
          <div className="max-w-xl mx-auto">
            <Button variant="neon" className="w-full text-lg py-6 shadow-[0_0_20px_rgba(220,38,38,0.3)]" onClick={() => { setActiveSplit(builderSplit); setView('hub'); }}>
              Save & Apply Split
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'active_workout' && activeWorkoutDay) {
    return (
      <div className="space-y-6 pb-32">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5 sticky top-0 bg-[#09090b]/90 backdrop-blur-xl z-30 pt-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">{activeWorkoutDay.name}</h1>
            <div className="flex items-center gap-4">
              <p className="text-neon font-mono font-bold tracking-widest flex items-center gap-1.5 text-sm">
                <Clock className="w-4 h-4" /> {formatTime(elapsed)}
              </p>
              {restTimer !== null && (
                <p className="text-orange-400 font-mono font-bold tracking-widest flex items-center gap-1.5 text-sm bg-orange-400/10 px-2 py-0.5 rounded">
                  Rest: {formatTime(restTimer * 1000)}
                </p>
              )}
            </div>
          </div>
          <Button variant="neon" className="gap-2 font-bold w-full sm:w-auto" onClick={finishWorkout}>
             Finish
          </Button>
        </header>

        <div className="space-y-6">
          {activeWorkoutDay.exercises.map(ex => renderExerciseSets(false, activeWorkoutDay, ex))}
        </div>
      </div>
    );
  }

  if (view === 'workout_summary') {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh] text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-neon/10 flex items-center justify-center mb-4">
          <Activity className="w-10 h-10 text-neon" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight italic uppercase">Session Complete</h1>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-6">
          <Card className="p-4 bg-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Duration</p>
            <p className="text-2xl font-mono font-bold text-white">{formatTime(elapsed)}</p>
          </Card>
          <Card className="p-4 bg-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Volume</p>
            <p className="text-2xl font-mono font-bold text-white">4,200 <span className="text-sm font-sans text-slate-400 font-normal">{weightUnit}</span></p>
          </Card>
        </div>

        <Card className="w-full max-w-sm mt-4 p-5 bg-gradient-to-br from-neon/10 to-transparent border-neon/20">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-neon" />
            <h3 className="font-bold text-white">New Personal Record!</h3>
          </div>
          <p className="text-sm text-slate-300 text-left">Barbell Bench Press: <span className="font-bold text-white">85{weightUnit} for 8 reps</span></p>
        </Card>

        <Button variant="outline" className="w-full max-w-sm mt-8 py-6 text-lg" onClick={() => setView('hub')}>
          Return to Hub
        </Button>
      </div>
    );
  }

  return null;
}
