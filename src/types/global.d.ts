/**
 * OptiMind AI Ecosystem - Global Type Declarations
 * Premium Diamond Grade Global Type Definitions for Browser and Node.js APIs
 */

// Global browser APIs
declare var console: {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
};

declare var setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
declare var clearTimeout: (id: number) => void;
declare var setInterval: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
declare var clearInterval: (id: number) => void;

// Node.js Buffer type for compatibility
declare var Buffer: {
  from: (data: any, encoding?: string) => Buffer;
  alloc: (size: number) => Buffer;
  isBuffer: (obj: any) => boolean;
};

// Crypto API
declare var crypto: {
  getRandomValues: (array: Uint8Array) => void;
  subtle: {
    encrypt: (algorithm: any, key: any, data: any) => Promise<any>;
    decrypt: (algorithm: any, key: any, data: any) => Promise<any>;
  };
};

// Performance API
declare var performance: {
  now: () => number;
  mark: (name: string) => void;
  measure: (name: string, startMark?: string, endMark?: string) => void;
};

// Fetch API
declare var fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
declare var Request: any;
declare var Response: any;
declare var Headers: any;

// URL API
declare var URL: any;
declare var URLSearchParams: any;

// Web Storage API
declare var localStorage: Storage;
declare var sessionStorage: Storage;
interface Storage {
  length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
  [key: string]: any;
}

// Document API (for browser environment)
declare var document: {
  getElementById(id: string): HTMLElement | null;
  getElementsByClassName(className: string): HTMLCollectionOf<Element>;
  getElementsByTagName(tagName: string): HTMLCollectionOf<Element>;
  createElement(tagName: string): HTMLElement;
  querySelector(selector: string): Element | null;
  querySelectorAll(selector: string): NodeListOf<Element>;
};

declare var window: Window & typeof globalThis;

// Extend Window interface with additional properties
interface Window {
  __NEXT_DATA__: any;
  [key: string]: any;
}

// Global process type (for Node.js environment)
declare var process: {
  env: {
    [key: string]: string | undefined;
  };
  nextTick: (callback: (...args: any[]) => void, ...args: any[]) => void;
  versions: {
    node: string;
    [key: string]: string;
  };
};

// Global type extensions
interface String {
  format(...args: any[]): string;
}

interface Array<T> {
  isEmpty(): boolean;
  first(): T | undefined;
  last(): T | undefined;
}

// Utility types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error handling
interface CustomError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

// Global event types
interface GlobalEventHandlers {
  onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onerror: ((this: GlobalEventHandlers, ev: ErrorEvent) => any) | null;
}

// Extend ErrorEvent interface
interface ErrorEvent extends Event {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;
}

// Global performance monitoring
interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

interface PerformanceObserver {
  observe: (entryTypes: string[]) => void;
  disconnect: () => void;
}

declare var PerformanceObserver: {
  new (callback: (entries: PerformanceObserverEntryList, observer: PerformanceObserver) => void): PerformanceObserver;
};

interface PerformanceObserverEntryList {
  getEntries(): PerformanceEntry[];
  getEntriesByName(name: string): PerformanceEntry[];
  getEntriesByType(type: string): PerformanceEntry[];
}

// Global crypto extensions
interface Crypto {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
  subtle: SubtleCrypto;
}

interface SubtleCrypto {
  encrypt(algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  decrypt(algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  sign(algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
  verify(algorithm: AlgorithmIdentifier, key: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean>;
  digest(algorithm: AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer>;
  generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
  deriveKey(algorithm: AlgorithmIdentifier, baseKey: CryptoKey, derivedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
}

interface AlgorithmIdentifier {
  name: string;
  [key: string]: any;
}

interface CryptoKey {
  type: string;
  extractable: boolean;
  algorithm: AlgorithmIdentifier;
  usages: KeyUsage[];
}

type KeyUsage = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'deriveKey' | 'deriveBits' | 'wrapKey' | 'unwrapKey';

// Buffer source types
type BufferSource = ArrayBufferView | ArrayBuffer;

// Global Web APIs
declare var atob: (data: string) => string;
declare var btoa: (data: string) => string;

// Global URL extensions
interface URL {
  searchParams: URLSearchParams;
}

// Global performance extensions
declare var performance: Performance;

interface Performance {
  now(): number;
  mark(name: string): void;
  clearMarks(name?: string): void;
  measure(name: string, startMark?: string, endMark?: string): void;
  clearMeasures(name?: string): void;
  getEntriesByName(name: string): PerformanceEntry[];
  getEntriesByType(type: string): PerformanceEntry[];
  getEntries(): PerformanceEntry[];
  clearResourceTimings(): void;
  setResourceTimingBufferSize(maxSize: number): void;
  toJSON(): any;
}

// Global error handling
interface ErrorEvent extends Event {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;
}

// Global promise extensions
interface PromiseConstructor {
  allSettled<T>(promises: Promise<T>[]): Promise<PromiseSettledResult<T>>;
}

interface PromiseSettledResult<T> {
  status: 'fulfilled' | 'rejected';
  value?: T;
  reason?: any;
}

// Global array extensions
interface ArrayConstructor {
  from<T>(arrayLike: ArrayLike<T>): T[];
  of<T>(...items: T[]): T[];
}

// Global object extensions
interface ObjectConstructor {
  assign<T, U>(target: T, source: U): T & U;
  entries<T>(o: { [s: string]: T } | ArrayLike<T>): [string, T][];
  values<T>(o: { [s: string]: T } | ArrayLike<T>): T[];
  keys<T>(o: { [s: string]: T } | ArrayLike<T>): string[];
  is<T>(value: T): value is T;
}

// Global string extensions
interface StringConstructor {
  fromCharCode(...codes: number[]): string;
  fromCodePoint(...codePoints: number[]): string;
  raw(template: TemplateStringsArray, ...substitutions: any[]): string;
}

// Global number extensions
interface NumberConstructor {
  isFinite(value: number): boolean;
  isInteger(value: number): boolean;
  isNaN(value: number): boolean;
  isSafeInteger(value: number): boolean;
  parseFloat(string: string): number;
  parseInt(string: string, radix?: number): number;
  EPSILON: number;
  MAX_SAFE_INTEGER: number;
  MIN_SAFE_INTEGER: number;
  MAX_VALUE: number;
  MIN_VALUE: number;
  NaN: number;
  NEGATIVE_INFINITY: number;
  POSITIVE_INFINITY: number;
}

// Global math extensions
interface Math {
  E: number;
  LN10: number;
  LN2: number;
  LOG10E: number;
  LOG2E: number;
  PI: number;
  SQRT1_2: number;
  SQRT2: number;
  abs(x: number): number;
  acos(x: number): number;
  acosh(x: number): number;
  asin(x: number): number;
  asinh(x: number): number;
  atan(x: number): number;
  atanh(x: number): number;
  atan2(y: number, x: number): number;
  cbrt(x: number): number;
  ceil(x: number): number;
  clz32(x: number): number;
  cos(x: number): number;
  cosh(x: number): number;
  exp(x: number): number;
  expm1(x: number): number;
  floor(x: number): number;
  fround(x: number): number;
  hypot(...values: number[]): number;
  imul(x: number, y: number): number;
  log(x: number): number;
  log1p(x: number): number;
  log10(x: number): number;
  log2(x: number): number;
  max(...values: number[]): number;
  min(...values: number[]): number;
  pow(x: number, y: number): number;
  random(): number;
  round(x: number): number;
  sign(x: number): number;
  sin(x: number): number;
  sinh(x: number): number;
  sqrt(x: number): number;
  tan(x: number): number;
  tanh(x: number): number;
  trunc(x: number): number;
}

// Global date extensions
interface Date {
  toISOString(): string;
  toJSON(key?: any): string;
  toString(): string;
  toDateString(): string;
  toTimeString(): string;
  toLocaleString(): string;
  toLocaleDateString(): string;
  toLocaleTimeString(): string;
  getTime(): number;
  getTimezoneOffset(): number;
  setTime(time: number): number;
  getMilliseconds(): number;
  getUTCMilliseconds(): number;
  getSeconds(): number;
  getUTCSeconds(): number;
  getMinutes(): number;
  getUTCMinutes(): number;
  getHours(): number;
  getUTCHours(): number;
  getDay(): number;
  getUTCDay(): number;
  getDate(): number;
  getUTCDate(): number;
  getMonth(): number;
  getUTCMonth(): number;
  getFullYear(): number;
  getUTCFullYear(): number;
  setMilliseconds(ms: number): number;
  setUTCMilliseconds(ms: number): number;
  setSeconds(sec: number, ms?: number): number;
  setUTCSeconds(sec: number, ms?: number): number;
  setMinutes(min: number, sec?: number, ms?: number): number;
  setUTCMinutes(min: number, sec?: number, ms?: number): number;
  setHours(hours: number, min?: number, sec?: number, ms?: number): number;
  setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number;
  setDate(date: number): number;
  setUTCDate(date: number): number;
  setMonth(month: number, date?: number): number;
  setUTCMonth(month: number, date?: number): number;
  setFullYear(year: number, month?: number, date?: number): number;
  setUTCFullYear(year: number, month?: number, date?: number): number;
  toUTCString(): string;
  toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
  toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
  toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
}

// Global JSON extensions
interface JSON {
  parse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
  stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
}

// Global encode/decode URI extensions
declare var encodeURI: (uri: string) => string;
declare var encodeURIComponent: (uri: string) => string;
declare var decodeURI: (encodedURI: string) => string;
declare var decodeURIComponent: (encodedURIComponent: string) => string;

// Global Intl extensions
declare var Intl: {
  Collator: any;
  DateTimeFormat: any;
  NumberFormat: any;
  PluralRules: any;
  getCanonicalLocales(locales: string[]): string[];
};

// Global Reflect extensions
declare var Reflect: {
  apply(target: any, thisArgument: any, argumentsList: any[]): any;
  construct(target: any, argumentsList: any[], newTarget?: any): any;
  defineProperty(target: any, propertyKey: PropertyKey, attributes: PropertyDescriptor): boolean;
  deleteProperty(target: any, propertyKey: PropertyKey): boolean;
  get(target: any, propertyKey: PropertyKey): any;
  getOwnPropertyDescriptor(target: any, propertyKey: PropertyKey): PropertyDescriptor | undefined;
  getPrototypeOf(target: any): any;
  has(target: any, propertyKey: PropertyKey): boolean;
  isExtensible(target: any): boolean;
  ownKeys(target: any): PropertyKey[];
  preventExtensions(target: any): boolean;
  set(target: any, propertyKey: PropertyKey, value: any, receiver?: any): boolean;
  setPrototypeOf(target: any, proto: any): any;
};

// Global Proxy extensions
declare var Proxy: {
  revocable<T extends object>(target: T, handler: ProxyHandler<T>): { proxy: T; revoke: () => void };
  new <T extends object>(target: T, handler: ProxyHandler<T>): T;
};

interface ProxyHandler<T extends object> {
  apply?(target: T, thisArg: any, argArray: any[]): any;
  construct?(target: T, argArray: any[], newTarget?: any): object;
  defineProperty?(target: T, property: PropertyKey, attributes: PropertyDescriptor): boolean;
  deleteProperty?(target: T, property: PropertyKey): boolean;
  get?(target: T, property: PropertyKey, receiver: any): any;
  getOwnPropertyDescriptor?(target: T, property: PropertyKey): PropertyDescriptor | undefined;
  getPrototypeOf?(target: T): any;
  has?(target: T, property: PropertyKey): boolean;
  isExtensible?(target: T): boolean;
  ownKeys?(target: T): PropertyKey[];
  preventExtensions?(target: T): boolean;
  set?(target: T, property: PropertyKey, value: any, receiver: any): boolean;
  setPrototypeOf?(target: T, proto: any): boolean;
}

// Global Map, Set, WeakMap, WeakSet extensions
interface MapConstructor {
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<any, any>;
}

interface SetConstructor {
  new <T>(values?: readonly T[] | null): Set<T>;
  readonly prototype: Set<any>;
}

interface WeakMapConstructor {
  new <K extends object, V>(entries?: readonly (readonly [K, V])[] | null): WeakMap<K, V>;
  readonly prototype: WeakMap<object, any>;
}

interface WeakSetConstructor {
  new <T extends object>(values?: readonly T[] | null): WeakSet<T>;
  readonly prototype: WeakSet<object>;
}

// Global Symbol extensions
interface SymbolConstructor {
  (description?: string | number): symbol;
  readonly prototype: Symbol;
  readonly length: number;
  readonly toStringTag: unique symbol;
  readonly iterator: unique symbol;
  readonly asyncIterator: unique symbol;
  readonly match: unique symbol;
  readonly replace: unique symbol;
  readonly search: unique symbol;
  readonly split: unique symbol;
  readonly hasInstance: unique symbol;
  readonly isConcatSpreadable: unique symbol;
  readonly unscopables: unique symbol;
  species: unique symbol;
  for(key: string): symbol;
  keyFor(sym: symbol): string | undefined;
}

// Global TypedArray extensions
interface ArrayBufferConstructor {
  new (byteLength: number): ArrayBuffer;
  readonly prototype: ArrayBuffer;
  isView(arg: any): arg is ArrayBufferView;
}

interface ArrayBufferView {
  buffer: ArrayBuffer;
  byteLength: number;
  byteOffset: number;
}

interface Uint8ArrayConstructor {
  new (length: number): Uint8Array;
  new (array: ArrayLike<number> | ArrayBufferLike): Uint8Array;
  new (elements: Iterable<number>): Uint8Array;
  readonly prototype: Uint8Array;
  readonly BYTES_PER_ELEMENT: number;
}

// Global Promise extensions
interface PromiseConstructor {
  new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
  readonly prototype: Promise<any>;
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
  reject<T>(reason?: any): Promise<T>;
  all<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
  race<T>(promises: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}

// Global Generator extensions
interface GeneratorFunctionConstructor {
  new (...args: any[]): GeneratorFunction;
  readonly prototype: GeneratorFunction;
}

interface GeneratorFunction extends Function {
  readonly prototype: Generator;
}

interface Generator extends Iterator<any> {
  next(value?: any): IteratorResult<any>;
  return(value?: any): IteratorResult<any>;
  throw(exception?: any): IteratorResult<any>;
  [Symbol.iterator](): Generator;
}

// Global AsyncGenerator extensions
interface AsyncGeneratorFunctionConstructor {
  new (...args: any[]): AsyncGeneratorFunction;
  readonly prototype: AsyncGeneratorFunction;
}

interface AsyncGeneratorFunction extends Function {
  readonly prototype: AsyncGenerator;
}

interface AsyncGenerator extends AsyncIterator<any> {
  next(value?: any): Promise<IteratorResult<any>>;
  return(value?: any): Promise<IteratorResult<any>>;
  throw(exception?: any): Promise<IteratorResult<any>>;
  [Symbol.asyncIterator](): AsyncGenerator;
}

// Global Iterator extensions
interface Iterator<T, TReturn = any, TNext = undefined> {
  next(value?: TNext): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

interface IteratorResult<T, TReturn = any> {
  done: boolean;
  value: T;
}

interface AsyncIterator<T, TReturn = any, TNext = undefined> {
  next(value?: TNext): Promise<IteratorResult<T, TReturn>>;
  return?(value?: TReturn): Promise<IteratorResult<T, TReturn>>;
  throw?(e?: any): Promise<IteratorResult<T, TReturn>>;
}

// Global WebAssembly extensions
declare var WebAssembly: {
  instantiate(source: BufferSource | WebAssembly.Module, imports?: any): Promise<WebAssembly.Instance>;
  compile(source: BufferSource): Promise<WebAssembly.Module>;
  validate(source: BufferSource): boolean;
  Module: WebAssembly.ModuleConstructor;
  Instance: WebAssembly.InstanceConstructor;
  Memory: WebAssembly.MemoryConstructor;
  Table: WebAssembly.TableConstructor;
  Global: WebAssembly.GlobalConstructor;
  CompileError: WebAssembly.CompileErrorConstructor;
  LinkError: WebAssembly.LinkErrorConstructor;
  RuntimeError: WebAssembly.RuntimeErrorConstructor;
};

interface WebAssemblyModuleConstructor {
  new (source: BufferSource): WebAssembly.Module;
  customSections(moduleObject: WebAssembly.Module): WebAssembly.CustomSections;
  exports(moduleObject: WebAssembly.Module): WebAssembly.ModuleExports;
  imports(moduleObject: WebAssembly.Module): WebAssembly.ModuleImports;
}

interface WebAssemblyInstanceConstructor {
  new (module: WebAssembly.Module, importObject?: any): WebAssembly.Instance;
}

interface WebAssemblyMemoryConstructor {
  new (descriptor: WebAssembly.MemoryDescriptor): WebAssembly.Memory;
}

interface WebAssemblyTableConstructor {
  new (descriptor: WebAssembly.TableDescriptor): WebAssembly.Table;
}

interface WebAssemblyGlobalConstructor {
  new (descriptor: WebAssembly.GlobalDescriptor, value?: any): WebAssembly.Global;
}

interface WebAssemblyCompileErrorConstructor {
  new (message?: string): WebAssembly.CompileError;
}

interface WebAssemblyLinkErrorConstructor {
  new (message?: string): WebAssembly.LinkError;
}

interface WebAssemblyRuntimeErrorConstructor {
  new (message?: string): WebAssembly.RuntimeError;
}

// Global Atomics extensions
declare var Atomics: {
  add(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  and(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  compareExchange(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, expectedValue: number, replacementValue: number): number;
  exchange(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  isLockFree(size: number): boolean;
  load(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number): number;
  or(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  store(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  sub(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  xor(typedArray: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, index: number, value: number): number;
  wait(typedArray: Int32Array | BigInt64Array, index: number, value: number, timeout?: number): 'ok' | 'not-equal' | 'timed-out';
  notify(typedArray: Int32Array | BigInt64Array, index: number, count: number): number;
};

// Global SharedArrayBuffer extensions
declare var SharedArrayBuffer: {
  new (byteLength: number): SharedArrayBuffer;
  readonly prototype: SharedArrayBuffer;
};

// Global BigInt extensions
declare var BigInt: {
  (value: number | bigint | string): bigint;
  asIntN(bits: number, bigint: bigint): bigint;
  asUintN(bits: number, bigint: bigint): bigint;
};

// Global FinalizationRegistry extensions
declare var FinalizationRegistry: {
  new <T>(cleanupCallback: (heldValue: T) => void): FinalizationRegistry<T>;
  readonly prototype: FinalizationRegistry<any>;
};

// Global WeakRef extensions
declare var WeakRef: {
  new <T>(target: T): WeakRef<T>;
  readonly prototype: WeakRef<any>;
};

// End of global type declarations