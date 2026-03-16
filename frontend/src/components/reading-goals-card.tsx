import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { 
  Target, 
  Trophy, 
  TrendingUp,
  Calendar,
  BookOpen,
  Edit3,
  Check,
  X,
  Flame,
  Star
} from 'lucide-react';

interface ReadingGoalsCardProps {
  weeklyGoal: { target: number; current: number };
  readingStreak: number;
  onGoalUpdate: (goal: { target: number; current: number }) => void;
}

export function ReadingGoalsCard({ weeklyGoal, readingStreak, onGoalUpdate }: ReadingGoalsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(weeklyGoal.target.toString());

  const handleSaveGoal = () => {
    const target = parseInt(newTarget);
    if (target > 0 && target <= 50) {
      onGoalUpdate({ ...weeklyGoal, target });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setNewTarget(weeklyGoal.target.toString());
    setIsEditing(false);
  };

  const progressPercentage = Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100);
  const isGoalComplete = weeklyGoal.current >= weeklyGoal.target;

  const streakMilestones = [
    { days: 7, title: "Week Warrior", emoji: "⚡" },
    { days: 14, title: "Two Week Champion", emoji: "🔥" },
    { days: 30, title: "Month Master", emoji: "🏆" },
    { days: 90, title: "Quarter Conqueror", emoji: "👑" },
    { days: 365, title: "Year Legend", emoji: "🌟" }
  ];

  const getCurrentMilestone = () => {
    return streakMilestones
      .reverse()
      .find(milestone => readingStreak >= milestone.days) || streakMilestones[0];
  };

  const getNextMilestone = () => {
    return streakMilestones
      .find(milestone => readingStreak < milestone.days);
  };

  const currentMilestone = getCurrentMilestone();
  const nextMilestone = getNextMilestone();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-card border-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Reading Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium">Weekly Goal</span>
              </div>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveGoal}
                    className="h-8 w-8 p-0 text-green-600"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-20 h-8 text-sm"
                  min="1"
                  max="50"
                />
                <span className="text-sm text-muted-foreground">books per week</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {weeklyGoal.current} of {weeklyGoal.target} books
                  </span>
                  <span className="font-medium">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ originX: 0 }}
                >
                  <Progress 
                    value={progressPercentage} 
                    className={`h-2 ${isGoalComplete ? 'bg-green-100' : ''}`}
                  />
                </motion.div>
                
                {isGoalComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                  >
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">Goal completed! 🎉</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Reading Streak */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Reading Streak</span>
            </div>
            
            <div className="text-center space-y-2">
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                {readingStreak}
              </motion.div>
              <p className="text-sm text-muted-foreground">days in a row</p>
              
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                {currentMilestone.emoji} {currentMilestone.title}
              </Badge>
            </div>

            {nextMilestone && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next milestone</span>
                  <span className="font-medium">
                    {nextMilestone.days - readingStreak} days to go
                  </span>
                </div>
                <Progress 
                  value={(readingStreak / nextMilestone.days) * 100} 
                  className="h-1"
                />
                <p className="text-xs text-center text-muted-foreground">
                  {nextMilestone.emoji} {nextMilestone.title}
                </p>
              </div>
            )}
          </div>

          {/* Monthly Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">January Progress</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isRead = day <= 24; // Mock data: read 24 days
                const isToday = day === 25; // Mock today
                
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.01 }}
                    className={`aspect-square rounded-sm text-xs flex items-center justify-center font-medium ${
                      isToday
                        ? 'bg-primary text-primary-foreground'
                        : isRead
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {day}
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Read</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span>Missed</span>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5"
          >
            <div className="text-center">
              <Star className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm italic text-muted-foreground">
                "A reader lives a thousand lives before he dies... The man who never reads lives only one."
              </p>
              <p className="text-xs text-muted-foreground mt-1">- George R.R. Martin</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}