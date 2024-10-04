import { createServer } from "https";
import type { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import fs from "fs";

const dev: boolean = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("smg.local-key.pem"),
  cert: fs.readFileSync("smg.local.pem"),
};

await app.prepare().then(() => {
  createServer(
    httpsOptions,
    (req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url ?? "", true);
      void handle(req, res, parsedUrl);
    },
  ).listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log("> Ready on https://smg.local:3000");
  });
});
