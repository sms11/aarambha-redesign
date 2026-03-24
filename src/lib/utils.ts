/**
 * Serialize Prisma objects to plain JSON (strips Date objects etc.)
 * for passing from Server Components to Client Components.
 */
export function serialize<T>(items: T[]): T[] {
  return JSON.parse(JSON.stringify(items));
}
