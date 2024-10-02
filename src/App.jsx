import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  Button, Input, Select, Label, Progress 
} from "@/components/ui";
import { cn } from "@/lib/utils";

// Constants for hydration calculation
const BASE_HYDRATION_ML = 30;
const ACTIVITY_MULTIPLIER = { 
  Sedentary: 1, LightlyActive: 1.2, ModeratelyActive: 1.5, VeryActive: 1.7 
};
const CLIMATE_ADJUSTMENT = { Cool: 0.9, Moderate: 1, Hot: 1.1 };

function WaterGlass({ fillPercentage }) {
  const bubbleCount = 5;
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => (
    <div key={i} className="bubble" style={{ 
      '--i': i + 1, 
      '--left': `${Math.random() * 80}%`,
      animationDelay: `${Math.random() * 2}s`
    }}></div>
  ));

  return (
    <div className="relative w-24 h-48 bg-gray-200 rounded-xl overflow-hidden">
      <div className="absolute bottom-0 w-full" style={{ height: `${fillPercentage}%`, backgroundColor: '#3498db' }}></div>
      {bubbles}
    </div>
  );
}

function App() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState('ModeratelyActive');
  const [climate, setClimate] = useState('Moderate');
  const [glassSize, setGlassSize] = useState(200);
  const [intake, setIntake] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [goal, setGoal] = useState(calculateGoal());

  function calculateGoal() {
    const base = weight * BASE_HYDRATION_ML;
    const activityFactor = ACTIVITY_MULTIPLIER[activity];
    const climateFactor = CLIMATE_ADJUSTMENT[climate];
    return Math.round(base * activityFactor * climateFactor);
  }

  useEffect(() => {
    setGoal(calculateGoal());
  }, [weight, activity, climate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (new Date() - lastUpdated > 3600000) { // 1 hour in milliseconds
        alert('Remember to drink water!');
        setLastUpdated(new Date());
      }
    }, 3600000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const handleIntake = () => {
    setIntake(prev => prev + glassSize);
    setLastUpdated(new Date());
  };

  const resetIntake = () => {
    setIntake(0);
  };

  const fillPercentage = (intake / goal) * 100 || 0;
  const isGoalReached = intake >= goal;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Hydration Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WaterGlass fillPercentage={fillPercentage} />
          <Progress value={fillPercentage} className="w-full"/>
          <div>{`${intake}ml / ${goal}ml`}</div>
          <div>{isGoalReached ? 'Goal Reached!' : fillPercentage >= 50 ? 'Halfway to Goal!' : ''}</div>
          
          <Input type="number" label="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <Select onValueChange={setActivity} defaultValue={activity}>
            <Label>Activity Level</Label>
            {['Sedentary', 'LightlyActive', 'ModeratelyActive', 'VeryActive'].map((act) => (
              <option key={act} value={act}>{act.replace(/([A-Z])/g, ' $1')}</option>
            ))}
          </Select>
          <Select onValueChange={setClimate} defaultValue={climate}>
            <Label>Climate</Label>
            {['Cool', 'Moderate', 'Hot'].map((clim) => (
              <option key={clim} value={clim}>{clim}</option>
            ))}
          </Select>
          <Select onValueChange={setGlassSize} defaultValue={glassSize}>
            <Label>Glass Size</Label>
            {[200, 300, 500].map(size => <option key={size} value={size}>{size} ml</option>)}
          </Select>
          <Button onClick={handleIntake}>Drink!</Button>
          <Button variant="destructive" onClick={resetIntake}>Reset</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;