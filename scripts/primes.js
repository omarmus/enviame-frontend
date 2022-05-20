let [start = 1, end = 10] = process.argv.slice(2)

const primesRange = (start, end) => {
  if (end < start) {
    return 'Start must be less than end'
  }
  const primes = []
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) {
      primes.push(i)
    }
  }
  return primes
}

const isPrime = (number) => {
  if (number < 2) return

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false
    }
  }
  return true
}

console.table(primesRange(+start, +end))
