export type Application = {
  id: number;
  candidate_id: number;
  process_id: number;
  line_id: number;
  topic_id: number;
  project_title: string;
  project_path: string;
  application_date: string;
  selection_processes: Record<string, any>;
  research_lines: Record<string, any>;
  research_topics: Record<string, any>;
};

type SeparatedApplications = {
  validApplications: Application[];
  outdatedApplications: Application[];
};

export async function separateApplicationsByTopic(applications: Application[]): Promise<SeparatedApplications> {
  const grouped = applications.reduce<Record<number, Application[]>>((acc, app) => {
    if (!acc[app.topic_id]) acc[app.topic_id] = [];
    acc[app.topic_id].push(app);
    return acc;
  }, {});

  const validApplications: Application[] = [];
  const outdatedApplications: Application[] = [];

  Object.values(grouped).forEach(apps => {
    const sorted = apps.sort((a, b) => {
      const dateA = new Date(a.application_date).getTime();
      const dateB = new Date(b.application_date).getTime();
      return dateB - dateA;
    });

    validApplications.push(sorted[0]);
    outdatedApplications.push(...sorted.slice(1));
  });

  return { validApplications, outdatedApplications };
}