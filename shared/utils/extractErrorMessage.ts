export default function extractErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err)
}
