"use strict";

const path = require("path");
const fs = require("graceful-fs");
const request = require("supertest");
const webpack = require("webpack");
const Server = require("../../lib/Server");
const config = require("../fixtures/static-config/webpack.config");
const runBrowser = require("../helpers/run-browser");
const { skipTestOnWindows } = require("../helpers/conditional-test");
const port = require("../ports-map")["https-option"];

const httpsCertificateDirectory = path.resolve(
  __dirname,
  "../fixtures/https-certificate"
);

const staticDirectory = path.resolve(
  __dirname,
  "../fixtures/static-config/public"
);

describe("https option", () => {
  describe("boolean", () => {
    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: {
            directory: staticDirectory,
            watch: false,
          },
          https: true,
          port,
        },
        compiler
      );

      await server.start();

      ({ page, browser } = await runBrowser());

      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
      await browser.close();
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`https://127.0.0.1:${port}/`, {
        waitUntil: "networkidle0",
      });

      expect(response.status()).toMatchSnapshot("response status");

      expect(await response.text()).toMatchSnapshot("response text");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages"
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });
  });

  describe("as an object when cacert, pfx, key and cert are buffer", () => {
    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: {
            directory: staticDirectory,
            watch: false,
          },
          https: {
            cacert: fs.readFileSync(
              path.join(httpsCertificateDirectory, "ca.pem")
            ),
            pfx: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.pfx")
            ),
            key: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.key")
            ),
            cert: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.crt")
            ),
            passphrase: "webpack-dev-server",
          },
          port,
        },
        compiler
      );

      await server.start();

      ({ page, browser } = await runBrowser());

      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
      await browser.close();
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`https://127.0.0.1:${port}/`, {
        waitUntil: "networkidle0",
      });

      expect(response.status()).toMatchSnapshot("response status");

      expect(await response.text()).toMatchSnapshot("response text");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages"
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });
  });

  describe("as an object when cacert, pfx, key and cert are paths", () => {
    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: staticDirectory,
          https: {
            cacert: path.join(httpsCertificateDirectory, "ca.pem"),
            pfx: path.join(httpsCertificateDirectory, "server.pfx"),
            key: path.join(httpsCertificateDirectory, "server.key"),
            cert: path.join(httpsCertificateDirectory, "server.crt"),
            passphrase: "webpack-dev-server",
          },
          port,
        },
        compiler
      );

      await server.start();

      ({ page, browser } = await runBrowser());

      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
      await browser.close();
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`https://127.0.0.1:${port}/`, {
        waitUntil: "networkidle0",
      });

      expect(response.status()).toMatchSnapshot("response status");

      expect(await response.text()).toMatchSnapshot("response text");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages"
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });
  });

  describe("as an object when cacert, pfx, key and cert are symlinks", () => {
    if (skipTestOnWindows("Symlinks are not supported on Windows")) {
      return;
    }

    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: {
            directory: staticDirectory,
            watch: false,
          },
          https: {
            cacert: path.join(httpsCertificateDirectory, "ca-symlink.pem"),
            pfx: path.join(httpsCertificateDirectory, "server-symlink.pfx"),
            key: path.join(httpsCertificateDirectory, "server-symlink.key"),
            cert: path.join(httpsCertificateDirectory, "server-symlink.crt"),
            passphrase: "webpack-dev-server",
          },
          port,
        },
        compiler
      );

      await server.start();

      ({ page, browser } = await runBrowser());

      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
      await browser.close();
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`https://127.0.0.1:${port}/`, {
        waitUntil: "networkidle0",
      });

      expect(response.status()).toEqual(200);

      expect(await response.text()).toContain("Heyo");

      expect(consoleMessages.map((message) => message.text())).toEqual([]);

      expect(pageErrors).toEqual([]);
    });
  });

  describe("as an object when cacert, pfx, key and cert are raw strings", () => {
    let compiler;
    let server;
    let page;
    let browser;
    let pageErrors;
    let consoleMessages;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: {
            directory: staticDirectory,
            watch: false,
          },
          https: {
            cacert: fs
              .readFileSync(path.join(httpsCertificateDirectory, "ca.pem"))
              .toString(),
            // pfx can't be string because it is binary format
            pfx: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.pfx")
            ),
            key: fs
              .readFileSync(path.join(httpsCertificateDirectory, "server.key"))
              .toString(),
            cert: fs
              .readFileSync(path.join(httpsCertificateDirectory, "server.crt"))
              .toString(),
            passphrase: "webpack-dev-server",
          },
          port,
        },
        compiler
      );

      await server.start();

      ({ page, browser } = await runBrowser());

      pageErrors = [];
      consoleMessages = [];
    });

    afterEach(async () => {
      await browser.close();
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      page
        .on("console", (message) => {
          consoleMessages.push(message);
        })
        .on("pageerror", (error) => {
          pageErrors.push(error);
        });

      const response = await page.goto(`https://127.0.0.1:${port}/`, {
        waitUntil: "networkidle0",
      });

      expect(response.status()).toMatchSnapshot("response status");

      expect(await response.text()).toMatchSnapshot("response text");

      expect(consoleMessages.map((message) => message.text())).toMatchSnapshot(
        "console messages"
      );

      expect(pageErrors).toMatchSnapshot("page errors");
    });
  });

  // puppeteer having issues accepting SSL here,
  // throwing error net::ERR_BAD_SSL_CLIENT_AUTH_CERT,
  // hence testing with supertest
  describe('should support the "requestCert" option', () => {
    let compiler;
    let server;
    let req;

    beforeEach(async () => {
      compiler = webpack(config);

      server = new Server(
        {
          static: {
            directory: staticDirectory,
            watch: false,
          },
          https: {
            requestCert: true,
            pfx: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.pfx")
            ),
            key: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.key")
            ),
            cert: fs.readFileSync(
              path.join(httpsCertificateDirectory, "server.crt")
            ),
            passphrase: "webpack-dev-server",
          },
          port,
        },
        compiler
      );

      await server.start();

      req = request(server.app);
    });

    afterEach(async () => {
      await server.stop();
    });

    it("should handle GET request to index route (/)", async () => {
      const response = await req.get("/");

      expect(response.status).toMatchSnapshot("response status");
      expect(response.text).toMatchSnapshot("response text");
    });
  });
});
