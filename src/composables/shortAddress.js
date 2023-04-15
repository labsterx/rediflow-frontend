export function useShortAddress(input, frontDigits=4, endDigits=4) {

  const frontToKeep = parseInt(frontDigits)
  const endToKeep = parseInt(endDigits)
  const endIndexStart = input.length - endToKeep
  return input.substring(0, frontToKeep) + '...' + input.substring(endIndexStart)

}