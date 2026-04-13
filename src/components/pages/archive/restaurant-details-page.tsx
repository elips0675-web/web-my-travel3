'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RestaurantDetailsPageContent({ slug }: { slug: string }) {
    return (
        <div className="container mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold">Страница в разработке</h1>
            <p className="text-muted-foreground mt-2">Подробная информация о ресторане (slug: {slug}) скоро появится здесь.</p>
            <Button asChild className="mt-4">
                <Link href="/restaurants">Вернуться к поиску</Link>
            </Button>
        </div>
    );
}
