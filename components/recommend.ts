import { categories, Category } from "./categories";

type Nutrient = Category;

const goalMap: Record<string, Nutrient[]> = {
  immune: ["비타민C", "비타민D", "프로바이오틱스(유산균)", "아연"],
  fatigue: ["비타민B", "마그네슘", "아르기닌", "코엔자임Q10"],
  eye: ["루테인", "비타민A", "오메가3"],
  liver: ["밀크씨슬(실리마린)", "아르기닌"],
  digestion: ["프로바이오틱스(유산균)", "차전자피 식이섬유"],
  weight: ["가르시니아", "차전자피 식이섬유"],
  heart: ["오메가3", "코엔자임Q10"],
  joint: ["콘드로이친", "칼슘", "콜라겐"],
  skinHair: ["콜라겐", "비타민C", "비타민A"],
  memory: ["포스파티딜세린", "오메가3"],
};

const nutrientMap: Record<string, Record<string, Nutrient[]>> = {
  pregnancy: {
    yes: ["엽산", "철분", "오메가3"],
  },
  drink: {
    yes: ["밀크씨슬(실리마린)", "비타민B"],
  },
  sunlight: {
    yes: ["비타민D"],
  },
  sleepTime: {
    yes: ["비타민B", "코엔자임Q10"],
  },
  fatigueRecovery: {
    yes: ["비타민B", "마그네슘", "코엔자임Q10", "밀크씨슬(실리마린)"],
  },
  stiff: {
    yes: ["마그네슘", "코엔자임Q10"],
  },
  dairy: {
    no: ["칼슘"],
  },
  fish: {
    no: ["오메가3"],
  },
};

export function getRecommendations(
  answers: Record<string, string>
): Category[] {
  const scores: Record<Nutrient, number> = Object.fromEntries(
    categories.map((c) => [c, 0])
  ) as Record<Nutrient, number>;

  const goal = answers.goal;
  if (goal && goalMap[goal]) {
    goalMap[goal].forEach((nutrient) => {
      scores[nutrient] += 2;
    });
  }

  Object.entries(answers).forEach(([qId, answer]) => {
    const m = nutrientMap[qId];
    if (m?.[answer]) {
      m[answer].forEach((nutrient) => {
        scores[nutrient] += 1;
      });
    }
  });

  return (Object.entries(scores) as [Nutrient, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([nutrient]) => nutrient);
}
