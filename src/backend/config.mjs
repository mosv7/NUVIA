import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { isIP } from 'node:net';
import { resolve } from 'node:path';

export function loadConfig(env = process.env, { rootDir = process.cwd() } = {}) {
  const mode = env.NODE_ENV || 'development';
  let local = {};
  if (mode === 'development') {
    for (const file of ['atlas-credentials.env', '.env']) {
      const path = resolve(rootDir, file);
      if (existsSync(path)) local = { ...local, ...parseEnv(readFileSync(path, 'utf8')) };
    }
  }
  const values = { ...local, ...env };
  const invalid = (field) => {
    throw new Error(`Invalid configuration: ${field}`);
  };
  const integer = (field, fallback, min, max) => {
    const n = Number(values[field] ?? fallback);
    if (!Number.isInteger(n) || n < min || n > max) invalid(field);
    return n;
  };
  let mongoUri = values.MONGODB_URI;
  if (mongoUri?.includes('<db_password>') && values.MONGODB_PASSWORD)
    mongoUri = mongoUri.replace('<db_password>', encodeURIComponent(values.MONGODB_PASSWORD));
  if (!/^mongodb(?:\+srv)?:\/\/[^\s<>]+$/.test(mongoUri || '')) invalid('MONGODB_URI');
  const mongoDatabase = values.MONGODB_DATABASE || 'nuvia';
  if (!/^[a-zA-Z0-9_-]{1,63}$/.test(mongoDatabase)) invalid('MONGODB_DATABASE');
  const appOrigin = values.APP_ORIGIN || 'http://127.0.0.1:5173';
  try {
    const url = new URL(appOrigin);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.origin !== appOrigin ||
      url.username ||
      url.password ||
      (mode === 'production' && url.protocol !== 'https:')
    )
      invalid('APP_ORIGIN');
  } catch {
    invalid('APP_ORIGIN');
  }
  if (!/^[a-fA-F0-9]{64}$/.test(values.MAIL_ENCRYPTION_KEY || '')) invalid('MAIL_ENCRYPTION_KEY');
  const mailMode = values.MAIL_MODE || (mode === 'production' ? 'smtp' : 'file');
  if (!['file', 'smtp'].includes(mailMode) || (mode === 'production' && mailMode === 'file'))
    invalid('MAIL_MODE');
  if (mailMode === 'smtp' && (!values.SMTP_HOST || !values.SMTP_FROM))
    invalid('SMTP_HOST/SMTP_FROM');
  const dnsServers = values.MONGODB_DNS_SERVERS
    ? values.MONGODB_DNS_SERVERS.split(',').map((s) => s.trim())
    : [];
  if (dnsServers.some((s) => !isIP(s))) invalid('MONGODB_DNS_SERVERS');
  const tlsMaxVersion = values.MONGODB_TLS_MAX_VERSION || undefined;
  if (tlsMaxVersion && !['TLSv1.2', 'TLSv1.3'].includes(tlsMaxVersion))
    invalid('MONGODB_TLS_MAX_VERSION');
  const trustProxy = values.TRUST_PROXY || false;
  if (trustProxy && !['loopback', 'linklocal', 'uniquelocal'].includes(trustProxy))
    invalid('TRUST_PROXY');
  return {
    mode,
    mongoUri,
    mongoDatabase,
    appOrigin,
    port: integer('PORT', 3001, 0, 65535),
    host: values.HOST || '127.0.0.1',
    mailKey: Buffer.from(values.MAIL_ENCRYPTION_KEY, 'hex'),
    mailMode,
    mailDirectory: resolve(rootDir, values.MAIL_DIRECTORY || '.local/mail'),
    dnsServers,
    tlsMaxVersion,
    trustProxy,
    smtp: {
      host: values.SMTP_HOST,
      port: integer('SMTP_PORT', 587, 1, 65535),
      secure: values.SMTP_SECURE === 'true',
      user: values.SMTP_USER,
      password: values.SMTP_PASSWORD,
      from: values.SMTP_FROM,
    },
  };
}
