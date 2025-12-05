import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Heart
} from "lucide-react";

export function DesignShowcase() {
  const [progress, setProgress] = useState(75);

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                Citizen Trust Design Showcase
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                Complete design system and component library
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="components">
              <Layout className="h-4 w-4 mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger value="animations">
              <Zap className="h-4 w-4 mr-2" />
              Animations
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Primary Color Palette
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="h-24 rounded-xl bg-[#071f35] mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Navy Dark</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">#071f35</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">Headers, Typography</div>
                </div>
                <div>
                  <div className="h-24 rounded-xl bg-[#24496b] mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Navy Medium</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">#24496b</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">Primary Buttons</div>
                </div>
                <div>
                  <div className="h-24 rounded-xl bg-[#446d92] mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Blue Medium</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">#446d92</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">Accents, Links</div>
                </div>
                <div>
                  <div className="h-24 rounded-xl bg-[#98b1c8] mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Blue Light</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">#98b1c8</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">Borders, Dividers</div>
                </div>
                <div>
                  <div className="h-24 rounded-xl bg-[#f7fafe] border border-navy-medium/20 mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Blue Lightest</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">#f7fafe</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">Page Background</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Semantic Colors
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-20 rounded-xl bg-green-500 mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Success</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">Completed, Verified</div>
                </div>
                <div>
                  <div className="h-20 rounded-xl bg-blue-500 mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Info</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">Processing, Active</div>
                </div>
                <div>
                  <div className="h-20 rounded-xl bg-yellow-500 mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Warning</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">Pending, Review</div>
                </div>
                <div>
                  <div className="h-20 rounded-xl bg-red-500 mb-2 shadow-lg" />
                  <div className="text-sm font-medium text-navy-dark dark:text-white">Error</div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60">Failed, Rejected</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Gradient Combinations
              </h2>
              <div className="space-y-3">
                <div className="h-16 rounded-xl bg-gradient-to-r from-navy-dark to-navy-medium flex items-center justify-center text-white font-medium shadow-lg">
                  Primary Gradient
                </div>
                <div className="h-16 rounded-xl bg-gradient-to-r from-blue-medium to-navy-medium flex items-center justify-center text-white font-medium shadow-lg">
                  Secondary Gradient
                </div>
                <div className="h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-medium shadow-lg">
                  Success Gradient
                </div>
                <div className="h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium shadow-lg">
                  Accent Gradient
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-6">
                Typography Scale
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl text-navy-dark dark:text-white">
                    Hero / Page Title - 3xl
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    1.875rem / 30px • font-weight: 700
                  </div>
                </div>
                <div>
                  <div className="text-2xl text-navy-dark dark:text-white">
                    Section Heading - 2xl
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    1.5rem / 24px • font-weight: 600
                  </div>
                </div>
                <div>
                  <div className="text-xl text-navy-dark dark:text-white">
                    Subsection - xl
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    1.25rem / 20px • font-weight: 500
                  </div>
                </div>
                <div>
                  <div className="text-lg text-navy-dark dark:text-white">
                    Card Title - lg
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    1.125rem / 18px • font-weight: 500
                  </div>
                </div>
                <div>
                  <div className="text-base text-navy-dark dark:text-white">
                    Body Text - base
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    1rem / 16px • font-weight: 400
                  </div>
                </div>
                <div>
                  <div className="text-sm text-navy-dark dark:text-white">
                    Small Text - sm
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    0.875rem / 14px • font-weight: 400
                  </div>
                </div>
                <div>
                  <div className="text-xs text-navy-dark dark:text-white">
                    Tiny Text - xs
                  </div>
                  <div className="text-xs text-navy-medium/60 dark:text-white/60 mt-1">
                    0.75rem / 12px • font-weight: 400
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            {/* Buttons */}
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Button Styles
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-navy-medium to-blue-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Primary Button
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Outline Button
                </Button>
                <Button variant="ghost">
                  Ghost Button
                </Button>
                <Button disabled>
                  Disabled Button
                </Button>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Status Badges
              </h2>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0">
                  <Clock className="h-3 w-3 mr-1" />
                  Processing
                </Badge>
                <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-0">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
                <Badge variant="outline" className="border-navy-medium/20">
                  Required
                </Badge>
              </div>
            </Card>

            {/* Progress Bars */}
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Progress Indicators
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Application Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                    -10%
                  </Button>
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                    +10%
                  </Button>
                </div>
              </div>
            </Card>

            {/* Form Fields */}
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Form Elements
              </h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">
                    Input Field <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="demo-input"
                    placeholder="Enter your information"
                    className="h-12"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-6">
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Hover Effects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] cursor-pointer text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-medium text-navy-dark dark:text-white">Hover me!</div>
                    <div className="text-sm text-navy-medium/60 dark:text-white/60">Scale effect</div>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -8 }}
                  whileTap={{ y: 0 }}
                >
                  <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] cursor-pointer text-center">
                    <div className="text-3xl mb-2">⬆️</div>
                    <div className="font-medium text-navy-dark dark:text-white">Hover me!</div>
                    <div className="text-sm text-navy-medium/60 dark:text-white/60">Lift effect</div>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ rotate: 5 }}
                  whileTap={{ rotate: 0 }}
                >
                  <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] cursor-pointer text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <div className="font-medium text-navy-dark dark:text-white">Hover me!</div>
                    <div className="text-sm text-navy-medium/60 dark:text-white/60">Rotate effect</div>
                  </Card>
                </motion.div>
              </div>
            </Card>

            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Entrance Animations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
                    <div className="text-3xl mb-2">👋</div>
                    <div className="font-medium">Fade In Up</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center">
                    <div className="text-3xl mb-2">✨</div>
                    <div className="font-medium">Scale In</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white text-center">
                    <div className="text-3xl mb-2">➡️</div>
                    <div className="font-medium">Slide In</div>
                  </Card>
                </motion.div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-br from-navy-dark via-navy-medium to-blue-medium text-white border-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">6</div>
                <div className="text-sm opacity-80">Modern Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">15+</div>
                <div className="text-sm opacity-80">Components</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">4</div>
                <div className="text-sm opacity-80">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-80">Accessible</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
