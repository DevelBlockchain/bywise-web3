export default interface BywiseTransaction {
    toHash(): string
    isValid(): void
}