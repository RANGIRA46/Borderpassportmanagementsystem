import { ReactNode } from "react";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  illustration?: string;
  color?: string;
  badge?: string;
  onClick: () => void;
  popular?: boolean;
  estimated?: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  illustration,
  color = "from-navy-medium to-blue-medium",
  badge,
  onClick,
  popular,
  estimated,
  className = ""
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        onClick={onClick}
        className="group relative overflow-hidden cursor-pointer border-navy-medium/10 dark:border-white/10 hover:border-navy-medium/30 dark:hover:border-blue-500/50 transition-all duration-300 bg-white dark:bg-[#1E1E1E] shadow-sm hover:shadow-xl h-full"
      >
        {/* Background Gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />

        {/* Popular Badge */}
        {popular && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Popular
            </Badge>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6 relative z-10">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${color} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
            <div className="text-white">
              {icon}
            </div>
          </div>

          {/* Illustration */}
          {illustration && (
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <img src={illustration} alt="" className="h-20 w-20 object-contain" />
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl mb-2 text-navy-dark dark:text-white group-hover:text-navy-medium dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-navy-medium/70 dark:text-white/60 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {estimated ? (
              <div className="text-xs text-navy-medium/60 dark:text-white/50">
                Est. {estimated}
              </div>
            ) : (
              <div />
            )}

            {/* Arrow */}
            <div className="flex items-center gap-1 text-sm text-navy-medium dark:text-blue-400 group-hover:gap-2 transition-all">
              <span className="hidden sm:inline">Get Started</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {badge && (
            <Badge variant="outline" className="mt-3 text-xs border-navy-medium/20 dark:border-white/20">
              {badge}
            </Badge>
          )}
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 border-2 border-transparent group-hover:border-navy-medium/20 dark:group-hover:border-blue-500/30 rounded-lg transition-all pointer-events-none`} />
      </Card>
    </motion.div>
  );
}
