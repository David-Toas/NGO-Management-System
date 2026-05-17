

export const fetchProjectsReport = ({ status, year }) => {
  let filteredProjects = [...projects];

  if (status) {
    filteredProjects = filteredProjects.filter(
      (project) => project.status === status
    );
  }

  if (year) {
    filteredProjects = filteredProjects.filter((project) => {
      const projectYear = new Date(project.startDate).getFullYear();

      return projectYear === Number(year);
    });
  }

  return {
    totalProjects: filteredProjects.length,
    projects: filteredProjects
  };
};


export const fetchTransparencyReport = () => {
  const totalFundsReceived = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  const totalFundsUsed = projects.reduce(
    (sum, project) => sum + project.spent,
    0
  );

  const remainingBalance =
    totalFundsReceived - totalFundsUsed;

  return {
    totalFundsReceived,
    totalFundsUsed,
    remainingBalance,
    projectsFunded: projects.length
  };
};


export const fetchDashboardMetrics = () => {
  const activeProjects = projects.filter(
    (project) => project.status === 'active'
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === 'completed'
  ).length;

  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  return {
    activeProjects,
    completedProjects,
    totalDonations
  };
};