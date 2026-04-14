'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const transportCategories = ["Каршеринг", "Такси", "Велосипеды", "Самокаты"];
const carTypes = ["Компакт", "Эконом", "Седан", "SUV", "Премиум"];
const transmissionTypes = ["Автомат", "Механика"];
const seatOptions = ["2-4 места", "5 мест", "7+ мест"];

export function RentalCarFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Тип транспорта</h4>
          <div className="space-y-2">
            {transportCategories.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`type-${type}`} />
                <Label htmlFor={`type-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Класс автомобиля</h4>
          <div className="space-y-2">
            {carTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`car-type-${type}`} />
                <Label htmlFor={`car-type-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Коробка передач</h4>
          <div className="space-y-2">
            {transmissionTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`transmission-${type}`} />
                <Label htmlFor={`transmission-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Количество мест</h4>
          <div className="space-y-2">
            {seatOptions.map((seats) => (
                <div key={seats} className="flex items-center space-x-2">
                <Checkbox id={`seats-${seats}`} />
                <Label htmlFor={`seats-${seats}`} className="cursor-pointer font-normal">{seats}</Label>
                </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Цена</h4>
          <Slider defaultValue={[4000]} max={10000} step={500} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>BYN 0</span>
            <span>BYN 10000+</span>
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
