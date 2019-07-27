import chaiPassport, { Chai, MockStrategy } from 'chai-passport-strategy';

const chai: Chai = {
  passport: {
    use: (strategy): MockStrategy => {
      (strategy as MockStrategy).req = (): void => {};
      return strategy as MockStrategy;
    },
  },
};
chaiPassport(chai);
const { passport } = chai;

export { passport };
