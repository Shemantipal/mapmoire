"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Place = {
  name: string;
  mood: string;
  emoji: string;
  story: string;
};

export function PlaceStoryCard({ place }: { place: Place }) {
  return (
    <motion.div
      key={place.name}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border-white/10 bg-zinc-950/80 text-white shadow-2xl backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-pink-500/20 text-pink-200 hover:bg-pink-500/20">
              Current Story Pin
            </Badge>
            <span className="text-4xl">{place.emoji}</span>
          </div>

          <CardTitle className="text-3xl">{place.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <Badge variant="secondary" className="bg-white/10 text-zinc-200">
            Mood: {place.mood}
          </Badge>

          <p className="mt-5 leading-7 text-zinc-200">{place.story}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}