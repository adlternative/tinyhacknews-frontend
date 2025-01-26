import moment from "moment"; // 需要安装 moment 库

function RelativeTimeFromISOString(isoString: string): string {
  // 使用 moment.js 来处理时间的比较和格式化
  const time = moment(isoString);
  const now = moment();

  // 使用 moment.js 的 diff 方法来获取时间差
  const duration = moment.duration(now.diff(time));

  if (duration.asDays() > 1) {
    return time.fromNow(); // moment.js 自动处理了天数以上的单位
  } else if (duration.asHours() >= 1) {
    const hours = Math.floor(duration.asHours());
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (duration.asMinutes() >= 1) {
    const minutes = Math.floor(duration.asMinutes());
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else {
    const seconds = Math.floor(duration.asSeconds());
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
}

export default RelativeTimeFromISOString;