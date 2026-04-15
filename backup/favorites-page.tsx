'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";

// Mock data for favorites
const favoriteTours = [
  { id: 1, name: "Гранд-тур по Европе", category: "Тур" },
  { id: 2, name: "Сокровища Азии", category: "Тур" },
];

const favoriteHousing = [
  { id: 1, name: "Гранд-отель «Европа»", category: "Жилье" },
];

const favoriteRestaurants = [
  { id: 1, name: "White Rabbit", category: "Ресторан" },
  { id: 2, name: "Кафе Пушкинъ", category: "Ресторан" },
];

function FavoriteItem({ name, category }: { name: string, category: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{category}</p>
            </div>
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        </div>
    )
}

export default function FavoritesPageContent() {
    const allFavorites = [...favoriteTours, ...favoriteHousing, ...favoriteRestaurants];
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight">Избранное</h1>
        <p className="text-muted-foreground mt-2">Все, что вы сохранили, в одном месте.</p>
      </header>

    <Tabs defaultValue="all">
        <TabsList className="mb-6">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="tours">Туры</TabsTrigger>
            <TabsTrigger value="housing">Жилье</TabsTrigger>
            <TabsTrigger value="restaurants">Рестораны</TabsTrigger>
        </TabsList>
        
        <div className="space-y-4">
            <TabsContent value="all">
                {allFavorites.length > 0 ? (
                     <div className="space-y-4">
                        {allFavorites.map(item => <FavoriteItem key={`${item.category}-${item.id}`} name={item.name} category={item.category} />)}
                    </div>
                ) : (
                    <p>У вас пока нет ничего в избранном.</p>
                )}
            </TabsContent>
             <TabsContent value="tours">
                {favoriteTours.length > 0 ? (
                     <div className="space-y-4">
                        {favoriteTours.map(item => <FavoriteItem key={`${item.category}-${item.id}`} name={item.name} category={item.category} />)}
                    </div>
                ) : (
                    <p>Нет избранных туров.</p>
                )}
            </TabsContent>
            <TabsContent value="housing">
                 {favoriteHousing.length > 0 ? (
                     <div className="space-y-4">
                        {favoriteHousing.map(item => <FavoriteItem key={`${item.category}-${item.id}`} name={item.name} category={item.category} />)}
                    </div>
                ) : (
                    <p>Нет избранного жилья.</p>
                )}
            </TabsContent>
            <TabsContent value="restaurants">
                 {favoriteRestaurants.length > 0 ? (
                    <div className="space-y-4">
                        {favoriteRestaurants.map(item => <FavoriteItem key={`${item.category}-${item.id}`} name={item.name} category={item.category} />)}
                    </div>
                ) : (
                    <p>Нет избранных ресторанов.</p>
                )}
            </TabsContent>
        </div>
    </Tabs>

    </div>
  );
}
