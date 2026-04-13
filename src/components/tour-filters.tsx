'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const tourCategories = ["Приключение", "Культура", "Еда", "Для всей семьи", "Обзорная"];
const tourDurations = ["До 4 часов", "1 день", "2-3 дня", "Более 3 дней"];

export function TourFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры туров</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Категории</h4>
          <div className="space-y-2">
            {tourCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category}`} />
                <Label htmlFor={`category-${category}`} className="cursor-pointer font-normal">{category}</Label>
              </div>
            ))}
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
                   <span className="text-sm text-muted-foreground ml-1">& выше</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Продолжительность</h4>
          <div className="space-y-2">
            {tourDurations.map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox id={`duration-${duration}`} />
                <Label htmlFor={`duration-${duration}`} className="cursor-pointer font-normal">{duration}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Цена</h4>
          <Slider defaultValue={[5000]} max={15000} step={500} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>BYN 0</span>
            <span>BYN 15000+</span>
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
