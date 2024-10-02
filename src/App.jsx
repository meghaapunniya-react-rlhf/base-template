import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const climates = ['Cool', 'Moderate', 'Hot'];
const glassSizes = [200, 300, 500];

function calculateHydrationGoal(weight, activity, climate) {
  let base = weight * 35; // ml per kg
  if (activity === 'Lightly Active') base *= 1.1;
  else if (activity === 'Moderately Active') base *= 1.3;
  else if (activity === 'Very Active') base *= 1.5;
  if (climate === 'Hot') base *= 1.1;
  return Math.round(base);
}

function WaterGlass({ fillPercentage }) {
  const fillHeight = `${fillPercentage}%`;
  return (
    <div className="h-48 relative">
      <svg width="100%" height="100%" viewBox="0 0 100 200" className="absolute">
        <path d="M10 190 Q10 200 50 200 Q90 200 90 190 L90 10 Q90 0 50 0 Q10 0 10 10 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y={200 - fillHeight} width="80" height={fillHeight} fill="#3b82f6" className="transition-height duration-300 ease-in-out"/>
        <circle cx="30" cy="170" r="5" fill="#60a5fa" className="bubble opacity-0 transition-opacity" style={{ animationDelay: '0.2s' }} />
        <circle cx="70" cy="160" r="4" fill="#60a5fa" className="bubble opacity-0 transition-opacity" style={{ animationDelay: '0.4s' }} />
      </svg>
    </div>
  );
}

export default function App() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(activityLevels[0]);
  const [climate, setClimate] = useState(climates[0]);
  const [glassSize, setGlassSize] = useState(glassSizes[0]);
  const [intake, setIntake] = useState(0);
  const [lastIntake, setLastIntake] = useState(Date.now());
  const [goal, setGoal] = useState(calculateHydrationGoal(weight, activity, climate));

  useEffect(() => {
    setGoal(calculateHydrationGoal(weight, activity, climate));
  }, [weight, activity, climate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastIntake > 3600000 && intake < goal) {
        alert("Remember to drink water!");
        setLastIntake(Date.now());
      }
    }, 3600000);
    return () => clearInterval(timer);
  }, [lastIntake, intake, goal]);

  const addWater = () => {
    setIntake(prev => Math.min(prev + glassSize, goal));
    setLastIntake(Date.now());
  };

  const resetIntake = () => {
    setIntake(0);
    setLastIntake(Date.now());
  };

  const percentage = Math.min((intake / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Hydration Tracker</CardTitle>
          <CardDescription>Track your water intake</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Select value={activity} onValueChange={setActivity}>
              {activityLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
            </Select>
            <Select value={climate} onValueChange={setClimate}>
              {climates.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </Select>
            <Select value={glassSize} onValueChange={setGlassSize}>
              {glassSizes.map(size => <SelectItem key={size} value={size}>{size} ml</SelectItem>)}
            </Select>
          </div>
          <WaterGlass fillPercentage={percentage} />
          <Progress value={percentage} className="h-4 rounded-full" />
          <div className="text-center">
            <p>Consumed: {intake}ml / Goal: {goal}ml</p>
            {percentage >= 50 && percentage < 100 && <p>Halfway to Goal!</p>}
            {percentage === 100 && <p>Goal Reached! Well done!</p>}
          </div>
          <div className="flex justify-between">
            <Button onClick={addWater}>Drink {glassSize}ml</Button>
            <Button onClick={resetIntake} variant="destructive">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}