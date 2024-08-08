import CustomError from "./customError";

export const dateTimeFormatter = (date: string, time: string) => {
    const dateObject = new Date(date);
    const timeComponents = time.match(/(\d{2}:\d{2}:\d{2})/);
  
    if (dateObject && timeComponents) {
      const [hours, minutes, seconds] = timeComponents[1].split(':');
  
      dateObject.setUTCHours(Number(hours), Number(minutes), Number(seconds));
  
      const formattedDateTimeString = dateObject.toISOString().slice(0, 19);
  
      return formattedDateTimeString;
    } else {
      throw new CustomError('Invalid date or time format', 400);
    }
  };