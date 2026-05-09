import { execFile } from "child_process";

export const runJavaScript = (code) => {
  return new Promise((resolve, reject) => {
    const args = ["run", "--rm", "node:20", "node", "-e", code];

    execFile("docker", args, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};
