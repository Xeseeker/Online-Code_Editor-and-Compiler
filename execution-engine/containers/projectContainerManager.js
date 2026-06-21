import Docker from "dockerode";

const docker = new Docker();

export const getProjectContainerName = (projectId) => `online-ide-${projectId}`;

export const ensureProjectContainer = async ({ projectId, volumeName }) => {
  const name = getProjectContainerName(projectId);
  const containers = await docker.listContainers({ all: true, filters: { name: [name] } });

  if (containers.length) {
    const container = docker.getContainer(containers[0].Id);
    const details = await container.inspect();
    if (!details.State.Running) {
      await container.start();
    }
    return container;
  }

  const container = await docker.createContainer({
    Image: "node:22",
    name,
    Tty: true,
    Cmd: ["bash"],
    HostConfig: {
      Binds: [`${volumeName || name}-volume:/workspace`],
    },
    WorkingDir: "/workspace",
  });

  await container.start();
  return container;
};
