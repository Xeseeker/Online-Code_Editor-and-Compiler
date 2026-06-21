import { execFile } from "child_process";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export const runJava = async (code) => {
  const workdir = await mkdtemp(join(tmpdir(), "code-editor-java-"));
  const sourceFile = join(workdir, "Main.java");

  try {
    await writeFile(sourceFile, code, "utf8");

    return await new Promise((resolve, reject) => {
      const args = [
        "run",
        "--rm",
        "--mount",
        `type=bind,source=${workdir},target=/workspace`,
        "-w",
        "/workspace",
        "eclipse-temurin:21",
        "sh",
        "-c",
        "javac Main.java && java Main",
      ];

      execFile("docker", args, { timeout: 10000 }, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout);
        }
      });
    });
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
};
