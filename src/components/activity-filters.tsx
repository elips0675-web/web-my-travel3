'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const activityTypes = ["VR", "Квест", "Боулинг", "Картинг", "Настольные игры", "Для детей", "Рыбалка"];
const audienceTypes = ["Для двоих", "Для компании", "Для семьи"];
const locationTypes = ["В помещении", "На открытом воздухе"];

export function ActivityFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Тип развлечения</h4>
          <div className="space-y-2">
            {activityTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`type-${type}`} />
                <Label htmlFor={`type-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Для кого</h4>
          <div className="space-y-2">
            {audienceTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`audience-${type}`} />
                <Label htmlFor={`audience-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Место проведения</h4>
          <div className="space-y-2">
            {locationTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`location-${type}`} />
                <Label htmlFor={`location-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Цена за человека</h4>
          <Slider defaultValue={[40]} max={100} step={5} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>BYN 0</span>
            <span>BYN 100+</span>
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
