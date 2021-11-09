export function convertBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return String(value).toLocaleLowerCase() === 'true';
}
