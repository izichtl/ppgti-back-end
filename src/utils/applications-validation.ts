export type ApplicationSummary = {
  application_id: number;
  program: string;
  process_id: number;
  period: string;
  line: string;
  line_id: number;
  topic: string;
  topic_id: number;
  tittle: string;
  date: string; // ex: "11/10/2025 - 18:20"
  project_url: string;
  valid: boolean;
};

export type ValidationByProcess = Record<
  number,
  {
    reachedLimit: boolean;
    topicsUsed: number[];
  }
>;

export const buildValidationByProcessV2 = async <
  T extends Pick<ApplicationSummary, 'process_id' | 'topic_id' | 'valid'>
>(
  applications: T[]
): Promise<ValidationByProcess> => {
  const validation: ValidationByProcess = {};

  const grouped = applications.reduce<Record<number, T[]>>((acc, app) => {
    if (app.valid === false) return acc;
    if (!acc[app.process_id]) acc[app.process_id] = [];
    acc[app.process_id].push(app);
    return acc;
  }, {});

  for (const [pid, apps] of Object.entries(grouped)) {
    if (!apps.length) continue;
    const topicSet = new Set<number>(apps.map((a) => a.topic_id));

    validation[Number(pid)] = {
      reachedLimit: topicSet.size >= 2,
      topicsUsed: Array.from(topicSet),
    };
  }

  validation[0] = {
    reachedLimit: false,
    topicsUsed: [0],
  };
  return validation;
};
