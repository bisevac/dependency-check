import { versionCompare, versionFormater } from './utils';

describe('Utils', () => {
  describe('versionCompare', () => {
    it('if v1 > v2 should return 1', () => {
      const c = versionCompare('1.1.3', '1.1.0');

      expect(c).toBe(1);
    });

    it('if v2 > v1 should return -1', () => {
      const c = versionCompare('2.7.3', '3.5.1');

      expect(c).toBe(-1);
    });

    it('if v1 = v2 should return 0', () => {
      const c = versionCompare('1.1.3', '1.1.3');

      expect(c).toBe(0);
    });

    it('complex version case', () => {
      const c = versionCompare('1.24.0', '2.1.0');

      expect(c).toBe(-1);
    });
  });

  describe('versionFormater', () => {
    describe('should be 1.2 -> 1.2.0', () => {
      const v = versionFormater('1.2');

      expect(v).toBe('1.2.0');
    });

    describe('should be 3 -> 3.0.0', () => {
      const v = versionFormater('3');

      expect(v).toBe('3.0.0');
    });

    describe('should be ^6.4.4 -> 6.4.4', () => {
      const v = versionFormater('^6.4.4');

      expect(v).toBe('6.4.4');
    });
  });
});
