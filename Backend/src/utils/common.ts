/**
 * Converts a numeric TypeScript enum (or similar object) into an array of its numeric values.
 *
 * In TypeScript, numeric enums create a two-way mapping between keys and values.
 * This function filters out the string values from that mapping,
 * returning only the numeric values as an array.
 *
 * @param numberEnum - A numeric enum or object with string keys and values of type number or string.
 * @returns An array containing only the numeric values from the provided enum.
 *
 * @example
 * enum Status {
 *   ACTIVE = 1,
 *   INACTIVE = 2
 * }
 * numberEnumToArray(Status) // => [1, 2]
 */

export const numberEnumToArray = (numberEnum: { [key: string]: number | string }): number[] => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
