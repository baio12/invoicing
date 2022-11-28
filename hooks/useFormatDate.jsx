import moment from 'moment-timezone';
import 'moment/locale/es';
moment().local('es');

export const dateFormatter = (date, format) => moment(date).tz(moment.tz.guess()).format(format);

export const unixToDate = (unixDate) => moment(unixDate);

export const stringToDate = (stringDate, formatDate) => moment(stringDate, formatDate);