import { isTruthy } from './narrowing';

describe('Helpers > Patience', () => {
  describe('isTruthy', () => {
    it('should return true if it receives a truthy value', () => {
      [1, -100, 'stirng', true, [], {}, Infinity].forEach((value) =>
        expect(isTruthy(value)).toBe(true)
      );
    });
    it('should return false if it receives a falsy value', () => {
      [0, '', false, undefined, null, NaN].forEach((value) =>
        expect(isTruthy(value)).toBe(false)
      );
    });
    it('should remove falsy values from an array', () => {
      const array = [0, -100, '', 'string', false, true, undefined, null, NaN];
      const filteredArray = array.filter(isTruthy);
      expect(filteredArray).toEqual([-100, 'string', true]);
    });
    it('should narrow the type of a filtered array', () => {
      const array = [10, null, 'string', undefined];
      const filteredArray: Array<string | number> = array.filter(isTruthy);
      expect(filteredArray).toEqual([10, 'string']);
    });
  });
});
