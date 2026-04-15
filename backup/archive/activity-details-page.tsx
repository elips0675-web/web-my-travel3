'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ActivityDetailsPageContent({ slug }: { slug: string }) {
    return (
        <div className="container mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold">Страница в разработке</h1>
            <p className="text-muted-foreground mt-2">Подробная информация о развлечении (slug: {slug}) скоро появится здесь.</p>
            <Button asChild className="mt-4">
                <Link href="/activities">Вернуться к списку</Link>
            </Button>
        </div>
    );
}
