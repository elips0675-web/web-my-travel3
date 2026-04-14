'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const cuisineTypes = ["Итальянская", "Французская", "Японская", "Русская", "Азиатская", "Фаст-фуд"];
const features = ["Веранда", "Живая музыка", "Панорамный вид", "Для детей"];

export function RestaurantFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Тип кухни</h4>
          <div className="space-y-2">
            {cuisineTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`cuisine-${type}`} />
                <Label htmlFor={`cuisine-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Особенности</h4>
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={`feature-${feature}`} />
                <Label htmlFor={`feature-${feature}`} className="cursor-pointer font-normal">{feature}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Средний чек</h4>
          <Slider defaultValue={[150]} max={300} step={10} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>0 BYN</span>
            <span>300+ BYN</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Рейтинг</h4>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                   <span className="text-sm text-muted-foreground ml-1">и выше</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
