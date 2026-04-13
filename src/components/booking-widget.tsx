'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingWidgetProps {
    price: string;
    priceType: 'чел.' | 'ночь' | 'сутки';
    showDatePicker?: 'single' | 'range';
    showGuests?: boolean;
}

export function BookingWidget({ price, priceType, showDatePicker, showGuests }: BookingWidgetProps) {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<Date | undefined>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const renderDatePicker = () => {
        if (!showDatePicker) return null;

        if (showDatePicker === 'single') {
            return (
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal mt-2">
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {date ? format(date, 'd LLL, y', { locale: ru }) : "Выберите дату"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={ru}
                        />
                    </PopoverContent>
                </Popover>
            )
        }

        return (
             <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                            <>
                                {format(dateRange.from, "d LLL", { locale: ru })} -{" "}
                                {format(dateRange.to, "d LLL, y", { locale: ru })}
                            </>
                            ) : (
                            format(dateRange.from, "d LLL, y", { locale: ru })
                            )
                        ) : (
                            <span>Выберите даты</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={ru}
                    />
                </PopoverContent>
            </Popover>
        )
    }

    const renderGuestPicker = () => {
        if (!showGuests) return null;
        return (
             <div>
                <Label className="font-semibold mb-2 block">Гости</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                            {adults} взрослый, {children} ребенок
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className='font-medium'>Взрослые</p>
                                    <p className='text-sm text-muted-foreground'>От 13 лет</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(v => Math.max(1, v - 1))}><Minus className="h-4 w-4" /></Button>
                                    <span className="font-bold w-4 text-center">{adults}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(v => v + 1)}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className='font-medium'>Дети</p>
                                    <p className='text-sm text-muted-foreground'>До 12 лет</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(v => Math.max(0, v - 1))}><Minus className="h-4 w-4" /></Button>
                                    <span className="font-bold w-4 text-center">{children}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(v => v + 1)}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    return (
        <Card className="sticky top-24 shadow-xl">
            <CardHeader>
                <div>
                    <span className="text-muted-foreground text-sm">От </span>
                    <span className="font-bold text-3xl">{price}</span>
                    <span className="text-muted-foreground text-sm"> / {priceType}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {showDatePicker && (
                    <div>
                        <Label className="font-semibold">Дата</Label>
                        {renderDatePicker()}
                    </div>
                )}
                {showDatePicker && showGuests && <Separator />}
                {renderGuestPicker()}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
                <Button size="lg" className="w-full">Запросить бронирование</Button>
                <p className="text-xs text-muted-foreground text-center">С вас пока не будет взиматься плата</p>
            </CardFooter>
        </Card>
    );
}