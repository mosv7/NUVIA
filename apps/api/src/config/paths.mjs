import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const repositoryRoot = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
export const localPath = (...segments) => resolve(repositoryRoot, '.local', ...segments);
