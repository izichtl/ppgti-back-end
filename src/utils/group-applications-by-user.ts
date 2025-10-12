import { Application } from './applications-outdate-filter';

type Candidate = {
  id: number;
  cpf: string;
  name: string;
  email: string;
};

type ApplicationWithCandidate = Application & { candidates: Candidate };

type CandidateApplications = {
  candidate: Candidate;
  applications: ApplicationWithCandidate[];
};

export function groupApplicationsByCandidate(
  applications: ApplicationWithCandidate[]
): CandidateApplications[] {
  const grouped = applications.reduce<
    Record<number, ApplicationWithCandidate[]>
  >((acc, app) => {
    const candidateId = app.candidates.id;
    if (!acc[candidateId]) acc[candidateId] = [];
    acc[candidateId].push(app);
    return acc;
  }, {});

  return Object.values(grouped).map((apps) => ({
    candidate: apps[0].candidates,
    applications: apps,
  }));
}
