import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon: Icon, title, description, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-card rounded-xl p-6 lg:p-8 shadow-card hover:shadow-elegant transition-smooth border border-border"
    >
      <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
        <Icon className="h-7 w-7 text-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <Button variant="ghost" className="text-accent hover:text-accent/80 p-0">
        Learn More →
      </Button>
    </motion.div>
  );
};

export default ServiceCard;
