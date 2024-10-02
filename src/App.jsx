import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Toast } from "@/components/ui/toast";

// Water Glass Component
const WaterGlass = ({ level, color, glassSize }) => {
  const baseWidth = glassSize * 0.5; // Base width as a fraction of glass size
  const baseHeight = glassSize === 200? glassSize * 0.55 : glassSize === 300? glassSize * 0.65 : glassSize * 0.75; // Base height as a fraction of glass size
  const scaleFactor = Math.cbrt(glassSize / 200); // Optional scale factor for future adjustments
  const width = baseWidth * scaleFactor;
  const height = baseHeight * scaleFactor;

  return (
    <svg className="w-32 h-48 mx-auto mb-4" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id="glass-mask">
          <path d={`M${width * 0.1} ${height * 0.067} L${width * 0.9} ${height * 0.067} L${width * 0.8} ${height * 0.933} Q${width * 0.8} ${height} ${width * 0.7} ${height} L${width * 0.3} ${height} Q${width * 0.2} ${height} ${width * 0.2} ${height * 0.933} Z`} />
        </clipPath>
      </defs>
      <path
        d={`M${width * 0.1} ${height * 0.067} L${width * 0.9} ${height * 0.067} L${width * 0.8} ${height * 0.933} Q${width * 0.8} ${height} ${width * 0.7} ${height} L${width * 0.3} ${height} Q${width * 0.2} ${height} ${width * 0.2} ${height * 0.933} Z`}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={width * 0.04}
      />
      <g clipPath="url(#glass-mask)">
        <rect
          x="0"
          y={height - (level * height) / 100}
          width={width}
          height={(level * height) / 100}
          fill={color}
          className="transition-all duration-1000 ease-in-out"
        />
        <circle className="bubble" cx={width * 0.3} cy={height * 0.8} r={width * 0.02} fill="white" opacity="0.7">
          <animate attributeName="cy" from={height * 0.8} to={height * 0.133} dur="3s" repeatCount="indefinite" />
        </circle>
        <circle className="bubble" cx={width * 0.7} cy={height * 0.933} r={width * 0.03} fill="white" opacity="0.7">
          <animate attributeName="cy" from={height * 0.933} to={height * 0.267} dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
};


// Achievement Component
const Achievement = ({ title, unlocked }) => (
  <div className={`p-2 rounded-lg text-center ${unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
    {title}
  </div>
);

// Main Water Tracker Component
const WaterTracker = () => {
  const [goal, setGoal] = useState(2000);
  const [consumed, setConsumed] = useState(0);
  const [glassSize, setGlassSize] = useState(200);
  const [lastDrink, setLastDrink] = useState(Date.now());
  const [showReminder, setShowReminder] = useState(false);
  const [achievements, setAchievements] = useState({
    halfway: false,
    goalReached: false,
  });

  // New states for personalization
  const [weight, setWeight] = useState(70); // default weight
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [climate, setClimate] = useState("moderate");

  useEffect(() => {
    // Calculate personalized goal based on weight, activity level, and climate
    const baseIntake = weight * 30; // ml per kg
    let extraIntake = 0;

    switch (activityLevel) {
      case "lightly_active":
        extraIntake = 500;
        break;
      case "moderately_active":
        extraIntake = 1000;
        break;
      case "very_active":
        extraIntake = 1500;
        break;
      default:
        break;
    }

    switch (climate) {
      case "hot":
        extraIntake += 500;
        break;
      case "moderate":
        extraIntake += 250;
        break;
      default:
        break;
    }

    setGoal(baseIntake + extraIntake);
  }, [weight, activityLevel, climate]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastDrink > 3600000 && consumed < goal) {
        setShowReminder(true);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [lastDrink, consumed, goal]);

  useEffect(() => {
    const resetDaily = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setConsumed(0);
        setAchievements({ halfway: false, goalReached: false });
      }
    }, 60000);

    return () => clearInterval(resetDaily);
  }, []);

  useEffect(() => {
    if (consumed >= goal / 2 && !achievements.halfway) {
      setAchievements(prev => ({ ...prev, halfway: true }));
    }
    if (consumed >= goal && !achievements.goalReached) {
      setAchievements(prev => ({ ...prev, goalReached: true }));
    }
  }, [consumed, goal, achievements]);

  const addWater = () => {
    const newConsumed = Math.min(consumed + glassSize, goal);
    setConsumed(newConsumed);
    setLastDrink(Date.now());
    setShowReminder(false);
  };

  const reset = () => {
    setConsumed(0);
    setAchievements({ halfway: false, goalReached: false });
  };

  const percentage = (consumed / goal) * 100;
  const waterColor = `hsl(210, 100%, ${100 - percentage * 0.5}%)`;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-blue-600">
          Daily Water Intake Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
          <Select onValueChange={setActivityLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1).replace(/_/g, ' ')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="lightly_active">Lightly Active</SelectItem>
              <SelectItem value="moderately_active">Moderately Active</SelectItem>
              <SelectItem value="very_active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
          <Select onValueChange={setClimate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={climate.charAt(0).toUpperCase() + climate.slice(1)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cool">Cool</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Glass Size (ml)</label>
          <Select onValueChange={(value) => setGlassSize(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={glassSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="200">200 ml</SelectItem>
              <SelectItem value="300">300 ml</SelectItem>
              <SelectItem value="500">500 ml</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <WaterGlass level={percentage} color={waterColor} glassSize={glassSize} />
        <Progress value={percentage} />
        <div className="flex justify-between my-4">
          <span className="font-semibold">Consumed: {consumed} ml</span>
          <span className="font-semibold">Goal: {goal} ml</span>
        </div>
        <Button onClick={addWater} className="w-full mb-2">
          Add Glass of Water
        </Button>
        <Button onClick={reset} className="w-full" variant="destructive">
          Reset Daily Intake
        </Button>
      </CardContent>
      <CardFooter className='flex justify-around items-center'>
        {achievements.halfway && <Achievement title="Halfway to Goal!" unlocked />}
        {achievements.goalReached && <Achievement title="Goal Reached!" unlocked />}
      </CardFooter>
      {showReminder && (
        <Toast title="Reminder!" description="It's time to drink water!" />
      )}
    </Card>
  );
};


export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <WaterTracker />
    </div>
  );
}