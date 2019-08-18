import { lookup } from './utils';

describe('Utils', (): void => {
  describe('lookup method', (): void => {
    it('should return null when object is not provided', (): void => {
      expect(lookup(undefined, 'token')).toBeNull();
    });

    it('should return the correct value', (): void => {
      const result = 'result';
      const obj = { token: result };
      expect(lookup(obj, 'token')).toEqual(result);
    });

    it('should return null', (): void => {
      const result = 'result';
      const obj = { token: result };
      expect(lookup(obj, 'unknownKey')).toBeNull();
    });

    it('should return null when the field is an empty string', (): void => {
      const result = 'result';
      const obj = { token: result };
      expect(lookup(obj, '')).toBeNull();
    });

    it('should not mutate the object passed as param', (): void => {
      const result = 'result';
      const obj = { token: result };
      expect(lookup(obj, 'token')).toEqual(result);
      expect(obj).toEqual({ token: result });
    });

    it('should find a nested property', (): void => {
      const result = 'result';
      const obj = { token: { unique: result } };
      expect(lookup(obj, 'token[unique]')).toEqual(result);
      expect(obj).toEqual({ token: { unique: result } });
    });
  });
});
