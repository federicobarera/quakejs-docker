import { Construct } from "constructs";

export const map =
  <T, T2>(f: (v: T) => T2) =>
  (value: T | undefined) => {
    if (value === undefined) return undefined;
    return f(value);
  };

export const mapOr =
  <T, T2>(f: (v: T) => T2, orFunc: () => T2) =>
  (value: T | undefined) => {
    if (value === undefined) return orFunc();
    return f(value);
  };

export const getContext = (scope: Construct) => {
  const tryGet = <T = any>(key: string) => {
    return scope.node.tryGetContext(key) as T | undefined;
  };

  return {
    tryGet,
  };
};
