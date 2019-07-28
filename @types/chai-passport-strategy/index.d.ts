/// <reference types="node" />

declare module 'chai-passport-strategy' {
  import { Strategy } from 'passport-strategy';

  type MockStrategy = Strategy & { req: any; fail: any };

  export interface Chai {
    passport: {
      use: (strategy: Strategy) => MockStrategy;
    };
  }

  export default function chaiPassport(chai: Chai): void;
}
