/**
 * Generates a unique username based on the current timestamp and random digits.
 *
 * The generated username has the format: `User<timestamp><randomNumber>`,
 * where:
 * - `<timestamp>` is the last 6 digits of the current time in milliseconds.
 * - `<randomNumber>` is a two-digit random number between 10 and 99.
 *
 * This ensures that the username is both time-based and includes a random element
 * to reduce the chance of duplication.
 *
 * @returns A string representing the generated username.
 *
 * @example
 * generateTimeBasedUsername() // => 'User12345678'
 */

export default function generateTimeBasedUsername() {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(10 + Math.random() * 90)
    return `User${timestamp}${random}`
}
