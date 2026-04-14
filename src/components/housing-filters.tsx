'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const accommodationTypes = ["Отель", "Апартаменты", "Хостел", "Гостевой дом", "Агротуризм"];
const amenities = ["Wi-Fi", "Бассейн", "Парковка", "Кондиционер", "Кухня", "Для животных"];

export function HousingFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Цена за ночь</h4>
          <Slider defaultValue={[5000]} max={20000} step={500} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>BYN 0</span>
            <span>BYN 20000+</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Рейтинг</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  {Array(5 - rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-muted-foreground/20" />
                  ))}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Тип жилья</h4>
          <div className="space-y-2">
            {accommodationTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`type-${type}`} />
                <Label htmlFor={`type-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Удобства</h4>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox id={`amenity-${amenity}`} />
                <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer font-normal">{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
