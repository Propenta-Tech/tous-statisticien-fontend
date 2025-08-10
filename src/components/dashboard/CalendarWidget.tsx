"use client"
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/context';
import { virtualClassService } from '@/lib/api/virtualClass';
import { evaluationService } from '@/lib/api/evaluation';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  type: 'class' | 'evaluation' | 'deadline' | 'meeting' | 'reminder';
  participants?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  color?: string;
}

interface CalendarWidgetProps {
  title?: string;
  description?: string;
  className?: string;
  showToday?: boolean;
  showNavigation?: boolean;
  maxEvents?: number;
  height?: number;
  loading?: boolean;
}

const eventTypeConfig = {
  class: {
    icon: <BookOpen className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    defaultColor: '#3b82f6',
  },
  evaluation: {
    icon: <Award className="w-4 h-4" />,
    color: 'bg-red-100 text-red-700 border-red-200',
    defaultColor: '#ef4444',
  },
  deadline: {
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    defaultColor: '#f59e0b',
  },
  meeting: {
    icon: <Users className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    defaultColor: '#10b981',
  },
  reminder: {
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    defaultColor: '#8b5cf6',
  },
};

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  title = "Calendrier",
  description = "Vos événements et échéances",
  className,
  showToday = true,
  showNavigation = true,
  maxEvents = 10,
  height = 400,
  loading = false,
}) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Ajouter les jours du mois précédent
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false, isToday: false });
    }

    // Ajouter les jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const today = new Date();
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString(),
      });
    }

    // Ajouter les jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  // Charger les événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les classes virtuelles
        const classes = await virtualClassService.getUserVirtualClasses(user.id);
        
        // Récupérer les évaluations
        const evaluations = await evaluationService.getAvailableEvaluations(user.id);

        // Transformer les données en événements
        const calendarEvents: CalendarEvent[] = [];

        // Ajouter les classes
        classes.forEach((cls: any) => {
          if (cls.schedule) {
            calendarEvents.push({
              id: `class-${cls.id}`,
              title: cls.name,
              description: cls.description,
              date: cls.schedule.date,
              time: cls.schedule.time,
              location: cls.schedule.location || 'En ligne',
              type: 'class',
              participants: cls.participantsCount,
              status: cls.status === 'ACTIVE' ? 'upcoming' : 'completed',
              color: cls.color || eventTypeConfig.class.defaultColor,
            });
          }
        });

        // Ajouter les évaluations
        evaluations.forEach((evaluation: any) => {
          calendarEvents.push({
            id: `eval-${evaluation.id}`,
            title: evaluation.title,
            description: evaluation.description,
            date: evaluation.dueDate,
            time: evaluation.dueTime,
            type: 'evaluation',
            status: new Date(evaluation.dueDate) > new Date() ? 'upcoming' : 'completed',
            color: eventTypeConfig.evaluation.defaultColor,
          });
        });

        // Ajouter des événements de test si pas assez de données
        if (calendarEvents.length < 5) {
          const today = new Date();
          for (let i = 0; i < 5; i++) {
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + i * 2);
            
            calendarEvents.push({
              id: `demo-${i}`,
              title: i % 2 === 0 ? 'Cours de Statistiques' : 'Devoir à rendre',
              description: i % 2 === 0 ? 'Module 3 - Probabilités' : 'Exercices pratiques',
              date: eventDate.toISOString().split('T')[0],
              time: i % 2 === 0 ? '14:00' : '23:59',
              type: i % 2 === 0 ? 'class' : 'deadline',
              status: 'upcoming',
              color: i % 2 === 0 ? eventTypeConfig.class.defaultColor : eventTypeConfig.deadline.defaultColor,
            });
          }
        }

        setEvents(calendarEvents);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des événements');
        toast.error('Erreur de chargement', {
          description: 'Impossible de charger les événements du calendrier.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getEventTypeConfig = (type: string) => {
    return eventTypeConfig[type as keyof typeof eventTypeConfig] || eventTypeConfig.reminder;
  };

  if (loading || isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-center" style={{ minHeight: height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Chargement du calendrier...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center text-red-600" style={{ minHeight: height }}>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-navy">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {showToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-xs"
          >
            Aujourd'hui
          </Button>
        )}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h4 className="text-base font-medium text-primary-navy capitalize">
            {formatDate(currentDate)}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[60px] p-1 border border-gray-100 cursor-pointer transition-colors",
                day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                day.isToday && "bg-blue-50 border-blue-200",
                isSelected && "bg-primary-navy/10 border-primary-navy",
                "hover:bg-gray-50"
              )}
              onClick={() => setSelectedDate(day.date)}
            >
              <div className="text-xs text-right mb-1">
                <span className={cn(
                  day.isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  day.isToday && "font-bold text-blue-600",
                  isSelected && "font-bold text-primary-navy"
                )}>
                  {day.date.getDate()}
                </span>
              </div>
              
              {/* Événements du jour */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => {
                  const config = getEventTypeConfig(event.type);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "w-full h-2 rounded-sm text-xs flex items-center justify-center",
                        config.color
                      )}
                      style={{ backgroundColor: event.color || config.defaultColor }}
                      title={`${event.title}${event.time ? ` - ${event.time}` : ''}`}
                    >
                      <span className="text-white text-[10px] font-medium truncate px-1">
                        {event.title}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-gray-500 text-center">
                    +{dayEvents.length - 2} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Événements du jour sélectionné */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-primary-navy mb-3">
            Événements du {selectedDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map(event => {
                const config = getEventTypeConfig(event.type);
                return (
                  <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className={cn("p-1 rounded", config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-600 truncate">
                          {event.description}
                        </p>
                      )}
                    </div>
                    {event.time && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                Aucun événement prévu pour cette date
              </p>
            )}
          </div>
        </div>
      )}

      {/* Prochains événements */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-primary-navy mb-3">
          Prochains événements
        </h5>
        <div className="space-y-2 max-h-24 overflow-y-auto">
          {events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3)
            .map(event => {
              const config = getEventTypeConfig(event.type);
              const eventDate = new Date(event.date);
              const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={cn("p-1 rounded", config.color)}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {eventDate.toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                      {event.time && ` à ${event.time}`}
                    </p>
                  </div>
                                     <Badge variant={daysUntil <= 1 ? 'solid' : daysUntil <= 3 ? 'outline' : 'ghost'}>
                    {daysUntil === 0 ? 'Aujourd\'hui' : 
                     daysUntil === 1 ? 'Demain' : 
                     `Dans ${daysUntil} jours`}
                  </Badge>
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
};
