import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export const base64ToString = (b64: string): string =>
  Buffer.from(b64, 'base64').toString('ascii');

export const spawnChildProcess = (
  cmd: string,
  args: string[],
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ls: ChildProcessWithoutNullStreams = spawn(cmd, args);
    let output = '';
    let err = false;

    ls.stdout.on('data', (o: string) => {
      output += o;
    });

    ls.stderr.on('data', (e: string) => {
      err = true;
      return reject(e);
    });

    ls.on('close', (code: number) => {
      if (err) {
        return;
      }

      if (code) {
        return reject(new Error('Process end with code:' + code));
      }

      resolve(output);
    });
  });
};

/**
 * @returns
 * -1 = v1 is LOWER than v2\
 *  0 = they are equal\
 *  1 = v1 is GREATER than v2
 *
 * @example
 * versionCompare('1.1.0', '1.2.1') => -1\
 * versionCompare('1.1.1', '1.1.1') =>  0\
 * versionCompare('1.2.0', '1.1.0') =>  1
 */
export const versionCompare = (v1: string, v2: string) => {
  const v1Number = Number(v1.replace(/\./g, '').trim());
  const v2Number = Number(v2.replace(/\./g, '').trim());

  if (Number.isNaN(v1Number) || Number.isNaN(v2Number)) {
    throw new Error('input version/s are not valid');
  }

  const v1Arr = v1.split('.');
  const v2Arr = v2.split('.');

  for (let i = 0; i < v1Arr.length; i += 1) {
    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    } else if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }
  }

  return 0;
};

/**
 * @example
 * ^|~|=1.2.1 -> 1.2.1\
 * 1.1 -> 1.1.0\
 * 3 -> 3.0.0
 */
export const versionFormater = (version: string): string => {
  const arrVersion: string[] = version
    .split('.')
    .map((v) => v.replace(/\D/, ''));

  for (let i = arrVersion.length; i < 3; i++) {
    arrVersion.push('0');
  }

  return arrVersion.join('.');
};

export const generateId = () => {
  return Math.random().toString().slice(2, 11);
};
