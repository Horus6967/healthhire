export type ScreeningBandLabel = "Strong" | "Solid" | "Developing";

export type ScreeningFeedback = {
  summary: string;
  strengths: string[];
  improvements: string[];
};

export function getScreeningBand(score: number): { label: ScreeningBandLabel; description: string } {
  if (score >= 75) {
    return {
      label: "Strong",
      description: "Answers show solid clinical judgment and clear communication.",
    };
  }
  if (score >= 50) {
    return {
      label: "Solid",
      description: "Answers show a good foundation, with room to add more clinical depth.",
    };
  }
  return {
    label: "Developing",
    description: "Answers show early understanding. Building depth will strengthen this profile.",
  };
}
