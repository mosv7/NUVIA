import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
export function createMailAdapter(config) {
  if (config.mailMode === 'file') {
    if (config.mode === 'production') throw new Error('File mail disabled in production');
    return {
      async send(message) {
        await mkdir(config.mailDirectory, { recursive: true, mode: 0o700 });
        try {
          await writeFile(
            join(config.mailDirectory, `${message.id}.json`),
            JSON.stringify(message),
            { flag: 'wx', mode: 0o600 },
          );
        } catch (e) {
          if (e.code !== 'EEXIST') throw e;
        }
      },
    };
  }
  const { smtp } = config;
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: !smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.password } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  return {
    async send(message) {
      await transport.sendMail({
        from: smtp.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        messageId: `<${message.id}@nuvia.local>`,
      });
    },
  };
}
