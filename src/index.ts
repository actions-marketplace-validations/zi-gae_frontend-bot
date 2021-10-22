import * as core from "@actions/core";
import * as github from "@actions/github";
import { sendCanaryPublishMessage, sendPlaneTextMessage } from "./utils/slack";
import { getComment } from "./utils/github/getPayload";
import { parseGithubEvent } from "./utils/github/events";
import { ActionEventName } from "./models/github";
import { PLANE_TEXT } from "./utils/input";
import { exec } from "child_process";

async function sh(cmd: string) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const { eventName, payload } = github.context;

async function main() {
  core.info("🔥 Run.....");
  core.info(`eventName = ${eventName}`);
  core.info("🔥 🔥 🔥 🔥 🔥");
  core.info(`action = ${payload.action}`);
  core.info("🔥 🔥 🔥 🔥 🔥");

  const comment = await getComment();
  const githubEvent = parseGithubEvent();
  const planeText = PLANE_TEXT;
  const { promises: fs } = require("fs");

  let content = await fs.readFile(planeText, "utf8");
  core.info("🔥 🔥 🔥 🔥 🔥");
  core.info(`content: ${content}`);
  core.info("🔥 🔥 🔥 🔥 🔥");

  if (!githubEvent) {
    core.info("👋 타입이 없습니다.");
    return;
  }
  core.info("🔥 🔥 🔥 🔥 🔥");
  console.log("@@comment@@", planeText);
  core.info("🔥 🔥 🔥 🔥 🔥");

  switch (githubEvent.type) {
    case ActionEventName.카나리: {
      core.info("카나리 배포가 되었습니다, 슬랙 메세지를 보냅니다.");
      await sendCanaryPublishMessage({ comment });
      break;
    }
    case ActionEventName.PR승인: {
      core.info("Pull Request 승인이 감지되었습니다. 슬랙 메세지를 보냅니다.");
      // await sendCanaryPublishMessage({ pullRequest });
      break;
    }
    case ActionEventName.입력: {
      core.info("액션에서 입력 값을 받았습니다.");
      await sendPlaneTextMessage({ planeText });
      break;
    }
  }

  core.info("👋 Done!");
}

try {
  main();
} catch (error: any) {
  core.setFailed(error);
}
