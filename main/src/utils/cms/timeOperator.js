export const compareTimeInOneDay = (from, to) => {
  if (from.getHours() < to.getHours()) {
    return false; //17:00:00 - 18:00:00
  } else if (from.getHours() > to.getHours()) {
    return true;  //18:00:00 - 17:00:00
  } else {
    if (from.getMinutes() < to.getMinutes()) {
      return false; //17:05:00 - 17:10:00
    } else if (from.getMinutes() > to.getMinutes()){
      return true;  //17:10:00 - 17:05:00
    } else {
      if (from.getSeconds() < to.getSeconds()) {
        return false; //17:05:30 - 17:05:40
      } else {
        return true  //17:05:40(41) - 17:05:40
      }
    }
  }
};

// millseconds转换时，分，秒
export const mill2hms = (mills) => {
  const htime = 60 * 60 * 1000;
  const mtime = 60 * 1000;
  const stime = 1000;

  const h = Math.floor(mills / htime);
  mills = mills - h * htime;

  const m = Math.floor(mills / mtime);
  mills = mills - m * mtime;

  const s = Math.floor(mills / stime);

  return {
    hour: h, minute: m, sec: s
  };
};


// DateTimeFormater
export const dateTimeFormater = (time, format) => {
  const year = time.getFullYear()
  const month = time.getMonth()
  const day = time.getDate()
  const hours24 = time.getHours()
  const hours = hours24 % 12 === 0 ? 12 : hours24 % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const milliseconds = time.getMilliseconds()
  const dd = t => ('0' + t).slice(-2)
  const map = {
    YYYY: year,
    MM: dd(month + 1),
    M: month + 1,
    DD: dd(day),
    D: day,
    HH: dd(hours24),
    H: hours24,
    hh: dd(hours),
    h: hours,
    mm: dd(minutes),
    m: minutes,
    ss: dd(seconds),
    s: seconds,
    S: milliseconds
  }
  return (format).replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, str => map[str])
}

