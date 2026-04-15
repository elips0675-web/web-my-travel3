'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Plane } from "lucide-react";

export default function NotificationsPageContent() {
  const notifications = [
    { id: 1, title: 'Ваш маршрут в Париж обновлен!', description: 'Добавлено новое место: Музей Орсе.', date: '2 часа назад', read: false },
    { id: 2, title: 'Специальное предложение!', description: 'Скидка 15% на туры в Италию на следующей неделе.', date: '1 день назад', read: false },
    { id: 3, title: 'Ваш отзыв опубликован', description: 'Спасибо, что поделились впечатлениями о туре "Замки Мира и Несвижа".', date: '3 дня назад', read: true },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Уведомления</CardTitle>
          <CardDescription>Здесь вы найдете все важные обновления по вашим поездкам и предложениям.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg ${!notification.read ? 'bg-secondary' : ''}`}>
                  <div className="p-2 bg-primary/10 rounded-full mt-1">
                     <BellRing className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                  </div>
                  {!notification.read && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2"></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Пока нет уведомлений</h3>
                <p className="mt-2 text-sm text-muted-foreground">Все обновления будут появляться здесь.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
