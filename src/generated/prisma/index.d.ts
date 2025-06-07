
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Candidatos
 * 
 */
export type Candidatos = $Result.DefaultSelection<Prisma.$CandidatosPayload>
/**
 * Model usuario
 * 
 */
export type usuario = $Result.DefaultSelection<Prisma.$usuarioPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Candidatos
 * const candidatos = await prisma.candidatos.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Candidatos
   * const candidatos = await prisma.candidatos.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.candidatos`: Exposes CRUD operations for the **Candidatos** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Candidatos
    * const candidatos = await prisma.candidatos.findMany()
    * ```
    */
  get candidatos(): Prisma.CandidatosDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.usuarioDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Candidatos: 'Candidatos',
    usuario: 'usuario'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "candidatos" | "usuario"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Candidatos: {
        payload: Prisma.$CandidatosPayload<ExtArgs>
        fields: Prisma.CandidatosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CandidatosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CandidatosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          findFirst: {
            args: Prisma.CandidatosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CandidatosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          findMany: {
            args: Prisma.CandidatosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>[]
          }
          create: {
            args: Prisma.CandidatosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          createMany: {
            args: Prisma.CandidatosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CandidatosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>[]
          }
          delete: {
            args: Prisma.CandidatosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          update: {
            args: Prisma.CandidatosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          deleteMany: {
            args: Prisma.CandidatosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CandidatosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CandidatosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>[]
          }
          upsert: {
            args: Prisma.CandidatosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidatosPayload>
          }
          aggregate: {
            args: Prisma.CandidatosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCandidatos>
          }
          groupBy: {
            args: Prisma.CandidatosGroupByArgs<ExtArgs>
            result: $Utils.Optional<CandidatosGroupByOutputType>[]
          }
          count: {
            args: Prisma.CandidatosCountArgs<ExtArgs>
            result: $Utils.Optional<CandidatosCountAggregateOutputType> | number
          }
        }
      }
      usuario: {
        payload: Prisma.$usuarioPayload<ExtArgs>
        fields: Prisma.usuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          findFirst: {
            args: Prisma.usuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          findMany: {
            args: Prisma.usuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>[]
          }
          create: {
            args: Prisma.usuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          createMany: {
            args: Prisma.usuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>[]
          }
          delete: {
            args: Prisma.usuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          update: {
            args: Prisma.usuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          deleteMany: {
            args: Prisma.usuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>[]
          }
          upsert: {
            args: Prisma.usuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.usuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.usuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    candidatos?: CandidatosOmit
    usuario?: usuarioOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Candidatos
   */

  export type AggregateCandidatos = {
    _count: CandidatosCountAggregateOutputType | null
    _avg: CandidatosAvgAggregateOutputType | null
    _sum: CandidatosSumAggregateOutputType | null
    _min: CandidatosMinAggregateOutputType | null
    _max: CandidatosMaxAggregateOutputType | null
  }

  export type CandidatosAvgAggregateOutputType = {
    idCandidato: number | null
  }

  export type CandidatosSumAggregateOutputType = {
    idCandidato: bigint | null
  }

  export type CandidatosMinAggregateOutputType = {
    idCandidato: bigint | null
    created_at: Date | null
    nomeCandidato: string | null
    cpfCandidato: string | null
    rgCandidato: string | null
    sexoCandidato: string | null
    estadocivilCandidato: string | null
    cnhCandidato: string | null
    outrosexoCandidato: string | null
    categoriacnhCandidato: string | null
    emailCandidato: string | null
    datanascimentoCandidato: Date | null
    linkedinCandidato: string | null
    facebookCandidato: string | null
    instagramCandidato: string | null
    telefoneCandidato: string | null
    telefone2Candidato: string | null
    pcdCandidato: string | null
    cidareacandidato: string | null
    cepCandidato: string | null
    ruaCandidato: string | null
    numeroCandidato: string | null
    bairroCandidato: string | null
    cidadeCandidato: string | null
    estadoCandidato: string | null
    vagainteresseCandidato: string | null
    escolaridadeCandidato: string | null
    conhecimentosCandidato: string | null
    wordCandidato: string | null
    excelCandidato: string | null
    powerpointCandidato: string | null
    conhecimentosinformaticaCandidato: string | null
    conhecimentoinfcandidato: string | null
    possuiexperienciaCandidato: string | null
    empresaCandidato: string | null
    local1Candidato: string | null
    atividadesdesenvolvidas1Candidato: string | null
    datainicioCandidato: Date | null
    trabalha1Candidato: string | null
    datafinalCandidato: Date | null
    empresa2Candidato: string | null
    local2Candidato: string | null
    atividadesdesenvolvidas2Candidato: string | null
    datainicio2Candidato: Date | null
    trabalha2Candidato: string | null
    datafinal2Candidato: Date | null
    empresa3Candidato: string | null
    local3Candidato: string | null
    atividadesdesenvolvidas3Candidato: string | null
    datainicio3Candidato: Date | null
    trabalha3Candidato: string | null
    datafinal3Candidato: Date | null
    fotoCandidato: string | null
    parentescoCandidato: string | null
    graudeparentescoenomeCandidato: string | null
    datacadastroCandidato: Date | null
    situacaoCandidato: string | null
    opcionalCandidato: string | null
  }

  export type CandidatosMaxAggregateOutputType = {
    idCandidato: bigint | null
    created_at: Date | null
    nomeCandidato: string | null
    cpfCandidato: string | null
    rgCandidato: string | null
    sexoCandidato: string | null
    estadocivilCandidato: string | null
    cnhCandidato: string | null
    outrosexoCandidato: string | null
    categoriacnhCandidato: string | null
    emailCandidato: string | null
    datanascimentoCandidato: Date | null
    linkedinCandidato: string | null
    facebookCandidato: string | null
    instagramCandidato: string | null
    telefoneCandidato: string | null
    telefone2Candidato: string | null
    pcdCandidato: string | null
    cidareacandidato: string | null
    cepCandidato: string | null
    ruaCandidato: string | null
    numeroCandidato: string | null
    bairroCandidato: string | null
    cidadeCandidato: string | null
    estadoCandidato: string | null
    vagainteresseCandidato: string | null
    escolaridadeCandidato: string | null
    conhecimentosCandidato: string | null
    wordCandidato: string | null
    excelCandidato: string | null
    powerpointCandidato: string | null
    conhecimentosinformaticaCandidato: string | null
    conhecimentoinfcandidato: string | null
    possuiexperienciaCandidato: string | null
    empresaCandidato: string | null
    local1Candidato: string | null
    atividadesdesenvolvidas1Candidato: string | null
    datainicioCandidato: Date | null
    trabalha1Candidato: string | null
    datafinalCandidato: Date | null
    empresa2Candidato: string | null
    local2Candidato: string | null
    atividadesdesenvolvidas2Candidato: string | null
    datainicio2Candidato: Date | null
    trabalha2Candidato: string | null
    datafinal2Candidato: Date | null
    empresa3Candidato: string | null
    local3Candidato: string | null
    atividadesdesenvolvidas3Candidato: string | null
    datainicio3Candidato: Date | null
    trabalha3Candidato: string | null
    datafinal3Candidato: Date | null
    fotoCandidato: string | null
    parentescoCandidato: string | null
    graudeparentescoenomeCandidato: string | null
    datacadastroCandidato: Date | null
    situacaoCandidato: string | null
    opcionalCandidato: string | null
  }

  export type CandidatosCountAggregateOutputType = {
    idCandidato: number
    created_at: number
    nomeCandidato: number
    cpfCandidato: number
    rgCandidato: number
    sexoCandidato: number
    estadocivilCandidato: number
    cnhCandidato: number
    outrosexoCandidato: number
    categoriacnhCandidato: number
    emailCandidato: number
    datanascimentoCandidato: number
    linkedinCandidato: number
    facebookCandidato: number
    instagramCandidato: number
    telefoneCandidato: number
    telefone2Candidato: number
    pcdCandidato: number
    cidareacandidato: number
    cepCandidato: number
    ruaCandidato: number
    numeroCandidato: number
    bairroCandidato: number
    cidadeCandidato: number
    estadoCandidato: number
    vagainteresseCandidato: number
    escolaridadeCandidato: number
    conhecimentosCandidato: number
    wordCandidato: number
    excelCandidato: number
    powerpointCandidato: number
    conhecimentosinformaticaCandidato: number
    conhecimentoinfcandidato: number
    possuiexperienciaCandidato: number
    empresaCandidato: number
    local1Candidato: number
    atividadesdesenvolvidas1Candidato: number
    datainicioCandidato: number
    trabalha1Candidato: number
    datafinalCandidato: number
    empresa2Candidato: number
    local2Candidato: number
    atividadesdesenvolvidas2Candidato: number
    datainicio2Candidato: number
    trabalha2Candidato: number
    datafinal2Candidato: number
    empresa3Candidato: number
    local3Candidato: number
    atividadesdesenvolvidas3Candidato: number
    datainicio3Candidato: number
    trabalha3Candidato: number
    datafinal3Candidato: number
    fotoCandidato: number
    parentescoCandidato: number
    graudeparentescoenomeCandidato: number
    datacadastroCandidato: number
    situacaoCandidato: number
    opcionalCandidato: number
    _all: number
  }


  export type CandidatosAvgAggregateInputType = {
    idCandidato?: true
  }

  export type CandidatosSumAggregateInputType = {
    idCandidato?: true
  }

  export type CandidatosMinAggregateInputType = {
    idCandidato?: true
    created_at?: true
    nomeCandidato?: true
    cpfCandidato?: true
    rgCandidato?: true
    sexoCandidato?: true
    estadocivilCandidato?: true
    cnhCandidato?: true
    outrosexoCandidato?: true
    categoriacnhCandidato?: true
    emailCandidato?: true
    datanascimentoCandidato?: true
    linkedinCandidato?: true
    facebookCandidato?: true
    instagramCandidato?: true
    telefoneCandidato?: true
    telefone2Candidato?: true
    pcdCandidato?: true
    cidareacandidato?: true
    cepCandidato?: true
    ruaCandidato?: true
    numeroCandidato?: true
    bairroCandidato?: true
    cidadeCandidato?: true
    estadoCandidato?: true
    vagainteresseCandidato?: true
    escolaridadeCandidato?: true
    conhecimentosCandidato?: true
    wordCandidato?: true
    excelCandidato?: true
    powerpointCandidato?: true
    conhecimentosinformaticaCandidato?: true
    conhecimentoinfcandidato?: true
    possuiexperienciaCandidato?: true
    empresaCandidato?: true
    local1Candidato?: true
    atividadesdesenvolvidas1Candidato?: true
    datainicioCandidato?: true
    trabalha1Candidato?: true
    datafinalCandidato?: true
    empresa2Candidato?: true
    local2Candidato?: true
    atividadesdesenvolvidas2Candidato?: true
    datainicio2Candidato?: true
    trabalha2Candidato?: true
    datafinal2Candidato?: true
    empresa3Candidato?: true
    local3Candidato?: true
    atividadesdesenvolvidas3Candidato?: true
    datainicio3Candidato?: true
    trabalha3Candidato?: true
    datafinal3Candidato?: true
    fotoCandidato?: true
    parentescoCandidato?: true
    graudeparentescoenomeCandidato?: true
    datacadastroCandidato?: true
    situacaoCandidato?: true
    opcionalCandidato?: true
  }

  export type CandidatosMaxAggregateInputType = {
    idCandidato?: true
    created_at?: true
    nomeCandidato?: true
    cpfCandidato?: true
    rgCandidato?: true
    sexoCandidato?: true
    estadocivilCandidato?: true
    cnhCandidato?: true
    outrosexoCandidato?: true
    categoriacnhCandidato?: true
    emailCandidato?: true
    datanascimentoCandidato?: true
    linkedinCandidato?: true
    facebookCandidato?: true
    instagramCandidato?: true
    telefoneCandidato?: true
    telefone2Candidato?: true
    pcdCandidato?: true
    cidareacandidato?: true
    cepCandidato?: true
    ruaCandidato?: true
    numeroCandidato?: true
    bairroCandidato?: true
    cidadeCandidato?: true
    estadoCandidato?: true
    vagainteresseCandidato?: true
    escolaridadeCandidato?: true
    conhecimentosCandidato?: true
    wordCandidato?: true
    excelCandidato?: true
    powerpointCandidato?: true
    conhecimentosinformaticaCandidato?: true
    conhecimentoinfcandidato?: true
    possuiexperienciaCandidato?: true
    empresaCandidato?: true
    local1Candidato?: true
    atividadesdesenvolvidas1Candidato?: true
    datainicioCandidato?: true
    trabalha1Candidato?: true
    datafinalCandidato?: true
    empresa2Candidato?: true
    local2Candidato?: true
    atividadesdesenvolvidas2Candidato?: true
    datainicio2Candidato?: true
    trabalha2Candidato?: true
    datafinal2Candidato?: true
    empresa3Candidato?: true
    local3Candidato?: true
    atividadesdesenvolvidas3Candidato?: true
    datainicio3Candidato?: true
    trabalha3Candidato?: true
    datafinal3Candidato?: true
    fotoCandidato?: true
    parentescoCandidato?: true
    graudeparentescoenomeCandidato?: true
    datacadastroCandidato?: true
    situacaoCandidato?: true
    opcionalCandidato?: true
  }

  export type CandidatosCountAggregateInputType = {
    idCandidato?: true
    created_at?: true
    nomeCandidato?: true
    cpfCandidato?: true
    rgCandidato?: true
    sexoCandidato?: true
    estadocivilCandidato?: true
    cnhCandidato?: true
    outrosexoCandidato?: true
    categoriacnhCandidato?: true
    emailCandidato?: true
    datanascimentoCandidato?: true
    linkedinCandidato?: true
    facebookCandidato?: true
    instagramCandidato?: true
    telefoneCandidato?: true
    telefone2Candidato?: true
    pcdCandidato?: true
    cidareacandidato?: true
    cepCandidato?: true
    ruaCandidato?: true
    numeroCandidato?: true
    bairroCandidato?: true
    cidadeCandidato?: true
    estadoCandidato?: true
    vagainteresseCandidato?: true
    escolaridadeCandidato?: true
    conhecimentosCandidato?: true
    wordCandidato?: true
    excelCandidato?: true
    powerpointCandidato?: true
    conhecimentosinformaticaCandidato?: true
    conhecimentoinfcandidato?: true
    possuiexperienciaCandidato?: true
    empresaCandidato?: true
    local1Candidato?: true
    atividadesdesenvolvidas1Candidato?: true
    datainicioCandidato?: true
    trabalha1Candidato?: true
    datafinalCandidato?: true
    empresa2Candidato?: true
    local2Candidato?: true
    atividadesdesenvolvidas2Candidato?: true
    datainicio2Candidato?: true
    trabalha2Candidato?: true
    datafinal2Candidato?: true
    empresa3Candidato?: true
    local3Candidato?: true
    atividadesdesenvolvidas3Candidato?: true
    datainicio3Candidato?: true
    trabalha3Candidato?: true
    datafinal3Candidato?: true
    fotoCandidato?: true
    parentescoCandidato?: true
    graudeparentescoenomeCandidato?: true
    datacadastroCandidato?: true
    situacaoCandidato?: true
    opcionalCandidato?: true
    _all?: true
  }

  export type CandidatosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Candidatos to aggregate.
     */
    where?: CandidatosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Candidatos to fetch.
     */
    orderBy?: CandidatosOrderByWithRelationInput | CandidatosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CandidatosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Candidatos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Candidatos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Candidatos
    **/
    _count?: true | CandidatosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CandidatosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CandidatosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CandidatosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CandidatosMaxAggregateInputType
  }

  export type GetCandidatosAggregateType<T extends CandidatosAggregateArgs> = {
        [P in keyof T & keyof AggregateCandidatos]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCandidatos[P]>
      : GetScalarType<T[P], AggregateCandidatos[P]>
  }




  export type CandidatosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CandidatosWhereInput
    orderBy?: CandidatosOrderByWithAggregationInput | CandidatosOrderByWithAggregationInput[]
    by: CandidatosScalarFieldEnum[] | CandidatosScalarFieldEnum
    having?: CandidatosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CandidatosCountAggregateInputType | true
    _avg?: CandidatosAvgAggregateInputType
    _sum?: CandidatosSumAggregateInputType
    _min?: CandidatosMinAggregateInputType
    _max?: CandidatosMaxAggregateInputType
  }

  export type CandidatosGroupByOutputType = {
    idCandidato: bigint
    created_at: Date
    nomeCandidato: string | null
    cpfCandidato: string | null
    rgCandidato: string | null
    sexoCandidato: string | null
    estadocivilCandidato: string | null
    cnhCandidato: string | null
    outrosexoCandidato: string | null
    categoriacnhCandidato: string | null
    emailCandidato: string | null
    datanascimentoCandidato: Date | null
    linkedinCandidato: string | null
    facebookCandidato: string | null
    instagramCandidato: string | null
    telefoneCandidato: string | null
    telefone2Candidato: string | null
    pcdCandidato: string | null
    cidareacandidato: string | null
    cepCandidato: string | null
    ruaCandidato: string | null
    numeroCandidato: string | null
    bairroCandidato: string | null
    cidadeCandidato: string | null
    estadoCandidato: string | null
    vagainteresseCandidato: string | null
    escolaridadeCandidato: string | null
    conhecimentosCandidato: string | null
    wordCandidato: string | null
    excelCandidato: string | null
    powerpointCandidato: string | null
    conhecimentosinformaticaCandidato: string | null
    conhecimentoinfcandidato: string | null
    possuiexperienciaCandidato: string | null
    empresaCandidato: string | null
    local1Candidato: string | null
    atividadesdesenvolvidas1Candidato: string | null
    datainicioCandidato: Date | null
    trabalha1Candidato: string | null
    datafinalCandidato: Date | null
    empresa2Candidato: string | null
    local2Candidato: string | null
    atividadesdesenvolvidas2Candidato: string | null
    datainicio2Candidato: Date | null
    trabalha2Candidato: string | null
    datafinal2Candidato: Date | null
    empresa3Candidato: string | null
    local3Candidato: string | null
    atividadesdesenvolvidas3Candidato: string | null
    datainicio3Candidato: Date | null
    trabalha3Candidato: string | null
    datafinal3Candidato: Date | null
    fotoCandidato: string | null
    parentescoCandidato: string | null
    graudeparentescoenomeCandidato: string | null
    datacadastroCandidato: Date | null
    situacaoCandidato: string | null
    opcionalCandidato: string | null
    _count: CandidatosCountAggregateOutputType | null
    _avg: CandidatosAvgAggregateOutputType | null
    _sum: CandidatosSumAggregateOutputType | null
    _min: CandidatosMinAggregateOutputType | null
    _max: CandidatosMaxAggregateOutputType | null
  }

  type GetCandidatosGroupByPayload<T extends CandidatosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CandidatosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CandidatosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CandidatosGroupByOutputType[P]>
            : GetScalarType<T[P], CandidatosGroupByOutputType[P]>
        }
      >
    >


  export type CandidatosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCandidato?: boolean
    created_at?: boolean
    nomeCandidato?: boolean
    cpfCandidato?: boolean
    rgCandidato?: boolean
    sexoCandidato?: boolean
    estadocivilCandidato?: boolean
    cnhCandidato?: boolean
    outrosexoCandidato?: boolean
    categoriacnhCandidato?: boolean
    emailCandidato?: boolean
    datanascimentoCandidato?: boolean
    linkedinCandidato?: boolean
    facebookCandidato?: boolean
    instagramCandidato?: boolean
    telefoneCandidato?: boolean
    telefone2Candidato?: boolean
    pcdCandidato?: boolean
    cidareacandidato?: boolean
    cepCandidato?: boolean
    ruaCandidato?: boolean
    numeroCandidato?: boolean
    bairroCandidato?: boolean
    cidadeCandidato?: boolean
    estadoCandidato?: boolean
    vagainteresseCandidato?: boolean
    escolaridadeCandidato?: boolean
    conhecimentosCandidato?: boolean
    wordCandidato?: boolean
    excelCandidato?: boolean
    powerpointCandidato?: boolean
    conhecimentosinformaticaCandidato?: boolean
    conhecimentoinfcandidato?: boolean
    possuiexperienciaCandidato?: boolean
    empresaCandidato?: boolean
    local1Candidato?: boolean
    atividadesdesenvolvidas1Candidato?: boolean
    datainicioCandidato?: boolean
    trabalha1Candidato?: boolean
    datafinalCandidato?: boolean
    empresa2Candidato?: boolean
    local2Candidato?: boolean
    atividadesdesenvolvidas2Candidato?: boolean
    datainicio2Candidato?: boolean
    trabalha2Candidato?: boolean
    datafinal2Candidato?: boolean
    empresa3Candidato?: boolean
    local3Candidato?: boolean
    atividadesdesenvolvidas3Candidato?: boolean
    datainicio3Candidato?: boolean
    trabalha3Candidato?: boolean
    datafinal3Candidato?: boolean
    fotoCandidato?: boolean
    parentescoCandidato?: boolean
    graudeparentescoenomeCandidato?: boolean
    datacadastroCandidato?: boolean
    situacaoCandidato?: boolean
    opcionalCandidato?: boolean
  }, ExtArgs["result"]["candidatos"]>

  export type CandidatosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCandidato?: boolean
    created_at?: boolean
    nomeCandidato?: boolean
    cpfCandidato?: boolean
    rgCandidato?: boolean
    sexoCandidato?: boolean
    estadocivilCandidato?: boolean
    cnhCandidato?: boolean
    outrosexoCandidato?: boolean
    categoriacnhCandidato?: boolean
    emailCandidato?: boolean
    datanascimentoCandidato?: boolean
    linkedinCandidato?: boolean
    facebookCandidato?: boolean
    instagramCandidato?: boolean
    telefoneCandidato?: boolean
    telefone2Candidato?: boolean
    pcdCandidato?: boolean
    cidareacandidato?: boolean
    cepCandidato?: boolean
    ruaCandidato?: boolean
    numeroCandidato?: boolean
    bairroCandidato?: boolean
    cidadeCandidato?: boolean
    estadoCandidato?: boolean
    vagainteresseCandidato?: boolean
    escolaridadeCandidato?: boolean
    conhecimentosCandidato?: boolean
    wordCandidato?: boolean
    excelCandidato?: boolean
    powerpointCandidato?: boolean
    conhecimentosinformaticaCandidato?: boolean
    conhecimentoinfcandidato?: boolean
    possuiexperienciaCandidato?: boolean
    empresaCandidato?: boolean
    local1Candidato?: boolean
    atividadesdesenvolvidas1Candidato?: boolean
    datainicioCandidato?: boolean
    trabalha1Candidato?: boolean
    datafinalCandidato?: boolean
    empresa2Candidato?: boolean
    local2Candidato?: boolean
    atividadesdesenvolvidas2Candidato?: boolean
    datainicio2Candidato?: boolean
    trabalha2Candidato?: boolean
    datafinal2Candidato?: boolean
    empresa3Candidato?: boolean
    local3Candidato?: boolean
    atividadesdesenvolvidas3Candidato?: boolean
    datainicio3Candidato?: boolean
    trabalha3Candidato?: boolean
    datafinal3Candidato?: boolean
    fotoCandidato?: boolean
    parentescoCandidato?: boolean
    graudeparentescoenomeCandidato?: boolean
    datacadastroCandidato?: boolean
    situacaoCandidato?: boolean
    opcionalCandidato?: boolean
  }, ExtArgs["result"]["candidatos"]>

  export type CandidatosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCandidato?: boolean
    created_at?: boolean
    nomeCandidato?: boolean
    cpfCandidato?: boolean
    rgCandidato?: boolean
    sexoCandidato?: boolean
    estadocivilCandidato?: boolean
    cnhCandidato?: boolean
    outrosexoCandidato?: boolean
    categoriacnhCandidato?: boolean
    emailCandidato?: boolean
    datanascimentoCandidato?: boolean
    linkedinCandidato?: boolean
    facebookCandidato?: boolean
    instagramCandidato?: boolean
    telefoneCandidato?: boolean
    telefone2Candidato?: boolean
    pcdCandidato?: boolean
    cidareacandidato?: boolean
    cepCandidato?: boolean
    ruaCandidato?: boolean
    numeroCandidato?: boolean
    bairroCandidato?: boolean
    cidadeCandidato?: boolean
    estadoCandidato?: boolean
    vagainteresseCandidato?: boolean
    escolaridadeCandidato?: boolean
    conhecimentosCandidato?: boolean
    wordCandidato?: boolean
    excelCandidato?: boolean
    powerpointCandidato?: boolean
    conhecimentosinformaticaCandidato?: boolean
    conhecimentoinfcandidato?: boolean
    possuiexperienciaCandidato?: boolean
    empresaCandidato?: boolean
    local1Candidato?: boolean
    atividadesdesenvolvidas1Candidato?: boolean
    datainicioCandidato?: boolean
    trabalha1Candidato?: boolean
    datafinalCandidato?: boolean
    empresa2Candidato?: boolean
    local2Candidato?: boolean
    atividadesdesenvolvidas2Candidato?: boolean
    datainicio2Candidato?: boolean
    trabalha2Candidato?: boolean
    datafinal2Candidato?: boolean
    empresa3Candidato?: boolean
    local3Candidato?: boolean
    atividadesdesenvolvidas3Candidato?: boolean
    datainicio3Candidato?: boolean
    trabalha3Candidato?: boolean
    datafinal3Candidato?: boolean
    fotoCandidato?: boolean
    parentescoCandidato?: boolean
    graudeparentescoenomeCandidato?: boolean
    datacadastroCandidato?: boolean
    situacaoCandidato?: boolean
    opcionalCandidato?: boolean
  }, ExtArgs["result"]["candidatos"]>

  export type CandidatosSelectScalar = {
    idCandidato?: boolean
    created_at?: boolean
    nomeCandidato?: boolean
    cpfCandidato?: boolean
    rgCandidato?: boolean
    sexoCandidato?: boolean
    estadocivilCandidato?: boolean
    cnhCandidato?: boolean
    outrosexoCandidato?: boolean
    categoriacnhCandidato?: boolean
    emailCandidato?: boolean
    datanascimentoCandidato?: boolean
    linkedinCandidato?: boolean
    facebookCandidato?: boolean
    instagramCandidato?: boolean
    telefoneCandidato?: boolean
    telefone2Candidato?: boolean
    pcdCandidato?: boolean
    cidareacandidato?: boolean
    cepCandidato?: boolean
    ruaCandidato?: boolean
    numeroCandidato?: boolean
    bairroCandidato?: boolean
    cidadeCandidato?: boolean
    estadoCandidato?: boolean
    vagainteresseCandidato?: boolean
    escolaridadeCandidato?: boolean
    conhecimentosCandidato?: boolean
    wordCandidato?: boolean
    excelCandidato?: boolean
    powerpointCandidato?: boolean
    conhecimentosinformaticaCandidato?: boolean
    conhecimentoinfcandidato?: boolean
    possuiexperienciaCandidato?: boolean
    empresaCandidato?: boolean
    local1Candidato?: boolean
    atividadesdesenvolvidas1Candidato?: boolean
    datainicioCandidato?: boolean
    trabalha1Candidato?: boolean
    datafinalCandidato?: boolean
    empresa2Candidato?: boolean
    local2Candidato?: boolean
    atividadesdesenvolvidas2Candidato?: boolean
    datainicio2Candidato?: boolean
    trabalha2Candidato?: boolean
    datafinal2Candidato?: boolean
    empresa3Candidato?: boolean
    local3Candidato?: boolean
    atividadesdesenvolvidas3Candidato?: boolean
    datainicio3Candidato?: boolean
    trabalha3Candidato?: boolean
    datafinal3Candidato?: boolean
    fotoCandidato?: boolean
    parentescoCandidato?: boolean
    graudeparentescoenomeCandidato?: boolean
    datacadastroCandidato?: boolean
    situacaoCandidato?: boolean
    opcionalCandidato?: boolean
  }

  export type CandidatosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idCandidato" | "created_at" | "nomeCandidato" | "cpfCandidato" | "rgCandidato" | "sexoCandidato" | "estadocivilCandidato" | "cnhCandidato" | "outrosexoCandidato" | "categoriacnhCandidato" | "emailCandidato" | "datanascimentoCandidato" | "linkedinCandidato" | "facebookCandidato" | "instagramCandidato" | "telefoneCandidato" | "telefone2Candidato" | "pcdCandidato" | "cidareacandidato" | "cepCandidato" | "ruaCandidato" | "numeroCandidato" | "bairroCandidato" | "cidadeCandidato" | "estadoCandidato" | "vagainteresseCandidato" | "escolaridadeCandidato" | "conhecimentosCandidato" | "wordCandidato" | "excelCandidato" | "powerpointCandidato" | "conhecimentosinformaticaCandidato" | "conhecimentoinfcandidato" | "possuiexperienciaCandidato" | "empresaCandidato" | "local1Candidato" | "atividadesdesenvolvidas1Candidato" | "datainicioCandidato" | "trabalha1Candidato" | "datafinalCandidato" | "empresa2Candidato" | "local2Candidato" | "atividadesdesenvolvidas2Candidato" | "datainicio2Candidato" | "trabalha2Candidato" | "datafinal2Candidato" | "empresa3Candidato" | "local3Candidato" | "atividadesdesenvolvidas3Candidato" | "datainicio3Candidato" | "trabalha3Candidato" | "datafinal3Candidato" | "fotoCandidato" | "parentescoCandidato" | "graudeparentescoenomeCandidato" | "datacadastroCandidato" | "situacaoCandidato" | "opcionalCandidato", ExtArgs["result"]["candidatos"]>

  export type $CandidatosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Candidatos"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      idCandidato: bigint
      created_at: Date
      nomeCandidato: string | null
      cpfCandidato: string | null
      rgCandidato: string | null
      sexoCandidato: string | null
      estadocivilCandidato: string | null
      cnhCandidato: string | null
      outrosexoCandidato: string | null
      categoriacnhCandidato: string | null
      emailCandidato: string | null
      datanascimentoCandidato: Date | null
      linkedinCandidato: string | null
      facebookCandidato: string | null
      instagramCandidato: string | null
      telefoneCandidato: string | null
      telefone2Candidato: string | null
      pcdCandidato: string | null
      cidareacandidato: string | null
      cepCandidato: string | null
      ruaCandidato: string | null
      numeroCandidato: string | null
      bairroCandidato: string | null
      cidadeCandidato: string | null
      estadoCandidato: string | null
      vagainteresseCandidato: string | null
      escolaridadeCandidato: string | null
      conhecimentosCandidato: string | null
      wordCandidato: string | null
      excelCandidato: string | null
      powerpointCandidato: string | null
      conhecimentosinformaticaCandidato: string | null
      conhecimentoinfcandidato: string | null
      possuiexperienciaCandidato: string | null
      empresaCandidato: string | null
      local1Candidato: string | null
      atividadesdesenvolvidas1Candidato: string | null
      datainicioCandidato: Date | null
      trabalha1Candidato: string | null
      datafinalCandidato: Date | null
      empresa2Candidato: string | null
      local2Candidato: string | null
      atividadesdesenvolvidas2Candidato: string | null
      datainicio2Candidato: Date | null
      trabalha2Candidato: string | null
      datafinal2Candidato: Date | null
      empresa3Candidato: string | null
      local3Candidato: string | null
      atividadesdesenvolvidas3Candidato: string | null
      datainicio3Candidato: Date | null
      trabalha3Candidato: string | null
      datafinal3Candidato: Date | null
      fotoCandidato: string | null
      parentescoCandidato: string | null
      graudeparentescoenomeCandidato: string | null
      datacadastroCandidato: Date | null
      situacaoCandidato: string | null
      opcionalCandidato: string | null
    }, ExtArgs["result"]["candidatos"]>
    composites: {}
  }

  type CandidatosGetPayload<S extends boolean | null | undefined | CandidatosDefaultArgs> = $Result.GetResult<Prisma.$CandidatosPayload, S>

  type CandidatosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CandidatosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CandidatosCountAggregateInputType | true
    }

  export interface CandidatosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Candidatos'], meta: { name: 'Candidatos' } }
    /**
     * Find zero or one Candidatos that matches the filter.
     * @param {CandidatosFindUniqueArgs} args - Arguments to find a Candidatos
     * @example
     * // Get one Candidatos
     * const candidatos = await prisma.candidatos.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CandidatosFindUniqueArgs>(args: SelectSubset<T, CandidatosFindUniqueArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Candidatos that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CandidatosFindUniqueOrThrowArgs} args - Arguments to find a Candidatos
     * @example
     * // Get one Candidatos
     * const candidatos = await prisma.candidatos.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CandidatosFindUniqueOrThrowArgs>(args: SelectSubset<T, CandidatosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Candidatos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosFindFirstArgs} args - Arguments to find a Candidatos
     * @example
     * // Get one Candidatos
     * const candidatos = await prisma.candidatos.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CandidatosFindFirstArgs>(args?: SelectSubset<T, CandidatosFindFirstArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Candidatos that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosFindFirstOrThrowArgs} args - Arguments to find a Candidatos
     * @example
     * // Get one Candidatos
     * const candidatos = await prisma.candidatos.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CandidatosFindFirstOrThrowArgs>(args?: SelectSubset<T, CandidatosFindFirstOrThrowArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Candidatos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Candidatos
     * const candidatos = await prisma.candidatos.findMany()
     * 
     * // Get first 10 Candidatos
     * const candidatos = await prisma.candidatos.findMany({ take: 10 })
     * 
     * // Only select the `idCandidato`
     * const candidatosWithIdCandidatoOnly = await prisma.candidatos.findMany({ select: { idCandidato: true } })
     * 
     */
    findMany<T extends CandidatosFindManyArgs>(args?: SelectSubset<T, CandidatosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Candidatos.
     * @param {CandidatosCreateArgs} args - Arguments to create a Candidatos.
     * @example
     * // Create one Candidatos
     * const Candidatos = await prisma.candidatos.create({
     *   data: {
     *     // ... data to create a Candidatos
     *   }
     * })
     * 
     */
    create<T extends CandidatosCreateArgs>(args: SelectSubset<T, CandidatosCreateArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Candidatos.
     * @param {CandidatosCreateManyArgs} args - Arguments to create many Candidatos.
     * @example
     * // Create many Candidatos
     * const candidatos = await prisma.candidatos.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CandidatosCreateManyArgs>(args?: SelectSubset<T, CandidatosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Candidatos and returns the data saved in the database.
     * @param {CandidatosCreateManyAndReturnArgs} args - Arguments to create many Candidatos.
     * @example
     * // Create many Candidatos
     * const candidatos = await prisma.candidatos.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Candidatos and only return the `idCandidato`
     * const candidatosWithIdCandidatoOnly = await prisma.candidatos.createManyAndReturn({
     *   select: { idCandidato: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CandidatosCreateManyAndReturnArgs>(args?: SelectSubset<T, CandidatosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Candidatos.
     * @param {CandidatosDeleteArgs} args - Arguments to delete one Candidatos.
     * @example
     * // Delete one Candidatos
     * const Candidatos = await prisma.candidatos.delete({
     *   where: {
     *     // ... filter to delete one Candidatos
     *   }
     * })
     * 
     */
    delete<T extends CandidatosDeleteArgs>(args: SelectSubset<T, CandidatosDeleteArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Candidatos.
     * @param {CandidatosUpdateArgs} args - Arguments to update one Candidatos.
     * @example
     * // Update one Candidatos
     * const candidatos = await prisma.candidatos.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CandidatosUpdateArgs>(args: SelectSubset<T, CandidatosUpdateArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Candidatos.
     * @param {CandidatosDeleteManyArgs} args - Arguments to filter Candidatos to delete.
     * @example
     * // Delete a few Candidatos
     * const { count } = await prisma.candidatos.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CandidatosDeleteManyArgs>(args?: SelectSubset<T, CandidatosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Candidatos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Candidatos
     * const candidatos = await prisma.candidatos.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CandidatosUpdateManyArgs>(args: SelectSubset<T, CandidatosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Candidatos and returns the data updated in the database.
     * @param {CandidatosUpdateManyAndReturnArgs} args - Arguments to update many Candidatos.
     * @example
     * // Update many Candidatos
     * const candidatos = await prisma.candidatos.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Candidatos and only return the `idCandidato`
     * const candidatosWithIdCandidatoOnly = await prisma.candidatos.updateManyAndReturn({
     *   select: { idCandidato: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CandidatosUpdateManyAndReturnArgs>(args: SelectSubset<T, CandidatosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Candidatos.
     * @param {CandidatosUpsertArgs} args - Arguments to update or create a Candidatos.
     * @example
     * // Update or create a Candidatos
     * const candidatos = await prisma.candidatos.upsert({
     *   create: {
     *     // ... data to create a Candidatos
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Candidatos we want to update
     *   }
     * })
     */
    upsert<T extends CandidatosUpsertArgs>(args: SelectSubset<T, CandidatosUpsertArgs<ExtArgs>>): Prisma__CandidatosClient<$Result.GetResult<Prisma.$CandidatosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Candidatos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosCountArgs} args - Arguments to filter Candidatos to count.
     * @example
     * // Count the number of Candidatos
     * const count = await prisma.candidatos.count({
     *   where: {
     *     // ... the filter for the Candidatos we want to count
     *   }
     * })
    **/
    count<T extends CandidatosCountArgs>(
      args?: Subset<T, CandidatosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CandidatosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Candidatos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CandidatosAggregateArgs>(args: Subset<T, CandidatosAggregateArgs>): Prisma.PrismaPromise<GetCandidatosAggregateType<T>>

    /**
     * Group by Candidatos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidatosGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CandidatosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CandidatosGroupByArgs['orderBy'] }
        : { orderBy?: CandidatosGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CandidatosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCandidatosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Candidatos model
   */
  readonly fields: CandidatosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Candidatos.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CandidatosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Candidatos model
   */
  interface CandidatosFieldRefs {
    readonly idCandidato: FieldRef<"Candidatos", 'BigInt'>
    readonly created_at: FieldRef<"Candidatos", 'DateTime'>
    readonly nomeCandidato: FieldRef<"Candidatos", 'String'>
    readonly cpfCandidato: FieldRef<"Candidatos", 'String'>
    readonly rgCandidato: FieldRef<"Candidatos", 'String'>
    readonly sexoCandidato: FieldRef<"Candidatos", 'String'>
    readonly estadocivilCandidato: FieldRef<"Candidatos", 'String'>
    readonly cnhCandidato: FieldRef<"Candidatos", 'String'>
    readonly outrosexoCandidato: FieldRef<"Candidatos", 'String'>
    readonly categoriacnhCandidato: FieldRef<"Candidatos", 'String'>
    readonly emailCandidato: FieldRef<"Candidatos", 'String'>
    readonly datanascimentoCandidato: FieldRef<"Candidatos", 'DateTime'>
    readonly linkedinCandidato: FieldRef<"Candidatos", 'String'>
    readonly facebookCandidato: FieldRef<"Candidatos", 'String'>
    readonly instagramCandidato: FieldRef<"Candidatos", 'String'>
    readonly telefoneCandidato: FieldRef<"Candidatos", 'String'>
    readonly telefone2Candidato: FieldRef<"Candidatos", 'String'>
    readonly pcdCandidato: FieldRef<"Candidatos", 'String'>
    readonly cidareacandidato: FieldRef<"Candidatos", 'String'>
    readonly cepCandidato: FieldRef<"Candidatos", 'String'>
    readonly ruaCandidato: FieldRef<"Candidatos", 'String'>
    readonly numeroCandidato: FieldRef<"Candidatos", 'String'>
    readonly bairroCandidato: FieldRef<"Candidatos", 'String'>
    readonly cidadeCandidato: FieldRef<"Candidatos", 'String'>
    readonly estadoCandidato: FieldRef<"Candidatos", 'String'>
    readonly vagainteresseCandidato: FieldRef<"Candidatos", 'String'>
    readonly escolaridadeCandidato: FieldRef<"Candidatos", 'String'>
    readonly conhecimentosCandidato: FieldRef<"Candidatos", 'String'>
    readonly wordCandidato: FieldRef<"Candidatos", 'String'>
    readonly excelCandidato: FieldRef<"Candidatos", 'String'>
    readonly powerpointCandidato: FieldRef<"Candidatos", 'String'>
    readonly conhecimentosinformaticaCandidato: FieldRef<"Candidatos", 'String'>
    readonly conhecimentoinfcandidato: FieldRef<"Candidatos", 'String'>
    readonly possuiexperienciaCandidato: FieldRef<"Candidatos", 'String'>
    readonly empresaCandidato: FieldRef<"Candidatos", 'String'>
    readonly local1Candidato: FieldRef<"Candidatos", 'String'>
    readonly atividadesdesenvolvidas1Candidato: FieldRef<"Candidatos", 'String'>
    readonly datainicioCandidato: FieldRef<"Candidatos", 'DateTime'>
    readonly trabalha1Candidato: FieldRef<"Candidatos", 'String'>
    readonly datafinalCandidato: FieldRef<"Candidatos", 'DateTime'>
    readonly empresa2Candidato: FieldRef<"Candidatos", 'String'>
    readonly local2Candidato: FieldRef<"Candidatos", 'String'>
    readonly atividadesdesenvolvidas2Candidato: FieldRef<"Candidatos", 'String'>
    readonly datainicio2Candidato: FieldRef<"Candidatos", 'DateTime'>
    readonly trabalha2Candidato: FieldRef<"Candidatos", 'String'>
    readonly datafinal2Candidato: FieldRef<"Candidatos", 'DateTime'>
    readonly empresa3Candidato: FieldRef<"Candidatos", 'String'>
    readonly local3Candidato: FieldRef<"Candidatos", 'String'>
    readonly atividadesdesenvolvidas3Candidato: FieldRef<"Candidatos", 'String'>
    readonly datainicio3Candidato: FieldRef<"Candidatos", 'DateTime'>
    readonly trabalha3Candidato: FieldRef<"Candidatos", 'String'>
    readonly datafinal3Candidato: FieldRef<"Candidatos", 'DateTime'>
    readonly fotoCandidato: FieldRef<"Candidatos", 'String'>
    readonly parentescoCandidato: FieldRef<"Candidatos", 'String'>
    readonly graudeparentescoenomeCandidato: FieldRef<"Candidatos", 'String'>
    readonly datacadastroCandidato: FieldRef<"Candidatos", 'DateTime'>
    readonly situacaoCandidato: FieldRef<"Candidatos", 'String'>
    readonly opcionalCandidato: FieldRef<"Candidatos", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Candidatos findUnique
   */
  export type CandidatosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter, which Candidatos to fetch.
     */
    where: CandidatosWhereUniqueInput
  }

  /**
   * Candidatos findUniqueOrThrow
   */
  export type CandidatosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter, which Candidatos to fetch.
     */
    where: CandidatosWhereUniqueInput
  }

  /**
   * Candidatos findFirst
   */
  export type CandidatosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter, which Candidatos to fetch.
     */
    where?: CandidatosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Candidatos to fetch.
     */
    orderBy?: CandidatosOrderByWithRelationInput | CandidatosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Candidatos.
     */
    cursor?: CandidatosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Candidatos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Candidatos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Candidatos.
     */
    distinct?: CandidatosScalarFieldEnum | CandidatosScalarFieldEnum[]
  }

  /**
   * Candidatos findFirstOrThrow
   */
  export type CandidatosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter, which Candidatos to fetch.
     */
    where?: CandidatosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Candidatos to fetch.
     */
    orderBy?: CandidatosOrderByWithRelationInput | CandidatosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Candidatos.
     */
    cursor?: CandidatosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Candidatos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Candidatos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Candidatos.
     */
    distinct?: CandidatosScalarFieldEnum | CandidatosScalarFieldEnum[]
  }

  /**
   * Candidatos findMany
   */
  export type CandidatosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter, which Candidatos to fetch.
     */
    where?: CandidatosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Candidatos to fetch.
     */
    orderBy?: CandidatosOrderByWithRelationInput | CandidatosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Candidatos.
     */
    cursor?: CandidatosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Candidatos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Candidatos.
     */
    skip?: number
    distinct?: CandidatosScalarFieldEnum | CandidatosScalarFieldEnum[]
  }

  /**
   * Candidatos create
   */
  export type CandidatosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * The data needed to create a Candidatos.
     */
    data?: XOR<CandidatosCreateInput, CandidatosUncheckedCreateInput>
  }

  /**
   * Candidatos createMany
   */
  export type CandidatosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Candidatos.
     */
    data: CandidatosCreateManyInput | CandidatosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Candidatos createManyAndReturn
   */
  export type CandidatosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * The data used to create many Candidatos.
     */
    data: CandidatosCreateManyInput | CandidatosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Candidatos update
   */
  export type CandidatosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * The data needed to update a Candidatos.
     */
    data: XOR<CandidatosUpdateInput, CandidatosUncheckedUpdateInput>
    /**
     * Choose, which Candidatos to update.
     */
    where: CandidatosWhereUniqueInput
  }

  /**
   * Candidatos updateMany
   */
  export type CandidatosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Candidatos.
     */
    data: XOR<CandidatosUpdateManyMutationInput, CandidatosUncheckedUpdateManyInput>
    /**
     * Filter which Candidatos to update
     */
    where?: CandidatosWhereInput
    /**
     * Limit how many Candidatos to update.
     */
    limit?: number
  }

  /**
   * Candidatos updateManyAndReturn
   */
  export type CandidatosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * The data used to update Candidatos.
     */
    data: XOR<CandidatosUpdateManyMutationInput, CandidatosUncheckedUpdateManyInput>
    /**
     * Filter which Candidatos to update
     */
    where?: CandidatosWhereInput
    /**
     * Limit how many Candidatos to update.
     */
    limit?: number
  }

  /**
   * Candidatos upsert
   */
  export type CandidatosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * The filter to search for the Candidatos to update in case it exists.
     */
    where: CandidatosWhereUniqueInput
    /**
     * In case the Candidatos found by the `where` argument doesn't exist, create a new Candidatos with this data.
     */
    create: XOR<CandidatosCreateInput, CandidatosUncheckedCreateInput>
    /**
     * In case the Candidatos was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CandidatosUpdateInput, CandidatosUncheckedUpdateInput>
  }

  /**
   * Candidatos delete
   */
  export type CandidatosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
    /**
     * Filter which Candidatos to delete.
     */
    where: CandidatosWhereUniqueInput
  }

  /**
   * Candidatos deleteMany
   */
  export type CandidatosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Candidatos to delete
     */
    where?: CandidatosWhereInput
    /**
     * Limit how many Candidatos to delete.
     */
    limit?: number
  }

  /**
   * Candidatos without action
   */
  export type CandidatosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Candidatos
     */
    select?: CandidatosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Candidatos
     */
    omit?: CandidatosOmit<ExtArgs> | null
  }


  /**
   * Model usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senhahash: string | null
    autorizado: boolean | null
    fotourl: string | null
    criadoem: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senhahash: string | null
    autorizado: boolean | null
    fotourl: string | null
    criadoem: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    senhahash: number
    autorizado: number
    fotourl: number
    criadoem: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhahash?: true
    autorizado?: true
    fotourl?: true
    criadoem?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhahash?: true
    autorizado?: true
    fotourl?: true
    criadoem?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senhahash?: true
    autorizado?: true
    fotourl?: true
    criadoem?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which usuario to aggregate.
     */
    where?: usuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuarioOrderByWithRelationInput | usuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type usuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usuarioWhereInput
    orderBy?: usuarioOrderByWithAggregationInput | usuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: usuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    nome: string
    email: string
    senhahash: string
    autorizado: boolean | null
    fotourl: string | null
    criadoem: Date | null
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends usuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type usuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhahash?: boolean
    autorizado?: boolean
    fotourl?: boolean
    criadoem?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type usuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhahash?: boolean
    autorizado?: boolean
    fotourl?: boolean
    criadoem?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type usuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senhahash?: boolean
    autorizado?: boolean
    fotourl?: boolean
    criadoem?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type usuarioSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    senhahash?: boolean
    autorizado?: boolean
    fotourl?: boolean
    criadoem?: boolean
  }

  export type usuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "senhahash" | "autorizado" | "fotourl" | "criadoem", ExtArgs["result"]["usuario"]>

  export type $usuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "usuario"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      email: string
      senhahash: string
      autorizado: boolean | null
      fotourl: string | null
      criadoem: Date | null
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type usuarioGetPayload<S extends boolean | null | undefined | usuarioDefaultArgs> = $Result.GetResult<Prisma.$usuarioPayload, S>

  type usuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface usuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['usuario'], meta: { name: 'usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {usuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usuarioFindUniqueArgs>(args: SelectSubset<T, usuarioFindUniqueArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, usuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usuarioFindFirstArgs>(args?: SelectSubset<T, usuarioFindFirstArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, usuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usuarioFindManyArgs>(args?: SelectSubset<T, usuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {usuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends usuarioCreateArgs>(args: SelectSubset<T, usuarioCreateArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {usuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usuarioCreateManyArgs>(args?: SelectSubset<T, usuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {usuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, usuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {usuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends usuarioDeleteArgs>(args: SelectSubset<T, usuarioDeleteArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {usuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usuarioUpdateArgs>(args: SelectSubset<T, usuarioUpdateArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {usuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usuarioDeleteManyArgs>(args?: SelectSubset<T, usuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usuarioUpdateManyArgs>(args: SelectSubset<T, usuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {usuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, usuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {usuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends usuarioUpsertArgs>(args: SelectSubset<T, usuarioUpsertArgs<ExtArgs>>): Prisma__usuarioClient<$Result.GetResult<Prisma.$usuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends usuarioCountArgs>(
      args?: Subset<T, usuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usuarioGroupByArgs['orderBy'] }
        : { orderBy?: usuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the usuario model
   */
  readonly fields: usuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the usuario model
   */
  interface usuarioFieldRefs {
    readonly id: FieldRef<"usuario", 'Int'>
    readonly nome: FieldRef<"usuario", 'String'>
    readonly email: FieldRef<"usuario", 'String'>
    readonly senhahash: FieldRef<"usuario", 'String'>
    readonly autorizado: FieldRef<"usuario", 'Boolean'>
    readonly fotourl: FieldRef<"usuario", 'String'>
    readonly criadoem: FieldRef<"usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * usuario findUnique
   */
  export type usuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter, which usuario to fetch.
     */
    where: usuarioWhereUniqueInput
  }

  /**
   * usuario findUniqueOrThrow
   */
  export type usuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter, which usuario to fetch.
     */
    where: usuarioWhereUniqueInput
  }

  /**
   * usuario findFirst
   */
  export type usuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter, which usuario to fetch.
     */
    where?: usuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuarioOrderByWithRelationInput | usuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for usuarios.
     */
    cursor?: usuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * usuario findFirstOrThrow
   */
  export type usuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter, which usuario to fetch.
     */
    where?: usuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuarioOrderByWithRelationInput | usuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for usuarios.
     */
    cursor?: usuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * usuario findMany
   */
  export type usuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where?: usuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuarioOrderByWithRelationInput | usuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing usuarios.
     */
    cursor?: usuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * usuario create
   */
  export type usuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * The data needed to create a usuario.
     */
    data: XOR<usuarioCreateInput, usuarioUncheckedCreateInput>
  }

  /**
   * usuario createMany
   */
  export type usuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many usuarios.
     */
    data: usuarioCreateManyInput | usuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * usuario createManyAndReturn
   */
  export type usuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * The data used to create many usuarios.
     */
    data: usuarioCreateManyInput | usuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * usuario update
   */
  export type usuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * The data needed to update a usuario.
     */
    data: XOR<usuarioUpdateInput, usuarioUncheckedUpdateInput>
    /**
     * Choose, which usuario to update.
     */
    where: usuarioWhereUniqueInput
  }

  /**
   * usuario updateMany
   */
  export type usuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update usuarios.
     */
    data: XOR<usuarioUpdateManyMutationInput, usuarioUncheckedUpdateManyInput>
    /**
     * Filter which usuarios to update
     */
    where?: usuarioWhereInput
    /**
     * Limit how many usuarios to update.
     */
    limit?: number
  }

  /**
   * usuario updateManyAndReturn
   */
  export type usuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * The data used to update usuarios.
     */
    data: XOR<usuarioUpdateManyMutationInput, usuarioUncheckedUpdateManyInput>
    /**
     * Filter which usuarios to update
     */
    where?: usuarioWhereInput
    /**
     * Limit how many usuarios to update.
     */
    limit?: number
  }

  /**
   * usuario upsert
   */
  export type usuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * The filter to search for the usuario to update in case it exists.
     */
    where: usuarioWhereUniqueInput
    /**
     * In case the usuario found by the `where` argument doesn't exist, create a new usuario with this data.
     */
    create: XOR<usuarioCreateInput, usuarioUncheckedCreateInput>
    /**
     * In case the usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usuarioUpdateInput, usuarioUncheckedUpdateInput>
  }

  /**
   * usuario delete
   */
  export type usuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
    /**
     * Filter which usuario to delete.
     */
    where: usuarioWhereUniqueInput
  }

  /**
   * usuario deleteMany
   */
  export type usuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which usuarios to delete
     */
    where?: usuarioWhereInput
    /**
     * Limit how many usuarios to delete.
     */
    limit?: number
  }

  /**
   * usuario without action
   */
  export type usuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuario
     */
    select?: usuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuario
     */
    omit?: usuarioOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CandidatosScalarFieldEnum: {
    idCandidato: 'idCandidato',
    created_at: 'created_at',
    nomeCandidato: 'nomeCandidato',
    cpfCandidato: 'cpfCandidato',
    rgCandidato: 'rgCandidato',
    sexoCandidato: 'sexoCandidato',
    estadocivilCandidato: 'estadocivilCandidato',
    cnhCandidato: 'cnhCandidato',
    outrosexoCandidato: 'outrosexoCandidato',
    categoriacnhCandidato: 'categoriacnhCandidato',
    emailCandidato: 'emailCandidato',
    datanascimentoCandidato: 'datanascimentoCandidato',
    linkedinCandidato: 'linkedinCandidato',
    facebookCandidato: 'facebookCandidato',
    instagramCandidato: 'instagramCandidato',
    telefoneCandidato: 'telefoneCandidato',
    telefone2Candidato: 'telefone2Candidato',
    pcdCandidato: 'pcdCandidato',
    cidareacandidato: 'cidareacandidato',
    cepCandidato: 'cepCandidato',
    ruaCandidato: 'ruaCandidato',
    numeroCandidato: 'numeroCandidato',
    bairroCandidato: 'bairroCandidato',
    cidadeCandidato: 'cidadeCandidato',
    estadoCandidato: 'estadoCandidato',
    vagainteresseCandidato: 'vagainteresseCandidato',
    escolaridadeCandidato: 'escolaridadeCandidato',
    conhecimentosCandidato: 'conhecimentosCandidato',
    wordCandidato: 'wordCandidato',
    excelCandidato: 'excelCandidato',
    powerpointCandidato: 'powerpointCandidato',
    conhecimentosinformaticaCandidato: 'conhecimentosinformaticaCandidato',
    conhecimentoinfcandidato: 'conhecimentoinfcandidato',
    possuiexperienciaCandidato: 'possuiexperienciaCandidato',
    empresaCandidato: 'empresaCandidato',
    local1Candidato: 'local1Candidato',
    atividadesdesenvolvidas1Candidato: 'atividadesdesenvolvidas1Candidato',
    datainicioCandidato: 'datainicioCandidato',
    trabalha1Candidato: 'trabalha1Candidato',
    datafinalCandidato: 'datafinalCandidato',
    empresa2Candidato: 'empresa2Candidato',
    local2Candidato: 'local2Candidato',
    atividadesdesenvolvidas2Candidato: 'atividadesdesenvolvidas2Candidato',
    datainicio2Candidato: 'datainicio2Candidato',
    trabalha2Candidato: 'trabalha2Candidato',
    datafinal2Candidato: 'datafinal2Candidato',
    empresa3Candidato: 'empresa3Candidato',
    local3Candidato: 'local3Candidato',
    atividadesdesenvolvidas3Candidato: 'atividadesdesenvolvidas3Candidato',
    datainicio3Candidato: 'datainicio3Candidato',
    trabalha3Candidato: 'trabalha3Candidato',
    datafinal3Candidato: 'datafinal3Candidato',
    fotoCandidato: 'fotoCandidato',
    parentescoCandidato: 'parentescoCandidato',
    graudeparentescoenomeCandidato: 'graudeparentescoenomeCandidato',
    datacadastroCandidato: 'datacadastroCandidato',
    situacaoCandidato: 'situacaoCandidato',
    opcionalCandidato: 'opcionalCandidato'
  };

  export type CandidatosScalarFieldEnum = (typeof CandidatosScalarFieldEnum)[keyof typeof CandidatosScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    senhahash: 'senhahash',
    autorizado: 'autorizado',
    fotourl: 'fotourl',
    criadoem: 'criadoem'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CandidatosWhereInput = {
    AND?: CandidatosWhereInput | CandidatosWhereInput[]
    OR?: CandidatosWhereInput[]
    NOT?: CandidatosWhereInput | CandidatosWhereInput[]
    idCandidato?: BigIntFilter<"Candidatos"> | bigint | number
    created_at?: DateTimeFilter<"Candidatos"> | Date | string
    nomeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cpfCandidato?: StringNullableFilter<"Candidatos"> | string | null
    rgCandidato?: StringNullableFilter<"Candidatos"> | string | null
    sexoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    estadocivilCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cnhCandidato?: StringNullableFilter<"Candidatos"> | string | null
    outrosexoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    categoriacnhCandidato?: StringNullableFilter<"Candidatos"> | string | null
    emailCandidato?: StringNullableFilter<"Candidatos"> | string | null
    datanascimentoCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    linkedinCandidato?: StringNullableFilter<"Candidatos"> | string | null
    facebookCandidato?: StringNullableFilter<"Candidatos"> | string | null
    instagramCandidato?: StringNullableFilter<"Candidatos"> | string | null
    telefoneCandidato?: StringNullableFilter<"Candidatos"> | string | null
    telefone2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    pcdCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cidareacandidato?: StringNullableFilter<"Candidatos"> | string | null
    cepCandidato?: StringNullableFilter<"Candidatos"> | string | null
    ruaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    numeroCandidato?: StringNullableFilter<"Candidatos"> | string | null
    bairroCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cidadeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    estadoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    vagainteresseCandidato?: StringNullableFilter<"Candidatos"> | string | null
    escolaridadeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentosCandidato?: StringNullableFilter<"Candidatos"> | string | null
    wordCandidato?: StringNullableFilter<"Candidatos"> | string | null
    excelCandidato?: StringNullableFilter<"Candidatos"> | string | null
    powerpointCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentosinformaticaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentoinfcandidato?: StringNullableFilter<"Candidatos"> | string | null
    possuiexperienciaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    empresaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    local1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicioCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinalCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    empresa2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    local2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicio2Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinal2Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    empresa3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    local3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicio3Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinal3Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    fotoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    parentescoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    graudeparentescoenomeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    datacadastroCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    situacaoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    opcionalCandidato?: StringNullableFilter<"Candidatos"> | string | null
  }

  export type CandidatosOrderByWithRelationInput = {
    idCandidato?: SortOrder
    created_at?: SortOrder
    nomeCandidato?: SortOrderInput | SortOrder
    cpfCandidato?: SortOrderInput | SortOrder
    rgCandidato?: SortOrderInput | SortOrder
    sexoCandidato?: SortOrderInput | SortOrder
    estadocivilCandidato?: SortOrderInput | SortOrder
    cnhCandidato?: SortOrderInput | SortOrder
    outrosexoCandidato?: SortOrderInput | SortOrder
    categoriacnhCandidato?: SortOrderInput | SortOrder
    emailCandidato?: SortOrderInput | SortOrder
    datanascimentoCandidato?: SortOrderInput | SortOrder
    linkedinCandidato?: SortOrderInput | SortOrder
    facebookCandidato?: SortOrderInput | SortOrder
    instagramCandidato?: SortOrderInput | SortOrder
    telefoneCandidato?: SortOrderInput | SortOrder
    telefone2Candidato?: SortOrderInput | SortOrder
    pcdCandidato?: SortOrderInput | SortOrder
    cidareacandidato?: SortOrderInput | SortOrder
    cepCandidato?: SortOrderInput | SortOrder
    ruaCandidato?: SortOrderInput | SortOrder
    numeroCandidato?: SortOrderInput | SortOrder
    bairroCandidato?: SortOrderInput | SortOrder
    cidadeCandidato?: SortOrderInput | SortOrder
    estadoCandidato?: SortOrderInput | SortOrder
    vagainteresseCandidato?: SortOrderInput | SortOrder
    escolaridadeCandidato?: SortOrderInput | SortOrder
    conhecimentosCandidato?: SortOrderInput | SortOrder
    wordCandidato?: SortOrderInput | SortOrder
    excelCandidato?: SortOrderInput | SortOrder
    powerpointCandidato?: SortOrderInput | SortOrder
    conhecimentosinformaticaCandidato?: SortOrderInput | SortOrder
    conhecimentoinfcandidato?: SortOrderInput | SortOrder
    possuiexperienciaCandidato?: SortOrderInput | SortOrder
    empresaCandidato?: SortOrderInput | SortOrder
    local1Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas1Candidato?: SortOrderInput | SortOrder
    datainicioCandidato?: SortOrderInput | SortOrder
    trabalha1Candidato?: SortOrderInput | SortOrder
    datafinalCandidato?: SortOrderInput | SortOrder
    empresa2Candidato?: SortOrderInput | SortOrder
    local2Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas2Candidato?: SortOrderInput | SortOrder
    datainicio2Candidato?: SortOrderInput | SortOrder
    trabalha2Candidato?: SortOrderInput | SortOrder
    datafinal2Candidato?: SortOrderInput | SortOrder
    empresa3Candidato?: SortOrderInput | SortOrder
    local3Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas3Candidato?: SortOrderInput | SortOrder
    datainicio3Candidato?: SortOrderInput | SortOrder
    trabalha3Candidato?: SortOrderInput | SortOrder
    datafinal3Candidato?: SortOrderInput | SortOrder
    fotoCandidato?: SortOrderInput | SortOrder
    parentescoCandidato?: SortOrderInput | SortOrder
    graudeparentescoenomeCandidato?: SortOrderInput | SortOrder
    datacadastroCandidato?: SortOrderInput | SortOrder
    situacaoCandidato?: SortOrderInput | SortOrder
    opcionalCandidato?: SortOrderInput | SortOrder
  }

  export type CandidatosWhereUniqueInput = Prisma.AtLeast<{
    idCandidato?: bigint | number
    AND?: CandidatosWhereInput | CandidatosWhereInput[]
    OR?: CandidatosWhereInput[]
    NOT?: CandidatosWhereInput | CandidatosWhereInput[]
    created_at?: DateTimeFilter<"Candidatos"> | Date | string
    nomeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cpfCandidato?: StringNullableFilter<"Candidatos"> | string | null
    rgCandidato?: StringNullableFilter<"Candidatos"> | string | null
    sexoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    estadocivilCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cnhCandidato?: StringNullableFilter<"Candidatos"> | string | null
    outrosexoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    categoriacnhCandidato?: StringNullableFilter<"Candidatos"> | string | null
    emailCandidato?: StringNullableFilter<"Candidatos"> | string | null
    datanascimentoCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    linkedinCandidato?: StringNullableFilter<"Candidatos"> | string | null
    facebookCandidato?: StringNullableFilter<"Candidatos"> | string | null
    instagramCandidato?: StringNullableFilter<"Candidatos"> | string | null
    telefoneCandidato?: StringNullableFilter<"Candidatos"> | string | null
    telefone2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    pcdCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cidareacandidato?: StringNullableFilter<"Candidatos"> | string | null
    cepCandidato?: StringNullableFilter<"Candidatos"> | string | null
    ruaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    numeroCandidato?: StringNullableFilter<"Candidatos"> | string | null
    bairroCandidato?: StringNullableFilter<"Candidatos"> | string | null
    cidadeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    estadoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    vagainteresseCandidato?: StringNullableFilter<"Candidatos"> | string | null
    escolaridadeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentosCandidato?: StringNullableFilter<"Candidatos"> | string | null
    wordCandidato?: StringNullableFilter<"Candidatos"> | string | null
    excelCandidato?: StringNullableFilter<"Candidatos"> | string | null
    powerpointCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentosinformaticaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    conhecimentoinfcandidato?: StringNullableFilter<"Candidatos"> | string | null
    possuiexperienciaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    empresaCandidato?: StringNullableFilter<"Candidatos"> | string | null
    local1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicioCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha1Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinalCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    empresa2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    local2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicio2Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha2Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinal2Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    empresa3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    local3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datainicio3Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    trabalha3Candidato?: StringNullableFilter<"Candidatos"> | string | null
    datafinal3Candidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    fotoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    parentescoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    graudeparentescoenomeCandidato?: StringNullableFilter<"Candidatos"> | string | null
    datacadastroCandidato?: DateTimeNullableFilter<"Candidatos"> | Date | string | null
    situacaoCandidato?: StringNullableFilter<"Candidatos"> | string | null
    opcionalCandidato?: StringNullableFilter<"Candidatos"> | string | null
  }, "idCandidato">

  export type CandidatosOrderByWithAggregationInput = {
    idCandidato?: SortOrder
    created_at?: SortOrder
    nomeCandidato?: SortOrderInput | SortOrder
    cpfCandidato?: SortOrderInput | SortOrder
    rgCandidato?: SortOrderInput | SortOrder
    sexoCandidato?: SortOrderInput | SortOrder
    estadocivilCandidato?: SortOrderInput | SortOrder
    cnhCandidato?: SortOrderInput | SortOrder
    outrosexoCandidato?: SortOrderInput | SortOrder
    categoriacnhCandidato?: SortOrderInput | SortOrder
    emailCandidato?: SortOrderInput | SortOrder
    datanascimentoCandidato?: SortOrderInput | SortOrder
    linkedinCandidato?: SortOrderInput | SortOrder
    facebookCandidato?: SortOrderInput | SortOrder
    instagramCandidato?: SortOrderInput | SortOrder
    telefoneCandidato?: SortOrderInput | SortOrder
    telefone2Candidato?: SortOrderInput | SortOrder
    pcdCandidato?: SortOrderInput | SortOrder
    cidareacandidato?: SortOrderInput | SortOrder
    cepCandidato?: SortOrderInput | SortOrder
    ruaCandidato?: SortOrderInput | SortOrder
    numeroCandidato?: SortOrderInput | SortOrder
    bairroCandidato?: SortOrderInput | SortOrder
    cidadeCandidato?: SortOrderInput | SortOrder
    estadoCandidato?: SortOrderInput | SortOrder
    vagainteresseCandidato?: SortOrderInput | SortOrder
    escolaridadeCandidato?: SortOrderInput | SortOrder
    conhecimentosCandidato?: SortOrderInput | SortOrder
    wordCandidato?: SortOrderInput | SortOrder
    excelCandidato?: SortOrderInput | SortOrder
    powerpointCandidato?: SortOrderInput | SortOrder
    conhecimentosinformaticaCandidato?: SortOrderInput | SortOrder
    conhecimentoinfcandidato?: SortOrderInput | SortOrder
    possuiexperienciaCandidato?: SortOrderInput | SortOrder
    empresaCandidato?: SortOrderInput | SortOrder
    local1Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas1Candidato?: SortOrderInput | SortOrder
    datainicioCandidato?: SortOrderInput | SortOrder
    trabalha1Candidato?: SortOrderInput | SortOrder
    datafinalCandidato?: SortOrderInput | SortOrder
    empresa2Candidato?: SortOrderInput | SortOrder
    local2Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas2Candidato?: SortOrderInput | SortOrder
    datainicio2Candidato?: SortOrderInput | SortOrder
    trabalha2Candidato?: SortOrderInput | SortOrder
    datafinal2Candidato?: SortOrderInput | SortOrder
    empresa3Candidato?: SortOrderInput | SortOrder
    local3Candidato?: SortOrderInput | SortOrder
    atividadesdesenvolvidas3Candidato?: SortOrderInput | SortOrder
    datainicio3Candidato?: SortOrderInput | SortOrder
    trabalha3Candidato?: SortOrderInput | SortOrder
    datafinal3Candidato?: SortOrderInput | SortOrder
    fotoCandidato?: SortOrderInput | SortOrder
    parentescoCandidato?: SortOrderInput | SortOrder
    graudeparentescoenomeCandidato?: SortOrderInput | SortOrder
    datacadastroCandidato?: SortOrderInput | SortOrder
    situacaoCandidato?: SortOrderInput | SortOrder
    opcionalCandidato?: SortOrderInput | SortOrder
    _count?: CandidatosCountOrderByAggregateInput
    _avg?: CandidatosAvgOrderByAggregateInput
    _max?: CandidatosMaxOrderByAggregateInput
    _min?: CandidatosMinOrderByAggregateInput
    _sum?: CandidatosSumOrderByAggregateInput
  }

  export type CandidatosScalarWhereWithAggregatesInput = {
    AND?: CandidatosScalarWhereWithAggregatesInput | CandidatosScalarWhereWithAggregatesInput[]
    OR?: CandidatosScalarWhereWithAggregatesInput[]
    NOT?: CandidatosScalarWhereWithAggregatesInput | CandidatosScalarWhereWithAggregatesInput[]
    idCandidato?: BigIntWithAggregatesFilter<"Candidatos"> | bigint | number
    created_at?: DateTimeWithAggregatesFilter<"Candidatos"> | Date | string
    nomeCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    cpfCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    rgCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    sexoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    estadocivilCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    cnhCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    outrosexoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    categoriacnhCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    emailCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datanascimentoCandidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    linkedinCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    facebookCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    instagramCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    telefoneCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    telefone2Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    pcdCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    cidareacandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    cepCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    ruaCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    numeroCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    bairroCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    cidadeCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    estadoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    vagainteresseCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    escolaridadeCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    conhecimentosCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    wordCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    excelCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    powerpointCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    conhecimentosinformaticaCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    conhecimentoinfcandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    possuiexperienciaCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    empresaCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    local1Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas1Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datainicioCandidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    trabalha1Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datafinalCandidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    empresa2Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    local2Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas2Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datainicio2Candidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    trabalha2Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datafinal2Candidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    empresa3Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    local3Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    atividadesdesenvolvidas3Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datainicio3Candidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    trabalha3Candidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datafinal3Candidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    fotoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    parentescoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    graudeparentescoenomeCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    datacadastroCandidato?: DateTimeNullableWithAggregatesFilter<"Candidatos"> | Date | string | null
    situacaoCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
    opcionalCandidato?: StringNullableWithAggregatesFilter<"Candidatos"> | string | null
  }

  export type usuarioWhereInput = {
    AND?: usuarioWhereInput | usuarioWhereInput[]
    OR?: usuarioWhereInput[]
    NOT?: usuarioWhereInput | usuarioWhereInput[]
    id?: IntFilter<"usuario"> | number
    nome?: StringFilter<"usuario"> | string
    email?: StringFilter<"usuario"> | string
    senhahash?: StringFilter<"usuario"> | string
    autorizado?: BoolNullableFilter<"usuario"> | boolean | null
    fotourl?: StringNullableFilter<"usuario"> | string | null
    criadoem?: DateTimeNullableFilter<"usuario"> | Date | string | null
  }

  export type usuarioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhahash?: SortOrder
    autorizado?: SortOrderInput | SortOrder
    fotourl?: SortOrderInput | SortOrder
    criadoem?: SortOrderInput | SortOrder
  }

  export type usuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: usuarioWhereInput | usuarioWhereInput[]
    OR?: usuarioWhereInput[]
    NOT?: usuarioWhereInput | usuarioWhereInput[]
    nome?: StringFilter<"usuario"> | string
    senhahash?: StringFilter<"usuario"> | string
    autorizado?: BoolNullableFilter<"usuario"> | boolean | null
    fotourl?: StringNullableFilter<"usuario"> | string | null
    criadoem?: DateTimeNullableFilter<"usuario"> | Date | string | null
  }, "id" | "email">

  export type usuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhahash?: SortOrder
    autorizado?: SortOrderInput | SortOrder
    fotourl?: SortOrderInput | SortOrder
    criadoem?: SortOrderInput | SortOrder
    _count?: usuarioCountOrderByAggregateInput
    _avg?: usuarioAvgOrderByAggregateInput
    _max?: usuarioMaxOrderByAggregateInput
    _min?: usuarioMinOrderByAggregateInput
    _sum?: usuarioSumOrderByAggregateInput
  }

  export type usuarioScalarWhereWithAggregatesInput = {
    AND?: usuarioScalarWhereWithAggregatesInput | usuarioScalarWhereWithAggregatesInput[]
    OR?: usuarioScalarWhereWithAggregatesInput[]
    NOT?: usuarioScalarWhereWithAggregatesInput | usuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"usuario"> | number
    nome?: StringWithAggregatesFilter<"usuario"> | string
    email?: StringWithAggregatesFilter<"usuario"> | string
    senhahash?: StringWithAggregatesFilter<"usuario"> | string
    autorizado?: BoolNullableWithAggregatesFilter<"usuario"> | boolean | null
    fotourl?: StringNullableWithAggregatesFilter<"usuario"> | string | null
    criadoem?: DateTimeNullableWithAggregatesFilter<"usuario"> | Date | string | null
  }

  export type CandidatosCreateInput = {
    idCandidato?: bigint | number
    created_at?: Date | string
    nomeCandidato?: string | null
    cpfCandidato?: string | null
    rgCandidato?: string | null
    sexoCandidato?: string | null
    estadocivilCandidato?: string | null
    cnhCandidato?: string | null
    outrosexoCandidato?: string | null
    categoriacnhCandidato?: string | null
    emailCandidato?: string | null
    datanascimentoCandidato?: Date | string | null
    linkedinCandidato?: string | null
    facebookCandidato?: string | null
    instagramCandidato?: string | null
    telefoneCandidato?: string | null
    telefone2Candidato?: string | null
    pcdCandidato?: string | null
    cidareacandidato?: string | null
    cepCandidato?: string | null
    ruaCandidato?: string | null
    numeroCandidato?: string | null
    bairroCandidato?: string | null
    cidadeCandidato?: string | null
    estadoCandidato?: string | null
    vagainteresseCandidato?: string | null
    escolaridadeCandidato?: string | null
    conhecimentosCandidato?: string | null
    wordCandidato?: string | null
    excelCandidato?: string | null
    powerpointCandidato?: string | null
    conhecimentosinformaticaCandidato?: string | null
    conhecimentoinfcandidato?: string | null
    possuiexperienciaCandidato?: string | null
    empresaCandidato?: string | null
    local1Candidato?: string | null
    atividadesdesenvolvidas1Candidato?: string | null
    datainicioCandidato?: Date | string | null
    trabalha1Candidato?: string | null
    datafinalCandidato?: Date | string | null
    empresa2Candidato?: string | null
    local2Candidato?: string | null
    atividadesdesenvolvidas2Candidato?: string | null
    datainicio2Candidato?: Date | string | null
    trabalha2Candidato?: string | null
    datafinal2Candidato?: Date | string | null
    empresa3Candidato?: string | null
    local3Candidato?: string | null
    atividadesdesenvolvidas3Candidato?: string | null
    datainicio3Candidato?: Date | string | null
    trabalha3Candidato?: string | null
    datafinal3Candidato?: Date | string | null
    fotoCandidato?: string | null
    parentescoCandidato?: string | null
    graudeparentescoenomeCandidato?: string | null
    datacadastroCandidato?: Date | string | null
    situacaoCandidato?: string | null
    opcionalCandidato?: string | null
  }

  export type CandidatosUncheckedCreateInput = {
    idCandidato?: bigint | number
    created_at?: Date | string
    nomeCandidato?: string | null
    cpfCandidato?: string | null
    rgCandidato?: string | null
    sexoCandidato?: string | null
    estadocivilCandidato?: string | null
    cnhCandidato?: string | null
    outrosexoCandidato?: string | null
    categoriacnhCandidato?: string | null
    emailCandidato?: string | null
    datanascimentoCandidato?: Date | string | null
    linkedinCandidato?: string | null
    facebookCandidato?: string | null
    instagramCandidato?: string | null
    telefoneCandidato?: string | null
    telefone2Candidato?: string | null
    pcdCandidato?: string | null
    cidareacandidato?: string | null
    cepCandidato?: string | null
    ruaCandidato?: string | null
    numeroCandidato?: string | null
    bairroCandidato?: string | null
    cidadeCandidato?: string | null
    estadoCandidato?: string | null
    vagainteresseCandidato?: string | null
    escolaridadeCandidato?: string | null
    conhecimentosCandidato?: string | null
    wordCandidato?: string | null
    excelCandidato?: string | null
    powerpointCandidato?: string | null
    conhecimentosinformaticaCandidato?: string | null
    conhecimentoinfcandidato?: string | null
    possuiexperienciaCandidato?: string | null
    empresaCandidato?: string | null
    local1Candidato?: string | null
    atividadesdesenvolvidas1Candidato?: string | null
    datainicioCandidato?: Date | string | null
    trabalha1Candidato?: string | null
    datafinalCandidato?: Date | string | null
    empresa2Candidato?: string | null
    local2Candidato?: string | null
    atividadesdesenvolvidas2Candidato?: string | null
    datainicio2Candidato?: Date | string | null
    trabalha2Candidato?: string | null
    datafinal2Candidato?: Date | string | null
    empresa3Candidato?: string | null
    local3Candidato?: string | null
    atividadesdesenvolvidas3Candidato?: string | null
    datainicio3Candidato?: Date | string | null
    trabalha3Candidato?: string | null
    datafinal3Candidato?: Date | string | null
    fotoCandidato?: string | null
    parentescoCandidato?: string | null
    graudeparentescoenomeCandidato?: string | null
    datacadastroCandidato?: Date | string | null
    situacaoCandidato?: string | null
    opcionalCandidato?: string | null
  }

  export type CandidatosUpdateInput = {
    idCandidato?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    nomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cpfCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    rgCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    sexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadocivilCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    outrosexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    categoriacnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    emailCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datanascimentoCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    facebookCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    instagramCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefoneCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefone2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    pcdCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidareacandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cepCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    ruaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    numeroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    bairroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    vagainteresseCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    escolaridadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    wordCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    excelCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    powerpointCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosinformaticaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentoinfcandidato?: NullableStringFieldUpdateOperationsInput | string | null
    possuiexperienciaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    empresaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    local1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicioCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinalCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fotoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    parentescoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    graudeparentescoenomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datacadastroCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    situacaoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    opcionalCandidato?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CandidatosUncheckedUpdateInput = {
    idCandidato?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    nomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cpfCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    rgCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    sexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadocivilCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    outrosexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    categoriacnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    emailCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datanascimentoCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    facebookCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    instagramCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefoneCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefone2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    pcdCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidareacandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cepCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    ruaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    numeroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    bairroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    vagainteresseCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    escolaridadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    wordCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    excelCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    powerpointCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosinformaticaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentoinfcandidato?: NullableStringFieldUpdateOperationsInput | string | null
    possuiexperienciaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    empresaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    local1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicioCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinalCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fotoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    parentescoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    graudeparentescoenomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datacadastroCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    situacaoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    opcionalCandidato?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CandidatosCreateManyInput = {
    idCandidato?: bigint | number
    created_at?: Date | string
    nomeCandidato?: string | null
    cpfCandidato?: string | null
    rgCandidato?: string | null
    sexoCandidato?: string | null
    estadocivilCandidato?: string | null
    cnhCandidato?: string | null
    outrosexoCandidato?: string | null
    categoriacnhCandidato?: string | null
    emailCandidato?: string | null
    datanascimentoCandidato?: Date | string | null
    linkedinCandidato?: string | null
    facebookCandidato?: string | null
    instagramCandidato?: string | null
    telefoneCandidato?: string | null
    telefone2Candidato?: string | null
    pcdCandidato?: string | null
    cidareacandidato?: string | null
    cepCandidato?: string | null
    ruaCandidato?: string | null
    numeroCandidato?: string | null
    bairroCandidato?: string | null
    cidadeCandidato?: string | null
    estadoCandidato?: string | null
    vagainteresseCandidato?: string | null
    escolaridadeCandidato?: string | null
    conhecimentosCandidato?: string | null
    wordCandidato?: string | null
    excelCandidato?: string | null
    powerpointCandidato?: string | null
    conhecimentosinformaticaCandidato?: string | null
    conhecimentoinfcandidato?: string | null
    possuiexperienciaCandidato?: string | null
    empresaCandidato?: string | null
    local1Candidato?: string | null
    atividadesdesenvolvidas1Candidato?: string | null
    datainicioCandidato?: Date | string | null
    trabalha1Candidato?: string | null
    datafinalCandidato?: Date | string | null
    empresa2Candidato?: string | null
    local2Candidato?: string | null
    atividadesdesenvolvidas2Candidato?: string | null
    datainicio2Candidato?: Date | string | null
    trabalha2Candidato?: string | null
    datafinal2Candidato?: Date | string | null
    empresa3Candidato?: string | null
    local3Candidato?: string | null
    atividadesdesenvolvidas3Candidato?: string | null
    datainicio3Candidato?: Date | string | null
    trabalha3Candidato?: string | null
    datafinal3Candidato?: Date | string | null
    fotoCandidato?: string | null
    parentescoCandidato?: string | null
    graudeparentescoenomeCandidato?: string | null
    datacadastroCandidato?: Date | string | null
    situacaoCandidato?: string | null
    opcionalCandidato?: string | null
  }

  export type CandidatosUpdateManyMutationInput = {
    idCandidato?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    nomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cpfCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    rgCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    sexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadocivilCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    outrosexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    categoriacnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    emailCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datanascimentoCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    facebookCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    instagramCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefoneCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefone2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    pcdCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidareacandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cepCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    ruaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    numeroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    bairroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    vagainteresseCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    escolaridadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    wordCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    excelCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    powerpointCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosinformaticaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentoinfcandidato?: NullableStringFieldUpdateOperationsInput | string | null
    possuiexperienciaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    empresaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    local1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicioCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinalCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fotoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    parentescoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    graudeparentescoenomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datacadastroCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    situacaoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    opcionalCandidato?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CandidatosUncheckedUpdateManyInput = {
    idCandidato?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    nomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cpfCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    rgCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    sexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadocivilCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    outrosexoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    categoriacnhCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    emailCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datanascimentoCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    facebookCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    instagramCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefoneCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    telefone2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    pcdCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidareacandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cepCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    ruaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    numeroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    bairroCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    cidadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    estadoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    vagainteresseCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    escolaridadeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    wordCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    excelCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    powerpointCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentosinformaticaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    conhecimentoinfcandidato?: NullableStringFieldUpdateOperationsInput | string | null
    possuiexperienciaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    empresaCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    local1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicioCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha1Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinalCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha2Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal2Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    empresa3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    local3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    atividadesdesenvolvidas3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datainicio3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trabalha3Candidato?: NullableStringFieldUpdateOperationsInput | string | null
    datafinal3Candidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fotoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    parentescoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    graudeparentescoenomeCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    datacadastroCandidato?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    situacaoCandidato?: NullableStringFieldUpdateOperationsInput | string | null
    opcionalCandidato?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type usuarioCreateInput = {
    nome: string
    email: string
    senhahash: string
    autorizado?: boolean | null
    fotourl?: string | null
    criadoem?: Date | string | null
  }

  export type usuarioUncheckedCreateInput = {
    id?: number
    nome: string
    email: string
    senhahash: string
    autorizado?: boolean | null
    fotourl?: string | null
    criadoem?: Date | string | null
  }

  export type usuarioUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhahash?: StringFieldUpdateOperationsInput | string
    autorizado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fotourl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoem?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhahash?: StringFieldUpdateOperationsInput | string
    autorizado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fotourl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoem?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usuarioCreateManyInput = {
    id?: number
    nome: string
    email: string
    senhahash: string
    autorizado?: boolean | null
    fotourl?: string | null
    criadoem?: Date | string | null
  }

  export type usuarioUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhahash?: StringFieldUpdateOperationsInput | string
    autorizado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fotourl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoem?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhahash?: StringFieldUpdateOperationsInput | string
    autorizado?: NullableBoolFieldUpdateOperationsInput | boolean | null
    fotourl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoem?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CandidatosCountOrderByAggregateInput = {
    idCandidato?: SortOrder
    created_at?: SortOrder
    nomeCandidato?: SortOrder
    cpfCandidato?: SortOrder
    rgCandidato?: SortOrder
    sexoCandidato?: SortOrder
    estadocivilCandidato?: SortOrder
    cnhCandidato?: SortOrder
    outrosexoCandidato?: SortOrder
    categoriacnhCandidato?: SortOrder
    emailCandidato?: SortOrder
    datanascimentoCandidato?: SortOrder
    linkedinCandidato?: SortOrder
    facebookCandidato?: SortOrder
    instagramCandidato?: SortOrder
    telefoneCandidato?: SortOrder
    telefone2Candidato?: SortOrder
    pcdCandidato?: SortOrder
    cidareacandidato?: SortOrder
    cepCandidato?: SortOrder
    ruaCandidato?: SortOrder
    numeroCandidato?: SortOrder
    bairroCandidato?: SortOrder
    cidadeCandidato?: SortOrder
    estadoCandidato?: SortOrder
    vagainteresseCandidato?: SortOrder
    escolaridadeCandidato?: SortOrder
    conhecimentosCandidato?: SortOrder
    wordCandidato?: SortOrder
    excelCandidato?: SortOrder
    powerpointCandidato?: SortOrder
    conhecimentosinformaticaCandidato?: SortOrder
    conhecimentoinfcandidato?: SortOrder
    possuiexperienciaCandidato?: SortOrder
    empresaCandidato?: SortOrder
    local1Candidato?: SortOrder
    atividadesdesenvolvidas1Candidato?: SortOrder
    datainicioCandidato?: SortOrder
    trabalha1Candidato?: SortOrder
    datafinalCandidato?: SortOrder
    empresa2Candidato?: SortOrder
    local2Candidato?: SortOrder
    atividadesdesenvolvidas2Candidato?: SortOrder
    datainicio2Candidato?: SortOrder
    trabalha2Candidato?: SortOrder
    datafinal2Candidato?: SortOrder
    empresa3Candidato?: SortOrder
    local3Candidato?: SortOrder
    atividadesdesenvolvidas3Candidato?: SortOrder
    datainicio3Candidato?: SortOrder
    trabalha3Candidato?: SortOrder
    datafinal3Candidato?: SortOrder
    fotoCandidato?: SortOrder
    parentescoCandidato?: SortOrder
    graudeparentescoenomeCandidato?: SortOrder
    datacadastroCandidato?: SortOrder
    situacaoCandidato?: SortOrder
    opcionalCandidato?: SortOrder
  }

  export type CandidatosAvgOrderByAggregateInput = {
    idCandidato?: SortOrder
  }

  export type CandidatosMaxOrderByAggregateInput = {
    idCandidato?: SortOrder
    created_at?: SortOrder
    nomeCandidato?: SortOrder
    cpfCandidato?: SortOrder
    rgCandidato?: SortOrder
    sexoCandidato?: SortOrder
    estadocivilCandidato?: SortOrder
    cnhCandidato?: SortOrder
    outrosexoCandidato?: SortOrder
    categoriacnhCandidato?: SortOrder
    emailCandidato?: SortOrder
    datanascimentoCandidato?: SortOrder
    linkedinCandidato?: SortOrder
    facebookCandidato?: SortOrder
    instagramCandidato?: SortOrder
    telefoneCandidato?: SortOrder
    telefone2Candidato?: SortOrder
    pcdCandidato?: SortOrder
    cidareacandidato?: SortOrder
    cepCandidato?: SortOrder
    ruaCandidato?: SortOrder
    numeroCandidato?: SortOrder
    bairroCandidato?: SortOrder
    cidadeCandidato?: SortOrder
    estadoCandidato?: SortOrder
    vagainteresseCandidato?: SortOrder
    escolaridadeCandidato?: SortOrder
    conhecimentosCandidato?: SortOrder
    wordCandidato?: SortOrder
    excelCandidato?: SortOrder
    powerpointCandidato?: SortOrder
    conhecimentosinformaticaCandidato?: SortOrder
    conhecimentoinfcandidato?: SortOrder
    possuiexperienciaCandidato?: SortOrder
    empresaCandidato?: SortOrder
    local1Candidato?: SortOrder
    atividadesdesenvolvidas1Candidato?: SortOrder
    datainicioCandidato?: SortOrder
    trabalha1Candidato?: SortOrder
    datafinalCandidato?: SortOrder
    empresa2Candidato?: SortOrder
    local2Candidato?: SortOrder
    atividadesdesenvolvidas2Candidato?: SortOrder
    datainicio2Candidato?: SortOrder
    trabalha2Candidato?: SortOrder
    datafinal2Candidato?: SortOrder
    empresa3Candidato?: SortOrder
    local3Candidato?: SortOrder
    atividadesdesenvolvidas3Candidato?: SortOrder
    datainicio3Candidato?: SortOrder
    trabalha3Candidato?: SortOrder
    datafinal3Candidato?: SortOrder
    fotoCandidato?: SortOrder
    parentescoCandidato?: SortOrder
    graudeparentescoenomeCandidato?: SortOrder
    datacadastroCandidato?: SortOrder
    situacaoCandidato?: SortOrder
    opcionalCandidato?: SortOrder
  }

  export type CandidatosMinOrderByAggregateInput = {
    idCandidato?: SortOrder
    created_at?: SortOrder
    nomeCandidato?: SortOrder
    cpfCandidato?: SortOrder
    rgCandidato?: SortOrder
    sexoCandidato?: SortOrder
    estadocivilCandidato?: SortOrder
    cnhCandidato?: SortOrder
    outrosexoCandidato?: SortOrder
    categoriacnhCandidato?: SortOrder
    emailCandidato?: SortOrder
    datanascimentoCandidato?: SortOrder
    linkedinCandidato?: SortOrder
    facebookCandidato?: SortOrder
    instagramCandidato?: SortOrder
    telefoneCandidato?: SortOrder
    telefone2Candidato?: SortOrder
    pcdCandidato?: SortOrder
    cidareacandidato?: SortOrder
    cepCandidato?: SortOrder
    ruaCandidato?: SortOrder
    numeroCandidato?: SortOrder
    bairroCandidato?: SortOrder
    cidadeCandidato?: SortOrder
    estadoCandidato?: SortOrder
    vagainteresseCandidato?: SortOrder
    escolaridadeCandidato?: SortOrder
    conhecimentosCandidato?: SortOrder
    wordCandidato?: SortOrder
    excelCandidato?: SortOrder
    powerpointCandidato?: SortOrder
    conhecimentosinformaticaCandidato?: SortOrder
    conhecimentoinfcandidato?: SortOrder
    possuiexperienciaCandidato?: SortOrder
    empresaCandidato?: SortOrder
    local1Candidato?: SortOrder
    atividadesdesenvolvidas1Candidato?: SortOrder
    datainicioCandidato?: SortOrder
    trabalha1Candidato?: SortOrder
    datafinalCandidato?: SortOrder
    empresa2Candidato?: SortOrder
    local2Candidato?: SortOrder
    atividadesdesenvolvidas2Candidato?: SortOrder
    datainicio2Candidato?: SortOrder
    trabalha2Candidato?: SortOrder
    datafinal2Candidato?: SortOrder
    empresa3Candidato?: SortOrder
    local3Candidato?: SortOrder
    atividadesdesenvolvidas3Candidato?: SortOrder
    datainicio3Candidato?: SortOrder
    trabalha3Candidato?: SortOrder
    datafinal3Candidato?: SortOrder
    fotoCandidato?: SortOrder
    parentescoCandidato?: SortOrder
    graudeparentescoenomeCandidato?: SortOrder
    datacadastroCandidato?: SortOrder
    situacaoCandidato?: SortOrder
    opcionalCandidato?: SortOrder
  }

  export type CandidatosSumOrderByAggregateInput = {
    idCandidato?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type usuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhahash?: SortOrder
    autorizado?: SortOrder
    fotourl?: SortOrder
    criadoem?: SortOrder
  }

  export type usuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type usuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhahash?: SortOrder
    autorizado?: SortOrder
    fotourl?: SortOrder
    criadoem?: SortOrder
  }

  export type usuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhahash?: SortOrder
    autorizado?: SortOrder
    fotourl?: SortOrder
    criadoem?: SortOrder
  }

  export type usuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}