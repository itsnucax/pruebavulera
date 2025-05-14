
    import React from 'react';
    import { addWeeks, addMonths, format, parseISO, isValid } from 'date-fns';
    import { es } from 'date-fns/locale';

    export const calculateNextPaymentDate = (startDate, frequency, paymentsMade) => {
      if (!startDate || !isValid(parseISO(startDate))) {
        return "Fecha de inicio inválida";
      }
      
      const parsedStartDate = parseISO(startDate);
      let nextDate = parsedStartDate;

      for (let i = 0; i < paymentsMade; i++) {
        if (frequency === 'semanal') {
          nextDate = addWeeks(nextDate, 1);
        } else if (frequency === 'quincenal') {
          nextDate = addWeeks(nextDate, 2);
        } else if (frequency === 'mensual') {
          nextDate = addMonths(nextDate, 1);
        }
      }
      return nextDate;
    };

    export const formatDate = (dateString) => {
      if (!dateString || !isValid(parseISO(dateString))) {
        return "N/A";
      }
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
    };
    
    export const formatDateForInput = (dateString) => {
      if (!dateString || !isValid(parseISO(dateString))) {
        return "";
      }
      return format(parseISO(dateString), 'yyyy-MM-dd');
    };
  