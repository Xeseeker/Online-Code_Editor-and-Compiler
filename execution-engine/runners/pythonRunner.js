import { execFile } from "child_process";

export const runPython = (code) => {
  return new Promise((resolve, reject) => {
    const args = ["run", "--rm", "python:3.12", "python", "-c", code];

    execFile("docker", args, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};
