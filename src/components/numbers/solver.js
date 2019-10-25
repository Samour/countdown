import { ARITHMETIC_OPERATIONS, evaluateRP } from './evaluator';

const RAND_SOLN_POPULATION = 1000000;
// const RAND_SOLN_POPULATION = 100;
const PROB_EARLY_EXIT = 0.2;
const PROB_OP_PLACEMENT = 0.4

function solnIsCorrect(soln, target) {
  const ev = evaluateRP(soln);
  return ev.errors.length === 0 && ev.value === target;
}

function generateRandomSolution(nums, target) {
  const fromNums = [...nums];
  const soln = [];
  let numCount = 0;
  let opCount = 0;
  while (fromNums.length > 0 && Math.random() > PROB_EARLY_EXIT) {
    if (numCount === opCount + 1 && solnIsCorrect(soln, target)) {
      // Early exit in case we come across the solution
      return soln;
    }
    if (numCount > opCount + 1 && Math.random() < PROB_OP_PLACEMENT) {
      soln.push(ARITHMETIC_OPERATIONS[Math.floor(Math.random() * ARITHMETIC_OPERATIONS.length)]);
      opCount++;
    } else {
      soln.push(fromNums.splice(Math.floor(Math.random() * fromNums.length), 1)[0]);
      numCount++;
    }
  }

  while (numCount > opCount + 1) {
    soln.push(ARITHMETIC_OPERATIONS[Math.floor(Math.random() * ARITHMETIC_OPERATIONS.length)]);
    opCount++;
  }

  return soln;
}

export default function findSolution(nums, target) {
  let bestSoln = [];
  let bestDist = -1;
  for (let i = 0; i < RAND_SOLN_POPULATION; i++) {
    const soln = generateRandomSolution(nums);
    const ev = evaluateRP(soln);
    if (ev.errors.length > 0) {
      continue;
    }
    const distance = Math.abs(target - ev.value);
    if (distance === 0) {
      return soln;
    } else if (bestDist < 0 || distance < bestDist) {
      bestSoln = soln;
      bestDist = distance;
    }
  }

  return bestSoln;
}
