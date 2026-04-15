'use client';

import { useState, useMemo } from 'react';
import { Search, Star, MapPin, Clock, Users, Filter, X, ChevronDown, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Иконки
const Icons = {
    Tour: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Coffee: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    Gamepad: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>,
    Car: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>,
};

// Мок-данные
const mockData = [
    // Туры
    { id: 1, category: 'tours', title: 'Горный поход на Эльбрус', type: 'Экстрим', price: 25000, duration: '3 дня', rating: 4.8, location: 'Кабардино-Балкария', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', seats: 12 },
    { id: 2, category: 'tours', title: 'Золотое кольцо России', type: 'Культурный', price: 15000, duration: '5 дней', rating: 4.6, location: 'Центральная Россия', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400', seats: 20 },
    { id: 3, category: 'tours', title: 'Байкал зимой', type: 'Природа', price: 35000, duration: '7 дней', rating: 4.9, location: 'Иркутск', image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400', seats: 8 },
    { id: 4, category: 'tours', title: 'Камчатка: земля медведей', type: 'Экстрим', price: 85000, duration: '10 дней', rating: 5.0, location: 'Камчатка', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', seats: 6 },
    
    // Жильё
    { id: 5, category: 'accommodation', title: 'Отель "Астория"', type: 'Отель', price: 8000, rating: 4.7, location: 'Санкт-Петербург', amenities: ['WiFi', 'SPA', 'Бассейн'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rooms: 2 },
    { id: 6, category: 'accommodation', title: 'Уютный лофт в центре', type: 'Апартаменты', price: 4500, rating: 4.5, location: 'Москва', amenities: ['WiFi', 'Кухня', 'Кондиционер'], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', rooms: 1 },
    { id: 7, category: 'accommodation', title: 'Эко-дом у озера', type: 'Дом', price: 12000, rating: 4.9, location: 'Карелия', amenities: ['WiFi', 'Баня', 'Барбекю'], image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400', rooms: 3 },
    { id: 8, category: 'accommodation', title: 'Хостел "Встреча"', type: 'Хостел', price: 1200, rating: 4.2, location: 'Казань', amenities: ['WiFi', 'Кухня'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', rooms: 1 },
    
    // Кафе
    { id: 9, category: 'cafes', title: 'Coffee Like', type: 'Кофейня', price: 500, cuisine: 'Европейская', rating: 4.4, location: 'Москва', features: ['WiFi', 'Рабочее место', 'Завтрак'], image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
    { id: 10, category: 'cafes', title: 'Хачапурная №1', type: 'Ресторан', price: 1500, cuisine: 'Грузинская', rating: 4.7, location: 'Санкт-Петербург', features: ['Живая музыка', 'Бизнес-ланч'], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
    { id: 11, category: 'cafes', title: 'Сыроварня', type: 'Ресторан', price: 2500, cuisine: 'Русская', rating: 4.8, location: 'Суздаль', features: ['Панорамный вид', 'Дегустация'], image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    { id: 12, category: 'cafes', title: 'Street Food Market', type: 'Фуд-корт', price: 800, cuisine: 'Разная', rating: 4.3, location: 'Екатеринбург', features: ['Быстро', 'Дешево'], image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400' },
    
    // Развлечения
    { id: 13, category: 'entertainment', title: 'Картинг "Скорость"', type: 'Активный отдых', price: 2000, duration: '1 час', rating: 4.6, location: 'Москва', ageGroup: '12+', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400' },
    { id: 14, category: 'entertainment', title: 'Квест "Тайна да Винчи"', type: 'Квест', price: 3500, duration: '1.5 часа', rating: 4.8, location: 'Казань', ageGroup: '16+', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400' },
    { id: 15, category: 'entertainment', title: 'Океанариум', type: 'Экскурсия', price: 1200, duration: '2 часа', rating: 4.5, location: 'Сочи', ageGroup: '0+', image: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=400' },
    { id: 16, category: 'entertainment', title: 'Парашютный клуб', type: 'Экстрим', price: 15000, duration: '3 часа', rating: 4.9, location: 'Тула', ageGroup: '18+', image: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=400' },
    
    // Авто
    { id: 17, category: 'cars', title: 'Toyota Camry', type: 'Седан', price: 3500, transmission: 'Автомат', seats: 5, rating: 4.6, location: 'Москва', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' },
    { id: 18, category: 'cars', title: 'Mercedes Sprinter', type: 'Минивэн', price: 8000, transmission: 'Механика', seats: 19, rating: 4.4, location: 'Санкт-Петербург', image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400' },
    { id: 19, category: 'cars', title: 'BMW X5', type: 'Внедорожник', price: 7000, transmission: 'Автомат', seats: 5, rating: 4.8, location: 'Сочи', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' },
    { id: 20, category: 'cars', title: 'Hyundai Solaris', type: 'Седан', price: 2200, transmission: 'Автомат', seats: 5, rating: 4.3, location: 'Казань', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400' }
];

// Конфигурация фильтров по категориям
const filterConfig = {
    tours: {
        fields: [
            { key: 'type', label: 'Тип тура', options: ['Экстрим', 'Культурный', 'Природа', 'Пляжный'] },
            { key: 'duration', label: 'Длительность', options: ['1-3 дня', '4-7 дней', '8+ дней'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 100000 }
        ]
    },
    accommodation: {
        fields: [
            { key: 'type', label: 'Тип жилья', options: ['Отель', 'Апартаменты', 'Дом', 'Хостел', 'Агротуризм'] },
            { key: 'amenities', label: 'Удобства', options: ['WiFi', 'Бассейн', 'SPA', 'Кухня', 'Баня', 'Барбекю'] },
            { key: 'priceRange', label: 'Цена за ночь', type: 'range', min: 0, max: 20000 }
        ]
    },
    cafes: {
        fields: [
            { key: 'cuisine', label: 'Кухня', options: ['Европейская', 'Грузинская', 'Русская', 'Азиатская', 'Разная'] },
            { key: 'features', label: 'Особенности', options: ['WiFi', 'Рабочее место', 'Живая музыка', 'Панорамный вид', 'Бизнес-ланч'] },
            { key: 'priceRange', label: 'Средний чек', type: 'range', min: 0, max: 5000 }
        ]
    },
    entertainment: {
        fields: [
            { key: 'type', label: 'Тип развлечения', options: ['Активный отдых', 'Квест', 'Экскурсия', 'Экстрим', 'Рыбалка'] },
            { key: 'ageGroup', label: 'Возраст', options: ['0+', '6+', '12+', '16+', '18+'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 20000 }
        ]
    },
    cars: {
        fields: [
            { key: 'type', label: 'Тип авто', options: ['Седан', 'Внедорожник', 'Минивэн', 'Кроссовер'] },
            { key: 'transmission', label: 'Коробка', options: ['Автомат', 'Механика'] },
            { key: 'priceRange', label: 'Цена в сутки', type: 'range', min: 0, max: 15000 }
        ]
    }
};

const categoryLabels = {
    tours: { label: 'Туры', icon: Icons.Tour, color: 'bg-blue-500' },
    accommodation: { label: 'Жильё', icon: Icons.Home, color: 'bg-green-500' },
    cafes: { label: 'Кафе', icon: Icons.Coffee, color: 'bg-orange-500' },
    entertainment: { label: 'Развлечения', icon: Icons.Gamepad, color: 'bg-purple-500' },
    cars: { label: 'Авто', icon: Icons.Car, color: 'bg-red-500' }
};

// Компонент рейтинга
const Rating = ({ value }: { value: number }) => (
    <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="font-semibold text-gray-700">{value}</span>
    </div>
);

// Компонент карточки
const Card = ({ item }: { item: any }) => {
    const config = categoryLabels[item.category as keyof typeof categoryLabels];
    const Icon = config.icon;
    
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-enter group">
            <div className="relative h-48 overflow-hidden">
                <Image 
                    src={item.image} 
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 ${config.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                    <Icon />
                    {config.label}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                    <Rating value={item.rating} />
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    {item.type && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {item.type}
                        </span>
                    )}
                    {item.duration && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                        </span>
                    )}
                    {item.seats && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {item.seats} мест
                        </span>
                    )}
                    {item.amenities && item.amenities.slice(0, 2).map((a: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {a}
                        </span>
                    ))}
                    {item.cuisine && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {item.cuisine}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-2xl font-bold text-indigo-600">{item.price}</span>
                        <span className="text-gray-400 text-sm"> BYN</span>
                        {item.category === 'accommodation' && <span className="text-gray-400 text-sm">/ночь</span>}
                        {item.category === 'cars' && <span className="text-gray-400 text-sm">/сутки</span>}
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};

// Компонент фильтра
const FilterSection = ({ category, filters, onFilterChange, activeFilters }: { category: string, filters: any, onFilterChange: any, activeFilters: any }) => {
    const config = filterConfig[category as keyof typeof filterConfig];
    if (!config) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${categoryLabels[category as keyof typeof categoryLabels].color}`}></span>
                {categoryLabels[category as keyof typeof categoryLabels].label}
            </h3>
            
            {config.fields.map(field => (
                <div key={field.key} className="mb-4 last:mb-0">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                        {field.label}
                    </label>
                    
                    {field.type === 'range' ? (
                        <div>
                            <input
                                type="range"
                                min={field.min}
                                max={field.max}
                                step={1000}
                                value={activeFilters[category]?.[field.key] || field.max}
                                onChange={(e) => onFilterChange(category, field.key, parseInt(e.target.value))}
                                className="range-slider mb-2"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{field.min} BYN</span>
                                <span className="font-medium text-indigo-600">
                                    До {activeFilters[category]?.[field.key] || field.max} BYN
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {field.options.map(option => {
                                const isActive = activeFilters[category]?.[field.key]?.includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            const current = activeFilters[category]?.[field.key] || [];
                                            const updated = isActive 
                                                ? current.filter((o: string) => o !== option)
                                                : [...current, option];
                                            onFilterChange(category, field.key, updated);
                                        }}
                                        className={cn('filter-chip px-3 py-1.5 rounded-full text-sm font-medium transition-all', {
                                            'bg-indigo-600 text-white shadow-md': isActive,
                                            'bg-gray-100 text-gray-600 hover:bg-gray-200': !isActive,
                                        })}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Главный компонент
export default function MultiFilterContent() {
    const [selectedCategories, setSelectedCategories] = useState(['tours']);
    const [activeFilters, setActiveFilters] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Переключение категории
    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.length > 1 ? prev.filter(c => c !== category) : prev;
            }
            return [...prev, category];
        });
    };

    // Изменение фильтра
    const handleFilterChange = (category: string, field: string, value: any) => {
        setActiveFilters((prev: any) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    // Сброс фильтров
    const resetFilters = () => {
        setActiveFilters({});
        setSearchQuery('');
    };

    const newRouteParams = new URLSearchParams();
    selectedCategories.forEach(cat => newRouteParams.append('category', cat));
    if (searchQuery) {
        newRouteParams.append('destination', searchQuery);
    }

    // Фильтрация данных
    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            if (!selectedCategories.includes(item.category)) return false;
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.location.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            const categoryFilters = activeFilters[item.category];
            if (categoryFilters) {
                if (categoryFilters.priceRange && item.price > categoryFilters.priceRange) {
                    return false;
                }
                if (categoryFilters.type?.length > 0 && !categoryFilters.type.includes(item.type)) {
                    return false;
                }
                if (categoryFilters.cuisine?.length > 0 && !categoryFilters.cuisine.includes(item.cuisine)) {
                    return false;
                }
                if (categoryFilters.amenities?.length > 0) {
                    const hasAmenities = categoryFilters.amenities.every((a: string) => item.amenities?.includes(a));
                    if (!hasAmenities) return false;
                }
                if (categoryFilters.features?.length > 0) {
                    const hasFeatures = categoryFilters.features.every((f: string) => item.features?.includes(f));
                    if (!hasFeatures) return false;
                }
                if (categoryFilters.transmission?.length > 0 && !categoryFilters.transmission.includes(item.transmission)) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });
    }, [selectedCategories, activeFilters, searchQuery, sortBy]);

    // Подсчёт активных фильтров
    const activeFilterCount = useMemo(() => {
        let count = 0;
        Object.values(activeFilters).forEach((categoryFilters: any) => {
            Object.values(categoryFilters).forEach((value: any) => {
                if (Array.isArray(value) && value.length > 0) count++;
                else if (typeof value === 'number' && value < 100000) count++;
            });
        });
        return count;
    }, [activeFilters]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            TravelFinder
                        </h1>
                        <div className="flex items-center gap-2">
                            <Button asChild>
                                <Link href={`/routes/new?${newRouteParams.toString()}`}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Новый маршрут
                                </Link>
                            </Button>
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl font-medium"
                            >
                                <Filter className="w-5 h-5" />
                                Фильтры
                                {activeFilterCount > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            placeholder="Поиск по названию или пункту назначения..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 pb-4 mb-6">
                    {Object.entries(categoryLabels).map(([key, { label, icon: Icon, color }]) => {
                        const isActive = selectedCategories.includes(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleCategory(key)}
                                className={cn('category-btn flex items-center gap-2 px-6 py-3 rounded-2xl font-medium whitespace-nowrap', {
                                    'active text-white': isActive,
                                    'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200': !isActive,
                                })}
                            >
                                <Icon />
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside className={cn('lg:block lg:static lg:w-80 lg:bg-transparent lg:p-0', {
                        'fixed inset-0 z-50 bg-white p-4 overflow-auto': showMobileFilters,
                        'hidden': !showMobileFilters,
                    })}>
                        <div className="flex items-center justify-between mb-4 lg:hidden">
                            <h2 className="text-xl font-bold">Фильтры</h2>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        {selectedCategories.map(category => (
                            <FilterSection
                                key={category}
                                category={category}
                                filters={filterConfig[category as keyof typeof filterConfig]}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                            />
                        ))}
                        
                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="w-full py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                                Сбросить все фильтры
                            </button>
                        )}
                    </aside>

                    {/* Results */}
                    <main className="flex-1">
                        {/* Sort & Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Найдено <span className="font-bold text-gray-900">{filteredData.length}</span> вариантов
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Сортировка:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="rating">По рейтингу</option>
                                    <option value="price-asc">Сначала дешевле</option>
                                    <option value="price-desc">Сначала дороже</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        {filteredData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredData.map(item => (
                                    <Card key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Filter className="w-10 h-10 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Ничего не найдено</h3>
                                <p className="text-gray-500 mb-4">Попробуйте изменить параметры фильтров</p>
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
