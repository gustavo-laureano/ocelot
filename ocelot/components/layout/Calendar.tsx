import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Interface para as propriedades do componente
interface WeeklyCalendarProps {
  onDateSelect: (date: Date) => void;
  initialDate?: Date;
}

// Função auxiliar para verificar se duas datas são o mesmo dia (ignora a hora)
const isSameDay = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ onDateSelect, initialDate }) => {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());

  // Efeito que calcula os dias da semana atual
  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Define o início da semana como Domingo

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);
  }, []);

  // Função para lidar com a seleção de uma data
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  }, [onDateSelect]);
  
  const today = new Date();

  return (
    <View style={styles.container}>
      {weekDates.map((date) => {
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).substring(0, 3).toUpperCase();
        const dayNumber = date.getDate();
        
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <TouchableOpacity
            key={date.toISOString()}
            onPress={() => handleDateSelect(date)}
            style={[
              styles.dayContainer,
              isSelected && styles.selectedDayContainer, // Estilo de seleção
            ]}
          >
            <Text style={[styles.dayText, isSelected && styles.selectedText]}>
              {dayName}
            </Text>
            <View 
              style={[
                styles.dateNumberContainer, 
                isToday && !isSelected && styles.todayIndicator // Indicador de "hoje"
              ]}
            >
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {dayNumber}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f4f4f4', // Um fundo neutro
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 70,
    borderRadius: 12,
    backgroundColor: 'transparent',
    paddingVertical: 5,
  },
  selectedDayContainer: {
    backgroundColor: '#007AFF', // Cor primária para seleção
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8A8E',
    marginBottom: 8,
  },
  dateNumberContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16, // Círculo perfeito
  },
  todayIndicator: {
    backgroundColor: '#EFEFF4',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  selectedText: {
    color: '#FFFFFF', // Texto branco quando selecionado
    fontWeight: 'bold',
  },
});

export default WeeklyCalendar;