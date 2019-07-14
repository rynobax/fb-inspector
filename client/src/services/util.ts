import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const PUSH_CHARS =
  '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

const PUSH_INDICES = PUSH_CHARS.split('').reduce<{
  [k: string]: number | undefined;
}>((acc, c, i) => {
  acc[c] = i;
  return acc;
}, {});

function getTimestampFromFBKey(str: string) {
  if (str.length !== 20) return null;
  let timestamp = 0;
  for (let i = 0; i < 8; i++) {
    const c = str.charAt(i);
    if (!c) return null;
    const ndx = PUSH_INDICES[c];
    if (ndx === undefined) return null;
    timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
  }
  return timestamp;
}

const CURRENT_YEAR = dayjs().year();

export function getTimeStrFromKey(str: string) {
  const time = getTimestampFromFBKey(str);
  if (!time) return null;
  const then = dayjs(time);

  const isThisYear = then.year() === CURRENT_YEAR;

  let fmt = '';
  fmt += 'HH:mm:ss ';
  fmt += 'MMM D';
  if (!isThisYear) fmt += ' YY';
  const abs = then.format(fmt);
  const rel = then.fromNow();
  return `${abs} (${rel})`;
}
