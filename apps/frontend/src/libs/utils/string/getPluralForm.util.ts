export function getPluralForm({ single, multi, count }: { single: string; multi: string; count: number }) {
  if (count === 1) {
    return `${count} ${single}`;
  } else {
    return `${count} ${multi}`;
  }
}
