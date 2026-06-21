const allocations = new Map();
let nextPort = Number(process.env.PROJECT_PORT_START || 5174);

export const allocatePorts = (projectId) => {
  if (allocations.has(projectId)) {
    return allocations.get(projectId);
  }

  const ports = {
    projectId,
    frontendPort: nextPort,
    backendPort: nextPort + 1,
  };
  nextPort += 2;
  allocations.set(projectId, ports);
  return ports;
};

export const getPorts = (projectId) => allocations.get(projectId) || allocatePorts(projectId);

export const releasePorts = (projectId) => {
  allocations.delete(projectId);
};
