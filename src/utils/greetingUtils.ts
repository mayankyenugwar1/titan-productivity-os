export interface DynamicGreeting {
  salutation: string;
  timePeriod: "Morning" | "Afternoon" | "Evening";
  motivationalQuote: string;
}

export function getDynamicGreeting(name: string = "Operator"): DynamicGreeting {
  const hour = new Date().getHours();

  let salutation = `Good Morning, ${name}`;
  let timePeriod: "Morning" | "Afternoon" | "Evening" = "Morning";
  let motivationalQuote = "Focus on execution and eliminate friction in your workflow.";

  if (hour >= 12 && hour < 17) {
    salutation = `Good Afternoon, ${name}`;
    timePeriod = "Afternoon";
    motivationalQuote = "Maintain momentum during peak operational hours.";
  } else if (hour >= 17 || hour < 5) {
    salutation = `Good Evening, ${name}`;
    timePeriod = "Evening";
    motivationalQuote = "Consolidate today's wins and optimize directives for tomorrow.";
  }

  return {
    salutation,
    timePeriod,
    motivationalQuote,
  };
}
