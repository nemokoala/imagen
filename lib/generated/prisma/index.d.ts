
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model LoginAttempt
 * 
 */
export type LoginAttempt = $Result.DefaultSelection<Prisma.$LoginAttemptPayload>
/**
 * Model GeneratedImage
 * 
 */
export type GeneratedImage = $Result.DefaultSelection<Prisma.$GeneratedImagePayload>
/**
 * Model ImageLike
 * 
 */
export type ImageLike = $Result.DefaultSelection<Prisma.$ImageLikePayload>
/**
 * Model ImageComment
 * 
 */
export type ImageComment = $Result.DefaultSelection<Prisma.$ImageCommentPayload>
/**
 * Model CreditSettings
 * 
 */
export type CreditSettings = $Result.DefaultSelection<Prisma.$CreditSettingsPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  user: 'user',
  admin: 'admin'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const AuthProvider: {
  local: 'local',
  kakao: 'kakao'
};

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider]


export const NotificationType: {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type AuthProvider = $Enums.AuthProvider

export const AuthProvider: typeof $Enums.AuthProvider

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginAttempt`: Exposes CRUD operations for the **LoginAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginAttempts
    * const loginAttempts = await prisma.loginAttempt.findMany()
    * ```
    */
  get loginAttempt(): Prisma.LoginAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.generatedImage`: Exposes CRUD operations for the **GeneratedImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GeneratedImages
    * const generatedImages = await prisma.generatedImage.findMany()
    * ```
    */
  get generatedImage(): Prisma.GeneratedImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageLike`: Exposes CRUD operations for the **ImageLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageLikes
    * const imageLikes = await prisma.imageLike.findMany()
    * ```
    */
  get imageLike(): Prisma.ImageLikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageComment`: Exposes CRUD operations for the **ImageComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageComments
    * const imageComments = await prisma.imageComment.findMany()
    * ```
    */
  get imageComment(): Prisma.ImageCommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.creditSettings`: Exposes CRUD operations for the **CreditSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CreditSettings
    * const creditSettings = await prisma.creditSettings.findMany()
    * ```
    */
  get creditSettings(): Prisma.CreditSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
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
    User: 'User',
    LoginAttempt: 'LoginAttempt',
    GeneratedImage: 'GeneratedImage',
    ImageLike: 'ImageLike',
    ImageComment: 'ImageComment',
    CreditSettings: 'CreditSettings',
    Category: 'Category',
    Notification: 'Notification'
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
      modelProps: "user" | "loginAttempt" | "generatedImage" | "imageLike" | "imageComment" | "creditSettings" | "category" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      LoginAttempt: {
        payload: Prisma.$LoginAttemptPayload<ExtArgs>
        fields: Prisma.LoginAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          findFirst: {
            args: Prisma.LoginAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          findMany: {
            args: Prisma.LoginAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>[]
          }
          create: {
            args: Prisma.LoginAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          createMany: {
            args: Prisma.LoginAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoginAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          update: {
            args: Prisma.LoginAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          deleteMany: {
            args: Prisma.LoginAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoginAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptPayload>
          }
          aggregate: {
            args: Prisma.LoginAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginAttempt>
          }
          groupBy: {
            args: Prisma.LoginAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<LoginAttemptCountAggregateOutputType> | number
          }
        }
      }
      GeneratedImage: {
        payload: Prisma.$GeneratedImagePayload<ExtArgs>
        fields: Prisma.GeneratedImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GeneratedImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GeneratedImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          findFirst: {
            args: Prisma.GeneratedImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GeneratedImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          findMany: {
            args: Prisma.GeneratedImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>[]
          }
          create: {
            args: Prisma.GeneratedImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          createMany: {
            args: Prisma.GeneratedImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GeneratedImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          update: {
            args: Prisma.GeneratedImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          deleteMany: {
            args: Prisma.GeneratedImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GeneratedImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GeneratedImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedImagePayload>
          }
          aggregate: {
            args: Prisma.GeneratedImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeneratedImage>
          }
          groupBy: {
            args: Prisma.GeneratedImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<GeneratedImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.GeneratedImageCountArgs<ExtArgs>
            result: $Utils.Optional<GeneratedImageCountAggregateOutputType> | number
          }
        }
      }
      ImageLike: {
        payload: Prisma.$ImageLikePayload<ExtArgs>
        fields: Prisma.ImageLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          findFirst: {
            args: Prisma.ImageLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          findMany: {
            args: Prisma.ImageLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>[]
          }
          create: {
            args: Prisma.ImageLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          createMany: {
            args: Prisma.ImageLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ImageLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          update: {
            args: Prisma.ImageLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          deleteMany: {
            args: Prisma.ImageLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImageLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageLikePayload>
          }
          aggregate: {
            args: Prisma.ImageLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageLike>
          }
          groupBy: {
            args: Prisma.ImageLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageLikeCountArgs<ExtArgs>
            result: $Utils.Optional<ImageLikeCountAggregateOutputType> | number
          }
        }
      }
      ImageComment: {
        payload: Prisma.$ImageCommentPayload<ExtArgs>
        fields: Prisma.ImageCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          findFirst: {
            args: Prisma.ImageCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          findMany: {
            args: Prisma.ImageCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>[]
          }
          create: {
            args: Prisma.ImageCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          createMany: {
            args: Prisma.ImageCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ImageCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          update: {
            args: Prisma.ImageCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          deleteMany: {
            args: Prisma.ImageCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImageCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageCommentPayload>
          }
          aggregate: {
            args: Prisma.ImageCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageComment>
          }
          groupBy: {
            args: Prisma.ImageCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageCommentCountArgs<ExtArgs>
            result: $Utils.Optional<ImageCommentCountAggregateOutputType> | number
          }
        }
      }
      CreditSettings: {
        payload: Prisma.$CreditSettingsPayload<ExtArgs>
        fields: Prisma.CreditSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CreditSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CreditSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          findFirst: {
            args: Prisma.CreditSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CreditSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          findMany: {
            args: Prisma.CreditSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>[]
          }
          create: {
            args: Prisma.CreditSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          createMany: {
            args: Prisma.CreditSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CreditSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          update: {
            args: Prisma.CreditSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          deleteMany: {
            args: Prisma.CreditSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CreditSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CreditSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CreditSettingsPayload>
          }
          aggregate: {
            args: Prisma.CreditSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCreditSettings>
          }
          groupBy: {
            args: Prisma.CreditSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CreditSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CreditSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<CreditSettingsCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
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
    user?: UserOmit
    loginAttempt?: LoginAttemptOmit
    generatedImage?: GeneratedImageOmit
    imageLike?: ImageLikeOmit
    imageComment?: ImageCommentOmit
    creditSettings?: CreditSettingsOmit
    category?: CategoryOmit
    notification?: NotificationOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    loginAttempts: number
    generatedImages: number
    imageLikes: number
    imageComments: number
    notifications: number
    triggeredNotifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loginAttempts?: boolean | UserCountOutputTypeCountLoginAttemptsArgs
    generatedImages?: boolean | UserCountOutputTypeCountGeneratedImagesArgs
    imageLikes?: boolean | UserCountOutputTypeCountImageLikesArgs
    imageComments?: boolean | UserCountOutputTypeCountImageCommentsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    triggeredNotifications?: boolean | UserCountOutputTypeCountTriggeredNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLoginAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAttemptWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGeneratedImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneratedImageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountImageLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageLikeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountImageCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageCommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTriggeredNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type GeneratedImageCountOutputType
   */

  export type GeneratedImageCountOutputType = {
    likes: number
    comments: number
    categories: number
    notifications: number
  }

  export type GeneratedImageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | GeneratedImageCountOutputTypeCountLikesArgs
    comments?: boolean | GeneratedImageCountOutputTypeCountCommentsArgs
    categories?: boolean | GeneratedImageCountOutputTypeCountCategoriesArgs
    notifications?: boolean | GeneratedImageCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * GeneratedImageCountOutputType without action
   */
  export type GeneratedImageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImageCountOutputType
     */
    select?: GeneratedImageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GeneratedImageCountOutputType without action
   */
  export type GeneratedImageCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageLikeWhereInput
  }

  /**
   * GeneratedImageCountOutputType without action
   */
  export type GeneratedImageCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageCommentWhereInput
  }

  /**
   * GeneratedImageCountOutputType without action
   */
  export type GeneratedImageCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }

  /**
   * GeneratedImageCountOutputType without action
   */
  export type GeneratedImageCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type ImageCommentCountOutputType
   */

  export type ImageCommentCountOutputType = {
    replies: number
    notifications: number
  }

  export type ImageCommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | ImageCommentCountOutputTypeCountRepliesArgs
    notifications?: boolean | ImageCommentCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * ImageCommentCountOutputType without action
   */
  export type ImageCommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageCommentCountOutputType
     */
    select?: ImageCommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImageCommentCountOutputType without action
   */
  export type ImageCommentCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageCommentWhereInput
  }

  /**
   * ImageCommentCountOutputType without action
   */
  export type ImageCommentCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    images: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | CategoryCountOutputTypeCountImagesArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneratedImageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    credits: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    credits: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nickname: string | null
    credits: number | null
    role: $Enums.UserRole | null
    provider: $Enums.AuthProvider | null
    kakaoId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    profileImageUrl: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    nickname: string | null
    credits: number | null
    role: $Enums.UserRole | null
    provider: $Enums.AuthProvider | null
    kakaoId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    profileImageUrl: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    nickname: number
    credits: number
    role: number
    provider: number
    kakaoId: number
    createdAt: number
    updatedAt: number
    profileImageUrl: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    credits?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    credits?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    credits?: true
    role?: true
    provider?: true
    kakaoId?: true
    createdAt?: true
    updatedAt?: true
    profileImageUrl?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    credits?: true
    role?: true
    provider?: true
    kakaoId?: true
    createdAt?: true
    updatedAt?: true
    profileImageUrl?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nickname?: true
    credits?: true
    role?: true
    provider?: true
    kakaoId?: true
    createdAt?: true
    updatedAt?: true
    profileImageUrl?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    password: string | null
    nickname: string
    credits: number
    role: $Enums.UserRole
    provider: $Enums.AuthProvider
    kakaoId: string | null
    createdAt: Date
    updatedAt: Date
    profileImageUrl: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nickname?: boolean
    credits?: boolean
    role?: boolean
    provider?: boolean
    kakaoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profileImageUrl?: boolean
    loginAttempts?: boolean | User$loginAttemptsArgs<ExtArgs>
    generatedImages?: boolean | User$generatedImagesArgs<ExtArgs>
    imageLikes?: boolean | User$imageLikesArgs<ExtArgs>
    imageComments?: boolean | User$imageCommentsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    triggeredNotifications?: boolean | User$triggeredNotificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    nickname?: boolean
    credits?: boolean
    role?: boolean
    provider?: boolean
    kakaoId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profileImageUrl?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "nickname" | "credits" | "role" | "provider" | "kakaoId" | "createdAt" | "updatedAt" | "profileImageUrl", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loginAttempts?: boolean | User$loginAttemptsArgs<ExtArgs>
    generatedImages?: boolean | User$generatedImagesArgs<ExtArgs>
    imageLikes?: boolean | User$imageLikesArgs<ExtArgs>
    imageComments?: boolean | User$imageCommentsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    triggeredNotifications?: boolean | User$triggeredNotificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      loginAttempts: Prisma.$LoginAttemptPayload<ExtArgs>[]
      generatedImages: Prisma.$GeneratedImagePayload<ExtArgs>[]
      imageLikes: Prisma.$ImageLikePayload<ExtArgs>[]
      imageComments: Prisma.$ImageCommentPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      triggeredNotifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string | null
      nickname: string
      credits: number
      role: $Enums.UserRole
      provider: $Enums.AuthProvider
      kakaoId: string | null
      createdAt: Date
      updatedAt: Date
      profileImageUrl: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loginAttempts<T extends User$loginAttemptsArgs<ExtArgs> = {}>(args?: Subset<T, User$loginAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    generatedImages<T extends User$generatedImagesArgs<ExtArgs> = {}>(args?: Subset<T, User$generatedImagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imageLikes<T extends User$imageLikesArgs<ExtArgs> = {}>(args?: Subset<T, User$imageLikesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imageComments<T extends User$imageCommentsArgs<ExtArgs> = {}>(args?: Subset<T, User$imageCommentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    triggeredNotifications<T extends User$triggeredNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$triggeredNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly credits: FieldRef<"User", 'Int'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly provider: FieldRef<"User", 'AuthProvider'>
    readonly kakaoId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly profileImageUrl: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.loginAttempts
   */
  export type User$loginAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    where?: LoginAttemptWhereInput
    orderBy?: LoginAttemptOrderByWithRelationInput | LoginAttemptOrderByWithRelationInput[]
    cursor?: LoginAttemptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginAttemptScalarFieldEnum | LoginAttemptScalarFieldEnum[]
  }

  /**
   * User.generatedImages
   */
  export type User$generatedImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    where?: GeneratedImageWhereInput
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    cursor?: GeneratedImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GeneratedImageScalarFieldEnum | GeneratedImageScalarFieldEnum[]
  }

  /**
   * User.imageLikes
   */
  export type User$imageLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    where?: ImageLikeWhereInput
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    cursor?: ImageLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageLikeScalarFieldEnum | ImageLikeScalarFieldEnum[]
  }

  /**
   * User.imageComments
   */
  export type User$imageCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    where?: ImageCommentWhereInput
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    cursor?: ImageCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.triggeredNotifications
   */
  export type User$triggeredNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model LoginAttempt
   */

  export type AggregateLoginAttempt = {
    _count: LoginAttemptCountAggregateOutputType | null
    _avg: LoginAttemptAvgAggregateOutputType | null
    _sum: LoginAttemptSumAggregateOutputType | null
    _min: LoginAttemptMinAggregateOutputType | null
    _max: LoginAttemptMaxAggregateOutputType | null
  }

  export type LoginAttemptAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type LoginAttemptSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type LoginAttemptMinAggregateOutputType = {
    id: number | null
    userId: number | null
    failedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoginAttemptMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    failedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoginAttemptCountAggregateOutputType = {
    id: number
    userId: number
    failedAt: number
    ipAddress: number
    userAgent: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoginAttemptAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type LoginAttemptSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type LoginAttemptMinAggregateInputType = {
    id?: true
    userId?: true
    failedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoginAttemptMaxAggregateInputType = {
    id?: true
    userId?: true
    failedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoginAttemptCountAggregateInputType = {
    id?: true
    userId?: true
    failedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoginAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAttempt to aggregate.
     */
    where?: LoginAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptOrderByWithRelationInput | LoginAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginAttempts
    **/
    _count?: true | LoginAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoginAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoginAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginAttemptMaxAggregateInputType
  }

  export type GetLoginAttemptAggregateType<T extends LoginAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginAttempt[P]>
      : GetScalarType<T[P], AggregateLoginAttempt[P]>
  }




  export type LoginAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAttemptWhereInput
    orderBy?: LoginAttemptOrderByWithAggregationInput | LoginAttemptOrderByWithAggregationInput[]
    by: LoginAttemptScalarFieldEnum[] | LoginAttemptScalarFieldEnum
    having?: LoginAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginAttemptCountAggregateInputType | true
    _avg?: LoginAttemptAvgAggregateInputType
    _sum?: LoginAttemptSumAggregateInputType
    _min?: LoginAttemptMinAggregateInputType
    _max?: LoginAttemptMaxAggregateInputType
  }

  export type LoginAttemptGroupByOutputType = {
    id: number
    userId: number
    failedAt: Date
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    updatedAt: Date
    _count: LoginAttemptCountAggregateOutputType | null
    _avg: LoginAttemptAvgAggregateOutputType | null
    _sum: LoginAttemptSumAggregateOutputType | null
    _min: LoginAttemptMinAggregateOutputType | null
    _max: LoginAttemptMaxAggregateOutputType | null
  }

  type GetLoginAttemptGroupByPayload<T extends LoginAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], LoginAttemptGroupByOutputType[P]>
        }
      >
    >


  export type LoginAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    failedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAttempt"]>



  export type LoginAttemptSelectScalar = {
    id?: boolean
    userId?: boolean
    failedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoginAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "failedAt" | "ipAddress" | "userAgent" | "createdAt" | "updatedAt", ExtArgs["result"]["loginAttempt"]>
  export type LoginAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LoginAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginAttempt"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      failedAt: Date
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loginAttempt"]>
    composites: {}
  }

  type LoginAttemptGetPayload<S extends boolean | null | undefined | LoginAttemptDefaultArgs> = $Result.GetResult<Prisma.$LoginAttemptPayload, S>

  type LoginAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginAttemptCountAggregateInputType | true
    }

  export interface LoginAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginAttempt'], meta: { name: 'LoginAttempt' } }
    /**
     * Find zero or one LoginAttempt that matches the filter.
     * @param {LoginAttemptFindUniqueArgs} args - Arguments to find a LoginAttempt
     * @example
     * // Get one LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginAttemptFindUniqueArgs>(args: SelectSubset<T, LoginAttemptFindUniqueArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginAttemptFindUniqueOrThrowArgs} args - Arguments to find a LoginAttempt
     * @example
     * // Get one LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptFindFirstArgs} args - Arguments to find a LoginAttempt
     * @example
     * // Get one LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginAttemptFindFirstArgs>(args?: SelectSubset<T, LoginAttemptFindFirstArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptFindFirstOrThrowArgs} args - Arguments to find a LoginAttempt
     * @example
     * // Get one LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginAttempts
     * const loginAttempts = await prisma.loginAttempt.findMany()
     * 
     * // Get first 10 LoginAttempts
     * const loginAttempts = await prisma.loginAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginAttemptWithIdOnly = await prisma.loginAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginAttemptFindManyArgs>(args?: SelectSubset<T, LoginAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginAttempt.
     * @param {LoginAttemptCreateArgs} args - Arguments to create a LoginAttempt.
     * @example
     * // Create one LoginAttempt
     * const LoginAttempt = await prisma.loginAttempt.create({
     *   data: {
     *     // ... data to create a LoginAttempt
     *   }
     * })
     * 
     */
    create<T extends LoginAttemptCreateArgs>(args: SelectSubset<T, LoginAttemptCreateArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginAttempts.
     * @param {LoginAttemptCreateManyArgs} args - Arguments to create many LoginAttempts.
     * @example
     * // Create many LoginAttempts
     * const loginAttempt = await prisma.loginAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginAttemptCreateManyArgs>(args?: SelectSubset<T, LoginAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LoginAttempt.
     * @param {LoginAttemptDeleteArgs} args - Arguments to delete one LoginAttempt.
     * @example
     * // Delete one LoginAttempt
     * const LoginAttempt = await prisma.loginAttempt.delete({
     *   where: {
     *     // ... filter to delete one LoginAttempt
     *   }
     * })
     * 
     */
    delete<T extends LoginAttemptDeleteArgs>(args: SelectSubset<T, LoginAttemptDeleteArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginAttempt.
     * @param {LoginAttemptUpdateArgs} args - Arguments to update one LoginAttempt.
     * @example
     * // Update one LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginAttemptUpdateArgs>(args: SelectSubset<T, LoginAttemptUpdateArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginAttempts.
     * @param {LoginAttemptDeleteManyArgs} args - Arguments to filter LoginAttempts to delete.
     * @example
     * // Delete a few LoginAttempts
     * const { count } = await prisma.loginAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginAttemptDeleteManyArgs>(args?: SelectSubset<T, LoginAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginAttempts
     * const loginAttempt = await prisma.loginAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginAttemptUpdateManyArgs>(args: SelectSubset<T, LoginAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LoginAttempt.
     * @param {LoginAttemptUpsertArgs} args - Arguments to update or create a LoginAttempt.
     * @example
     * // Update or create a LoginAttempt
     * const loginAttempt = await prisma.loginAttempt.upsert({
     *   create: {
     *     // ... data to create a LoginAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginAttempt we want to update
     *   }
     * })
     */
    upsert<T extends LoginAttemptUpsertArgs>(args: SelectSubset<T, LoginAttemptUpsertArgs<ExtArgs>>): Prisma__LoginAttemptClient<$Result.GetResult<Prisma.$LoginAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptCountArgs} args - Arguments to filter LoginAttempts to count.
     * @example
     * // Count the number of LoginAttempts
     * const count = await prisma.loginAttempt.count({
     *   where: {
     *     // ... the filter for the LoginAttempts we want to count
     *   }
     * })
    **/
    count<T extends LoginAttemptCountArgs>(
      args?: Subset<T, LoginAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LoginAttemptAggregateArgs>(args: Subset<T, LoginAttemptAggregateArgs>): Prisma.PrismaPromise<GetLoginAttemptAggregateType<T>>

    /**
     * Group by LoginAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptGroupByArgs} args - Group by arguments.
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
      T extends LoginAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginAttemptGroupByArgs['orderBy'] }
        : { orderBy?: LoginAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LoginAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginAttempt model
   */
  readonly fields: LoginAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the LoginAttempt model
   */
  interface LoginAttemptFieldRefs {
    readonly id: FieldRef<"LoginAttempt", 'Int'>
    readonly userId: FieldRef<"LoginAttempt", 'Int'>
    readonly failedAt: FieldRef<"LoginAttempt", 'DateTime'>
    readonly ipAddress: FieldRef<"LoginAttempt", 'String'>
    readonly userAgent: FieldRef<"LoginAttempt", 'String'>
    readonly createdAt: FieldRef<"LoginAttempt", 'DateTime'>
    readonly updatedAt: FieldRef<"LoginAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginAttempt findUnique
   */
  export type LoginAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempt to fetch.
     */
    where: LoginAttemptWhereUniqueInput
  }

  /**
   * LoginAttempt findUniqueOrThrow
   */
  export type LoginAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempt to fetch.
     */
    where: LoginAttemptWhereUniqueInput
  }

  /**
   * LoginAttempt findFirst
   */
  export type LoginAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempt to fetch.
     */
    where?: LoginAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptOrderByWithRelationInput | LoginAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAttempts.
     */
    cursor?: LoginAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAttempts.
     */
    distinct?: LoginAttemptScalarFieldEnum | LoginAttemptScalarFieldEnum[]
  }

  /**
   * LoginAttempt findFirstOrThrow
   */
  export type LoginAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempt to fetch.
     */
    where?: LoginAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptOrderByWithRelationInput | LoginAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAttempts.
     */
    cursor?: LoginAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAttempts.
     */
    distinct?: LoginAttemptScalarFieldEnum | LoginAttemptScalarFieldEnum[]
  }

  /**
   * LoginAttempt findMany
   */
  export type LoginAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where?: LoginAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptOrderByWithRelationInput | LoginAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginAttempts.
     */
    cursor?: LoginAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    distinct?: LoginAttemptScalarFieldEnum | LoginAttemptScalarFieldEnum[]
  }

  /**
   * LoginAttempt create
   */
  export type LoginAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginAttempt.
     */
    data: XOR<LoginAttemptCreateInput, LoginAttemptUncheckedCreateInput>
  }

  /**
   * LoginAttempt createMany
   */
  export type LoginAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginAttempts.
     */
    data: LoginAttemptCreateManyInput | LoginAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoginAttempt update
   */
  export type LoginAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginAttempt.
     */
    data: XOR<LoginAttemptUpdateInput, LoginAttemptUncheckedUpdateInput>
    /**
     * Choose, which LoginAttempt to update.
     */
    where: LoginAttemptWhereUniqueInput
  }

  /**
   * LoginAttempt updateMany
   */
  export type LoginAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginAttempts.
     */
    data: XOR<LoginAttemptUpdateManyMutationInput, LoginAttemptUncheckedUpdateManyInput>
    /**
     * Filter which LoginAttempts to update
     */
    where?: LoginAttemptWhereInput
    /**
     * Limit how many LoginAttempts to update.
     */
    limit?: number
  }

  /**
   * LoginAttempt upsert
   */
  export type LoginAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginAttempt to update in case it exists.
     */
    where: LoginAttemptWhereUniqueInput
    /**
     * In case the LoginAttempt found by the `where` argument doesn't exist, create a new LoginAttempt with this data.
     */
    create: XOR<LoginAttemptCreateInput, LoginAttemptUncheckedCreateInput>
    /**
     * In case the LoginAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginAttemptUpdateInput, LoginAttemptUncheckedUpdateInput>
  }

  /**
   * LoginAttempt delete
   */
  export type LoginAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
    /**
     * Filter which LoginAttempt to delete.
     */
    where: LoginAttemptWhereUniqueInput
  }

  /**
   * LoginAttempt deleteMany
   */
  export type LoginAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAttempts to delete
     */
    where?: LoginAttemptWhereInput
    /**
     * Limit how many LoginAttempts to delete.
     */
    limit?: number
  }

  /**
   * LoginAttempt without action
   */
  export type LoginAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempt
     */
    select?: LoginAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempt
     */
    omit?: LoginAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptInclude<ExtArgs> | null
  }


  /**
   * Model GeneratedImage
   */

  export type AggregateGeneratedImage = {
    _count: GeneratedImageCountAggregateOutputType | null
    _avg: GeneratedImageAvgAggregateOutputType | null
    _sum: GeneratedImageSumAggregateOutputType | null
    _min: GeneratedImageMinAggregateOutputType | null
    _max: GeneratedImageMaxAggregateOutputType | null
  }

  export type GeneratedImageAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type GeneratedImageSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type GeneratedImageMinAggregateOutputType = {
    id: number | null
    userId: number | null
    prompt: string | null
    translatedPrompt: string | null
    imageUrl: string | null
    model: string | null
    size: string | null
    editData: string | null
    editedImageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GeneratedImageMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    prompt: string | null
    translatedPrompt: string | null
    imageUrl: string | null
    model: string | null
    size: string | null
    editData: string | null
    editedImageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GeneratedImageCountAggregateOutputType = {
    id: number
    userId: number
    prompt: number
    translatedPrompt: number
    imageUrl: number
    model: number
    size: number
    editData: number
    editedImageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GeneratedImageAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type GeneratedImageSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type GeneratedImageMinAggregateInputType = {
    id?: true
    userId?: true
    prompt?: true
    translatedPrompt?: true
    imageUrl?: true
    model?: true
    size?: true
    editData?: true
    editedImageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GeneratedImageMaxAggregateInputType = {
    id?: true
    userId?: true
    prompt?: true
    translatedPrompt?: true
    imageUrl?: true
    model?: true
    size?: true
    editData?: true
    editedImageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GeneratedImageCountAggregateInputType = {
    id?: true
    userId?: true
    prompt?: true
    translatedPrompt?: true
    imageUrl?: true
    model?: true
    size?: true
    editData?: true
    editedImageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GeneratedImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneratedImage to aggregate.
     */
    where?: GeneratedImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedImages to fetch.
     */
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GeneratedImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GeneratedImages
    **/
    _count?: true | GeneratedImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GeneratedImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GeneratedImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GeneratedImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GeneratedImageMaxAggregateInputType
  }

  export type GetGeneratedImageAggregateType<T extends GeneratedImageAggregateArgs> = {
        [P in keyof T & keyof AggregateGeneratedImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeneratedImage[P]>
      : GetScalarType<T[P], AggregateGeneratedImage[P]>
  }




  export type GeneratedImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneratedImageWhereInput
    orderBy?: GeneratedImageOrderByWithAggregationInput | GeneratedImageOrderByWithAggregationInput[]
    by: GeneratedImageScalarFieldEnum[] | GeneratedImageScalarFieldEnum
    having?: GeneratedImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GeneratedImageCountAggregateInputType | true
    _avg?: GeneratedImageAvgAggregateInputType
    _sum?: GeneratedImageSumAggregateInputType
    _min?: GeneratedImageMinAggregateInputType
    _max?: GeneratedImageMaxAggregateInputType
  }

  export type GeneratedImageGroupByOutputType = {
    id: number
    userId: number
    prompt: string
    translatedPrompt: string | null
    imageUrl: string
    model: string
    size: string
    editData: string | null
    editedImageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: GeneratedImageCountAggregateOutputType | null
    _avg: GeneratedImageAvgAggregateOutputType | null
    _sum: GeneratedImageSumAggregateOutputType | null
    _min: GeneratedImageMinAggregateOutputType | null
    _max: GeneratedImageMaxAggregateOutputType | null
  }

  type GetGeneratedImageGroupByPayload<T extends GeneratedImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GeneratedImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GeneratedImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GeneratedImageGroupByOutputType[P]>
            : GetScalarType<T[P], GeneratedImageGroupByOutputType[P]>
        }
      >
    >


  export type GeneratedImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    prompt?: boolean
    translatedPrompt?: boolean
    imageUrl?: boolean
    model?: boolean
    size?: boolean
    editData?: boolean
    editedImageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    likes?: boolean | GeneratedImage$likesArgs<ExtArgs>
    comments?: boolean | GeneratedImage$commentsArgs<ExtArgs>
    categories?: boolean | GeneratedImage$categoriesArgs<ExtArgs>
    notifications?: boolean | GeneratedImage$notificationsArgs<ExtArgs>
    _count?: boolean | GeneratedImageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generatedImage"]>



  export type GeneratedImageSelectScalar = {
    id?: boolean
    userId?: boolean
    prompt?: boolean
    translatedPrompt?: boolean
    imageUrl?: boolean
    model?: boolean
    size?: boolean
    editData?: boolean
    editedImageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GeneratedImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "prompt" | "translatedPrompt" | "imageUrl" | "model" | "size" | "editData" | "editedImageUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["generatedImage"]>
  export type GeneratedImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    likes?: boolean | GeneratedImage$likesArgs<ExtArgs>
    comments?: boolean | GeneratedImage$commentsArgs<ExtArgs>
    categories?: boolean | GeneratedImage$categoriesArgs<ExtArgs>
    notifications?: boolean | GeneratedImage$notificationsArgs<ExtArgs>
    _count?: boolean | GeneratedImageCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $GeneratedImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GeneratedImage"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      likes: Prisma.$ImageLikePayload<ExtArgs>[]
      comments: Prisma.$ImageCommentPayload<ExtArgs>[]
      categories: Prisma.$CategoryPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      prompt: string
      translatedPrompt: string | null
      imageUrl: string
      model: string
      size: string
      editData: string | null
      editedImageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["generatedImage"]>
    composites: {}
  }

  type GeneratedImageGetPayload<S extends boolean | null | undefined | GeneratedImageDefaultArgs> = $Result.GetResult<Prisma.$GeneratedImagePayload, S>

  type GeneratedImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GeneratedImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GeneratedImageCountAggregateInputType | true
    }

  export interface GeneratedImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GeneratedImage'], meta: { name: 'GeneratedImage' } }
    /**
     * Find zero or one GeneratedImage that matches the filter.
     * @param {GeneratedImageFindUniqueArgs} args - Arguments to find a GeneratedImage
     * @example
     * // Get one GeneratedImage
     * const generatedImage = await prisma.generatedImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GeneratedImageFindUniqueArgs>(args: SelectSubset<T, GeneratedImageFindUniqueArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GeneratedImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GeneratedImageFindUniqueOrThrowArgs} args - Arguments to find a GeneratedImage
     * @example
     * // Get one GeneratedImage
     * const generatedImage = await prisma.generatedImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GeneratedImageFindUniqueOrThrowArgs>(args: SelectSubset<T, GeneratedImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeneratedImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageFindFirstArgs} args - Arguments to find a GeneratedImage
     * @example
     * // Get one GeneratedImage
     * const generatedImage = await prisma.generatedImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GeneratedImageFindFirstArgs>(args?: SelectSubset<T, GeneratedImageFindFirstArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeneratedImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageFindFirstOrThrowArgs} args - Arguments to find a GeneratedImage
     * @example
     * // Get one GeneratedImage
     * const generatedImage = await prisma.generatedImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GeneratedImageFindFirstOrThrowArgs>(args?: SelectSubset<T, GeneratedImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GeneratedImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GeneratedImages
     * const generatedImages = await prisma.generatedImage.findMany()
     * 
     * // Get first 10 GeneratedImages
     * const generatedImages = await prisma.generatedImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generatedImageWithIdOnly = await prisma.generatedImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GeneratedImageFindManyArgs>(args?: SelectSubset<T, GeneratedImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GeneratedImage.
     * @param {GeneratedImageCreateArgs} args - Arguments to create a GeneratedImage.
     * @example
     * // Create one GeneratedImage
     * const GeneratedImage = await prisma.generatedImage.create({
     *   data: {
     *     // ... data to create a GeneratedImage
     *   }
     * })
     * 
     */
    create<T extends GeneratedImageCreateArgs>(args: SelectSubset<T, GeneratedImageCreateArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GeneratedImages.
     * @param {GeneratedImageCreateManyArgs} args - Arguments to create many GeneratedImages.
     * @example
     * // Create many GeneratedImages
     * const generatedImage = await prisma.generatedImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GeneratedImageCreateManyArgs>(args?: SelectSubset<T, GeneratedImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GeneratedImage.
     * @param {GeneratedImageDeleteArgs} args - Arguments to delete one GeneratedImage.
     * @example
     * // Delete one GeneratedImage
     * const GeneratedImage = await prisma.generatedImage.delete({
     *   where: {
     *     // ... filter to delete one GeneratedImage
     *   }
     * })
     * 
     */
    delete<T extends GeneratedImageDeleteArgs>(args: SelectSubset<T, GeneratedImageDeleteArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GeneratedImage.
     * @param {GeneratedImageUpdateArgs} args - Arguments to update one GeneratedImage.
     * @example
     * // Update one GeneratedImage
     * const generatedImage = await prisma.generatedImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GeneratedImageUpdateArgs>(args: SelectSubset<T, GeneratedImageUpdateArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GeneratedImages.
     * @param {GeneratedImageDeleteManyArgs} args - Arguments to filter GeneratedImages to delete.
     * @example
     * // Delete a few GeneratedImages
     * const { count } = await prisma.generatedImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GeneratedImageDeleteManyArgs>(args?: SelectSubset<T, GeneratedImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeneratedImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GeneratedImages
     * const generatedImage = await prisma.generatedImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GeneratedImageUpdateManyArgs>(args: SelectSubset<T, GeneratedImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GeneratedImage.
     * @param {GeneratedImageUpsertArgs} args - Arguments to update or create a GeneratedImage.
     * @example
     * // Update or create a GeneratedImage
     * const generatedImage = await prisma.generatedImage.upsert({
     *   create: {
     *     // ... data to create a GeneratedImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GeneratedImage we want to update
     *   }
     * })
     */
    upsert<T extends GeneratedImageUpsertArgs>(args: SelectSubset<T, GeneratedImageUpsertArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GeneratedImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageCountArgs} args - Arguments to filter GeneratedImages to count.
     * @example
     * // Count the number of GeneratedImages
     * const count = await prisma.generatedImage.count({
     *   where: {
     *     // ... the filter for the GeneratedImages we want to count
     *   }
     * })
    **/
    count<T extends GeneratedImageCountArgs>(
      args?: Subset<T, GeneratedImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GeneratedImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GeneratedImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GeneratedImageAggregateArgs>(args: Subset<T, GeneratedImageAggregateArgs>): Prisma.PrismaPromise<GetGeneratedImageAggregateType<T>>

    /**
     * Group by GeneratedImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedImageGroupByArgs} args - Group by arguments.
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
      T extends GeneratedImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GeneratedImageGroupByArgs['orderBy'] }
        : { orderBy?: GeneratedImageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GeneratedImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGeneratedImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GeneratedImage model
   */
  readonly fields: GeneratedImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GeneratedImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GeneratedImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    likes<T extends GeneratedImage$likesArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImage$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends GeneratedImage$commentsArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImage$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    categories<T extends GeneratedImage$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImage$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends GeneratedImage$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImage$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the GeneratedImage model
   */
  interface GeneratedImageFieldRefs {
    readonly id: FieldRef<"GeneratedImage", 'Int'>
    readonly userId: FieldRef<"GeneratedImage", 'Int'>
    readonly prompt: FieldRef<"GeneratedImage", 'String'>
    readonly translatedPrompt: FieldRef<"GeneratedImage", 'String'>
    readonly imageUrl: FieldRef<"GeneratedImage", 'String'>
    readonly model: FieldRef<"GeneratedImage", 'String'>
    readonly size: FieldRef<"GeneratedImage", 'String'>
    readonly editData: FieldRef<"GeneratedImage", 'String'>
    readonly editedImageUrl: FieldRef<"GeneratedImage", 'String'>
    readonly createdAt: FieldRef<"GeneratedImage", 'DateTime'>
    readonly updatedAt: FieldRef<"GeneratedImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GeneratedImage findUnique
   */
  export type GeneratedImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedImage to fetch.
     */
    where: GeneratedImageWhereUniqueInput
  }

  /**
   * GeneratedImage findUniqueOrThrow
   */
  export type GeneratedImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedImage to fetch.
     */
    where: GeneratedImageWhereUniqueInput
  }

  /**
   * GeneratedImage findFirst
   */
  export type GeneratedImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedImage to fetch.
     */
    where?: GeneratedImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedImages to fetch.
     */
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneratedImages.
     */
    cursor?: GeneratedImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneratedImages.
     */
    distinct?: GeneratedImageScalarFieldEnum | GeneratedImageScalarFieldEnum[]
  }

  /**
   * GeneratedImage findFirstOrThrow
   */
  export type GeneratedImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedImage to fetch.
     */
    where?: GeneratedImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedImages to fetch.
     */
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneratedImages.
     */
    cursor?: GeneratedImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneratedImages.
     */
    distinct?: GeneratedImageScalarFieldEnum | GeneratedImageScalarFieldEnum[]
  }

  /**
   * GeneratedImage findMany
   */
  export type GeneratedImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedImages to fetch.
     */
    where?: GeneratedImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedImages to fetch.
     */
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GeneratedImages.
     */
    cursor?: GeneratedImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedImages.
     */
    skip?: number
    distinct?: GeneratedImageScalarFieldEnum | GeneratedImageScalarFieldEnum[]
  }

  /**
   * GeneratedImage create
   */
  export type GeneratedImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * The data needed to create a GeneratedImage.
     */
    data: XOR<GeneratedImageCreateInput, GeneratedImageUncheckedCreateInput>
  }

  /**
   * GeneratedImage createMany
   */
  export type GeneratedImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GeneratedImages.
     */
    data: GeneratedImageCreateManyInput | GeneratedImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GeneratedImage update
   */
  export type GeneratedImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * The data needed to update a GeneratedImage.
     */
    data: XOR<GeneratedImageUpdateInput, GeneratedImageUncheckedUpdateInput>
    /**
     * Choose, which GeneratedImage to update.
     */
    where: GeneratedImageWhereUniqueInput
  }

  /**
   * GeneratedImage updateMany
   */
  export type GeneratedImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GeneratedImages.
     */
    data: XOR<GeneratedImageUpdateManyMutationInput, GeneratedImageUncheckedUpdateManyInput>
    /**
     * Filter which GeneratedImages to update
     */
    where?: GeneratedImageWhereInput
    /**
     * Limit how many GeneratedImages to update.
     */
    limit?: number
  }

  /**
   * GeneratedImage upsert
   */
  export type GeneratedImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * The filter to search for the GeneratedImage to update in case it exists.
     */
    where: GeneratedImageWhereUniqueInput
    /**
     * In case the GeneratedImage found by the `where` argument doesn't exist, create a new GeneratedImage with this data.
     */
    create: XOR<GeneratedImageCreateInput, GeneratedImageUncheckedCreateInput>
    /**
     * In case the GeneratedImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GeneratedImageUpdateInput, GeneratedImageUncheckedUpdateInput>
  }

  /**
   * GeneratedImage delete
   */
  export type GeneratedImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    /**
     * Filter which GeneratedImage to delete.
     */
    where: GeneratedImageWhereUniqueInput
  }

  /**
   * GeneratedImage deleteMany
   */
  export type GeneratedImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneratedImages to delete
     */
    where?: GeneratedImageWhereInput
    /**
     * Limit how many GeneratedImages to delete.
     */
    limit?: number
  }

  /**
   * GeneratedImage.likes
   */
  export type GeneratedImage$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    where?: ImageLikeWhereInput
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    cursor?: ImageLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageLikeScalarFieldEnum | ImageLikeScalarFieldEnum[]
  }

  /**
   * GeneratedImage.comments
   */
  export type GeneratedImage$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    where?: ImageCommentWhereInput
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    cursor?: ImageCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * GeneratedImage.categories
   */
  export type GeneratedImage$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * GeneratedImage.notifications
   */
  export type GeneratedImage$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * GeneratedImage without action
   */
  export type GeneratedImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
  }


  /**
   * Model ImageLike
   */

  export type AggregateImageLike = {
    _count: ImageLikeCountAggregateOutputType | null
    _avg: ImageLikeAvgAggregateOutputType | null
    _sum: ImageLikeSumAggregateOutputType | null
    _min: ImageLikeMinAggregateOutputType | null
    _max: ImageLikeMaxAggregateOutputType | null
  }

  export type ImageLikeAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
  }

  export type ImageLikeSumAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
  }

  export type ImageLikeMinAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    createdAt: Date | null
  }

  export type ImageLikeMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    createdAt: Date | null
  }

  export type ImageLikeCountAggregateOutputType = {
    id: number
    userId: number
    imageId: number
    createdAt: number
    _all: number
  }


  export type ImageLikeAvgAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
  }

  export type ImageLikeSumAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
  }

  export type ImageLikeMinAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    createdAt?: true
  }

  export type ImageLikeMaxAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    createdAt?: true
  }

  export type ImageLikeCountAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    createdAt?: true
    _all?: true
  }

  export type ImageLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageLike to aggregate.
     */
    where?: ImageLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageLikes to fetch.
     */
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageLikes
    **/
    _count?: true | ImageLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageLikeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageLikeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageLikeMaxAggregateInputType
  }

  export type GetImageLikeAggregateType<T extends ImageLikeAggregateArgs> = {
        [P in keyof T & keyof AggregateImageLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageLike[P]>
      : GetScalarType<T[P], AggregateImageLike[P]>
  }




  export type ImageLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageLikeWhereInput
    orderBy?: ImageLikeOrderByWithAggregationInput | ImageLikeOrderByWithAggregationInput[]
    by: ImageLikeScalarFieldEnum[] | ImageLikeScalarFieldEnum
    having?: ImageLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageLikeCountAggregateInputType | true
    _avg?: ImageLikeAvgAggregateInputType
    _sum?: ImageLikeSumAggregateInputType
    _min?: ImageLikeMinAggregateInputType
    _max?: ImageLikeMaxAggregateInputType
  }

  export type ImageLikeGroupByOutputType = {
    id: number
    userId: number
    imageId: number
    createdAt: Date
    _count: ImageLikeCountAggregateOutputType | null
    _avg: ImageLikeAvgAggregateOutputType | null
    _sum: ImageLikeSumAggregateOutputType | null
    _min: ImageLikeMinAggregateOutputType | null
    _max: ImageLikeMaxAggregateOutputType | null
  }

  type GetImageLikeGroupByPayload<T extends ImageLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageLikeGroupByOutputType[P]>
            : GetScalarType<T[P], ImageLikeGroupByOutputType[P]>
        }
      >
    >


  export type ImageLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    imageId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | GeneratedImageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageLike"]>



  export type ImageLikeSelectScalar = {
    id?: boolean
    userId?: boolean
    imageId?: boolean
    createdAt?: boolean
  }

  export type ImageLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "imageId" | "createdAt", ExtArgs["result"]["imageLike"]>
  export type ImageLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | GeneratedImageDefaultArgs<ExtArgs>
  }

  export type $ImageLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageLike"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      image: Prisma.$GeneratedImagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      imageId: number
      createdAt: Date
    }, ExtArgs["result"]["imageLike"]>
    composites: {}
  }

  type ImageLikeGetPayload<S extends boolean | null | undefined | ImageLikeDefaultArgs> = $Result.GetResult<Prisma.$ImageLikePayload, S>

  type ImageLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageLikeCountAggregateInputType | true
    }

  export interface ImageLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageLike'], meta: { name: 'ImageLike' } }
    /**
     * Find zero or one ImageLike that matches the filter.
     * @param {ImageLikeFindUniqueArgs} args - Arguments to find a ImageLike
     * @example
     * // Get one ImageLike
     * const imageLike = await prisma.imageLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageLikeFindUniqueArgs>(args: SelectSubset<T, ImageLikeFindUniqueArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageLikeFindUniqueOrThrowArgs} args - Arguments to find a ImageLike
     * @example
     * // Get one ImageLike
     * const imageLike = await prisma.imageLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeFindFirstArgs} args - Arguments to find a ImageLike
     * @example
     * // Get one ImageLike
     * const imageLike = await prisma.imageLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageLikeFindFirstArgs>(args?: SelectSubset<T, ImageLikeFindFirstArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeFindFirstOrThrowArgs} args - Arguments to find a ImageLike
     * @example
     * // Get one ImageLike
     * const imageLike = await prisma.imageLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageLikes
     * const imageLikes = await prisma.imageLike.findMany()
     * 
     * // Get first 10 ImageLikes
     * const imageLikes = await prisma.imageLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageLikeWithIdOnly = await prisma.imageLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageLikeFindManyArgs>(args?: SelectSubset<T, ImageLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageLike.
     * @param {ImageLikeCreateArgs} args - Arguments to create a ImageLike.
     * @example
     * // Create one ImageLike
     * const ImageLike = await prisma.imageLike.create({
     *   data: {
     *     // ... data to create a ImageLike
     *   }
     * })
     * 
     */
    create<T extends ImageLikeCreateArgs>(args: SelectSubset<T, ImageLikeCreateArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageLikes.
     * @param {ImageLikeCreateManyArgs} args - Arguments to create many ImageLikes.
     * @example
     * // Create many ImageLikes
     * const imageLike = await prisma.imageLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageLikeCreateManyArgs>(args?: SelectSubset<T, ImageLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ImageLike.
     * @param {ImageLikeDeleteArgs} args - Arguments to delete one ImageLike.
     * @example
     * // Delete one ImageLike
     * const ImageLike = await prisma.imageLike.delete({
     *   where: {
     *     // ... filter to delete one ImageLike
     *   }
     * })
     * 
     */
    delete<T extends ImageLikeDeleteArgs>(args: SelectSubset<T, ImageLikeDeleteArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageLike.
     * @param {ImageLikeUpdateArgs} args - Arguments to update one ImageLike.
     * @example
     * // Update one ImageLike
     * const imageLike = await prisma.imageLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageLikeUpdateArgs>(args: SelectSubset<T, ImageLikeUpdateArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageLikes.
     * @param {ImageLikeDeleteManyArgs} args - Arguments to filter ImageLikes to delete.
     * @example
     * // Delete a few ImageLikes
     * const { count } = await prisma.imageLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageLikeDeleteManyArgs>(args?: SelectSubset<T, ImageLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageLikes
     * const imageLike = await prisma.imageLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageLikeUpdateManyArgs>(args: SelectSubset<T, ImageLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImageLike.
     * @param {ImageLikeUpsertArgs} args - Arguments to update or create a ImageLike.
     * @example
     * // Update or create a ImageLike
     * const imageLike = await prisma.imageLike.upsert({
     *   create: {
     *     // ... data to create a ImageLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageLike we want to update
     *   }
     * })
     */
    upsert<T extends ImageLikeUpsertArgs>(args: SelectSubset<T, ImageLikeUpsertArgs<ExtArgs>>): Prisma__ImageLikeClient<$Result.GetResult<Prisma.$ImageLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeCountArgs} args - Arguments to filter ImageLikes to count.
     * @example
     * // Count the number of ImageLikes
     * const count = await prisma.imageLike.count({
     *   where: {
     *     // ... the filter for the ImageLikes we want to count
     *   }
     * })
    **/
    count<T extends ImageLikeCountArgs>(
      args?: Subset<T, ImageLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageLikeAggregateArgs>(args: Subset<T, ImageLikeAggregateArgs>): Prisma.PrismaPromise<GetImageLikeAggregateType<T>>

    /**
     * Group by ImageLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageLikeGroupByArgs} args - Group by arguments.
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
      T extends ImageLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageLikeGroupByArgs['orderBy'] }
        : { orderBy?: ImageLikeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageLike model
   */
  readonly fields: ImageLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    image<T extends GeneratedImageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImageDefaultArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ImageLike model
   */
  interface ImageLikeFieldRefs {
    readonly id: FieldRef<"ImageLike", 'Int'>
    readonly userId: FieldRef<"ImageLike", 'Int'>
    readonly imageId: FieldRef<"ImageLike", 'Int'>
    readonly createdAt: FieldRef<"ImageLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageLike findUnique
   */
  export type ImageLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter, which ImageLike to fetch.
     */
    where: ImageLikeWhereUniqueInput
  }

  /**
   * ImageLike findUniqueOrThrow
   */
  export type ImageLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter, which ImageLike to fetch.
     */
    where: ImageLikeWhereUniqueInput
  }

  /**
   * ImageLike findFirst
   */
  export type ImageLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter, which ImageLike to fetch.
     */
    where?: ImageLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageLikes to fetch.
     */
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageLikes.
     */
    cursor?: ImageLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageLikes.
     */
    distinct?: ImageLikeScalarFieldEnum | ImageLikeScalarFieldEnum[]
  }

  /**
   * ImageLike findFirstOrThrow
   */
  export type ImageLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter, which ImageLike to fetch.
     */
    where?: ImageLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageLikes to fetch.
     */
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageLikes.
     */
    cursor?: ImageLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageLikes.
     */
    distinct?: ImageLikeScalarFieldEnum | ImageLikeScalarFieldEnum[]
  }

  /**
   * ImageLike findMany
   */
  export type ImageLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter, which ImageLikes to fetch.
     */
    where?: ImageLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageLikes to fetch.
     */
    orderBy?: ImageLikeOrderByWithRelationInput | ImageLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageLikes.
     */
    cursor?: ImageLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageLikes.
     */
    skip?: number
    distinct?: ImageLikeScalarFieldEnum | ImageLikeScalarFieldEnum[]
  }

  /**
   * ImageLike create
   */
  export type ImageLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageLike.
     */
    data: XOR<ImageLikeCreateInput, ImageLikeUncheckedCreateInput>
  }

  /**
   * ImageLike createMany
   */
  export type ImageLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageLikes.
     */
    data: ImageLikeCreateManyInput | ImageLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageLike update
   */
  export type ImageLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageLike.
     */
    data: XOR<ImageLikeUpdateInput, ImageLikeUncheckedUpdateInput>
    /**
     * Choose, which ImageLike to update.
     */
    where: ImageLikeWhereUniqueInput
  }

  /**
   * ImageLike updateMany
   */
  export type ImageLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageLikes.
     */
    data: XOR<ImageLikeUpdateManyMutationInput, ImageLikeUncheckedUpdateManyInput>
    /**
     * Filter which ImageLikes to update
     */
    where?: ImageLikeWhereInput
    /**
     * Limit how many ImageLikes to update.
     */
    limit?: number
  }

  /**
   * ImageLike upsert
   */
  export type ImageLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageLike to update in case it exists.
     */
    where: ImageLikeWhereUniqueInput
    /**
     * In case the ImageLike found by the `where` argument doesn't exist, create a new ImageLike with this data.
     */
    create: XOR<ImageLikeCreateInput, ImageLikeUncheckedCreateInput>
    /**
     * In case the ImageLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageLikeUpdateInput, ImageLikeUncheckedUpdateInput>
  }

  /**
   * ImageLike delete
   */
  export type ImageLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
    /**
     * Filter which ImageLike to delete.
     */
    where: ImageLikeWhereUniqueInput
  }

  /**
   * ImageLike deleteMany
   */
  export type ImageLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageLikes to delete
     */
    where?: ImageLikeWhereInput
    /**
     * Limit how many ImageLikes to delete.
     */
    limit?: number
  }

  /**
   * ImageLike without action
   */
  export type ImageLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageLike
     */
    select?: ImageLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageLike
     */
    omit?: ImageLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageLikeInclude<ExtArgs> | null
  }


  /**
   * Model ImageComment
   */

  export type AggregateImageComment = {
    _count: ImageCommentCountAggregateOutputType | null
    _avg: ImageCommentAvgAggregateOutputType | null
    _sum: ImageCommentSumAggregateOutputType | null
    _min: ImageCommentMinAggregateOutputType | null
    _max: ImageCommentMaxAggregateOutputType | null
  }

  export type ImageCommentAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    parentId: number | null
  }

  export type ImageCommentSumAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    parentId: number | null
  }

  export type ImageCommentMinAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    content: string | null
    parentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageCommentMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    imageId: number | null
    content: string | null
    parentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageCommentCountAggregateOutputType = {
    id: number
    userId: number
    imageId: number
    content: number
    parentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImageCommentAvgAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    parentId?: true
  }

  export type ImageCommentSumAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    parentId?: true
  }

  export type ImageCommentMinAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageCommentMaxAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageCommentCountAggregateInputType = {
    id?: true
    userId?: true
    imageId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImageCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageComment to aggregate.
     */
    where?: ImageCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageComments to fetch.
     */
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageComments
    **/
    _count?: true | ImageCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageCommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageCommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageCommentMaxAggregateInputType
  }

  export type GetImageCommentAggregateType<T extends ImageCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateImageComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageComment[P]>
      : GetScalarType<T[P], AggregateImageComment[P]>
  }




  export type ImageCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageCommentWhereInput
    orderBy?: ImageCommentOrderByWithAggregationInput | ImageCommentOrderByWithAggregationInput[]
    by: ImageCommentScalarFieldEnum[] | ImageCommentScalarFieldEnum
    having?: ImageCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageCommentCountAggregateInputType | true
    _avg?: ImageCommentAvgAggregateInputType
    _sum?: ImageCommentSumAggregateInputType
    _min?: ImageCommentMinAggregateInputType
    _max?: ImageCommentMaxAggregateInputType
  }

  export type ImageCommentGroupByOutputType = {
    id: number
    userId: number
    imageId: number
    content: string
    parentId: number | null
    createdAt: Date
    updatedAt: Date
    _count: ImageCommentCountAggregateOutputType | null
    _avg: ImageCommentAvgAggregateOutputType | null
    _sum: ImageCommentSumAggregateOutputType | null
    _min: ImageCommentMinAggregateOutputType | null
    _max: ImageCommentMaxAggregateOutputType | null
  }

  type GetImageCommentGroupByPayload<T extends ImageCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageCommentGroupByOutputType[P]>
            : GetScalarType<T[P], ImageCommentGroupByOutputType[P]>
        }
      >
    >


  export type ImageCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    imageId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | GeneratedImageDefaultArgs<ExtArgs>
    parent?: boolean | ImageComment$parentArgs<ExtArgs>
    replies?: boolean | ImageComment$repliesArgs<ExtArgs>
    notifications?: boolean | ImageComment$notificationsArgs<ExtArgs>
    _count?: boolean | ImageCommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageComment"]>



  export type ImageCommentSelectScalar = {
    id?: boolean
    userId?: boolean
    imageId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImageCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "imageId" | "content" | "parentId" | "createdAt" | "updatedAt", ExtArgs["result"]["imageComment"]>
  export type ImageCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | GeneratedImageDefaultArgs<ExtArgs>
    parent?: boolean | ImageComment$parentArgs<ExtArgs>
    replies?: boolean | ImageComment$repliesArgs<ExtArgs>
    notifications?: boolean | ImageComment$notificationsArgs<ExtArgs>
    _count?: boolean | ImageCommentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ImageCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageComment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      image: Prisma.$GeneratedImagePayload<ExtArgs>
      parent: Prisma.$ImageCommentPayload<ExtArgs> | null
      replies: Prisma.$ImageCommentPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      imageId: number
      content: string
      parentId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["imageComment"]>
    composites: {}
  }

  type ImageCommentGetPayload<S extends boolean | null | undefined | ImageCommentDefaultArgs> = $Result.GetResult<Prisma.$ImageCommentPayload, S>

  type ImageCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageCommentCountAggregateInputType | true
    }

  export interface ImageCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageComment'], meta: { name: 'ImageComment' } }
    /**
     * Find zero or one ImageComment that matches the filter.
     * @param {ImageCommentFindUniqueArgs} args - Arguments to find a ImageComment
     * @example
     * // Get one ImageComment
     * const imageComment = await prisma.imageComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageCommentFindUniqueArgs>(args: SelectSubset<T, ImageCommentFindUniqueArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageCommentFindUniqueOrThrowArgs} args - Arguments to find a ImageComment
     * @example
     * // Get one ImageComment
     * const imageComment = await prisma.imageComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentFindFirstArgs} args - Arguments to find a ImageComment
     * @example
     * // Get one ImageComment
     * const imageComment = await prisma.imageComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageCommentFindFirstArgs>(args?: SelectSubset<T, ImageCommentFindFirstArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentFindFirstOrThrowArgs} args - Arguments to find a ImageComment
     * @example
     * // Get one ImageComment
     * const imageComment = await prisma.imageComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageComments
     * const imageComments = await prisma.imageComment.findMany()
     * 
     * // Get first 10 ImageComments
     * const imageComments = await prisma.imageComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageCommentWithIdOnly = await prisma.imageComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageCommentFindManyArgs>(args?: SelectSubset<T, ImageCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageComment.
     * @param {ImageCommentCreateArgs} args - Arguments to create a ImageComment.
     * @example
     * // Create one ImageComment
     * const ImageComment = await prisma.imageComment.create({
     *   data: {
     *     // ... data to create a ImageComment
     *   }
     * })
     * 
     */
    create<T extends ImageCommentCreateArgs>(args: SelectSubset<T, ImageCommentCreateArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageComments.
     * @param {ImageCommentCreateManyArgs} args - Arguments to create many ImageComments.
     * @example
     * // Create many ImageComments
     * const imageComment = await prisma.imageComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageCommentCreateManyArgs>(args?: SelectSubset<T, ImageCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ImageComment.
     * @param {ImageCommentDeleteArgs} args - Arguments to delete one ImageComment.
     * @example
     * // Delete one ImageComment
     * const ImageComment = await prisma.imageComment.delete({
     *   where: {
     *     // ... filter to delete one ImageComment
     *   }
     * })
     * 
     */
    delete<T extends ImageCommentDeleteArgs>(args: SelectSubset<T, ImageCommentDeleteArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageComment.
     * @param {ImageCommentUpdateArgs} args - Arguments to update one ImageComment.
     * @example
     * // Update one ImageComment
     * const imageComment = await prisma.imageComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageCommentUpdateArgs>(args: SelectSubset<T, ImageCommentUpdateArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageComments.
     * @param {ImageCommentDeleteManyArgs} args - Arguments to filter ImageComments to delete.
     * @example
     * // Delete a few ImageComments
     * const { count } = await prisma.imageComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageCommentDeleteManyArgs>(args?: SelectSubset<T, ImageCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageComments
     * const imageComment = await prisma.imageComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageCommentUpdateManyArgs>(args: SelectSubset<T, ImageCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImageComment.
     * @param {ImageCommentUpsertArgs} args - Arguments to update or create a ImageComment.
     * @example
     * // Update or create a ImageComment
     * const imageComment = await prisma.imageComment.upsert({
     *   create: {
     *     // ... data to create a ImageComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageComment we want to update
     *   }
     * })
     */
    upsert<T extends ImageCommentUpsertArgs>(args: SelectSubset<T, ImageCommentUpsertArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentCountArgs} args - Arguments to filter ImageComments to count.
     * @example
     * // Count the number of ImageComments
     * const count = await prisma.imageComment.count({
     *   where: {
     *     // ... the filter for the ImageComments we want to count
     *   }
     * })
    **/
    count<T extends ImageCommentCountArgs>(
      args?: Subset<T, ImageCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageCommentAggregateArgs>(args: Subset<T, ImageCommentAggregateArgs>): Prisma.PrismaPromise<GetImageCommentAggregateType<T>>

    /**
     * Group by ImageComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCommentGroupByArgs} args - Group by arguments.
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
      T extends ImageCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageCommentGroupByArgs['orderBy'] }
        : { orderBy?: ImageCommentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageComment model
   */
  readonly fields: ImageCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    image<T extends GeneratedImageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GeneratedImageDefaultArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends ImageComment$parentArgs<ExtArgs> = {}>(args?: Subset<T, ImageComment$parentArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends ImageComment$repliesArgs<ExtArgs> = {}>(args?: Subset<T, ImageComment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends ImageComment$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, ImageComment$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ImageComment model
   */
  interface ImageCommentFieldRefs {
    readonly id: FieldRef<"ImageComment", 'Int'>
    readonly userId: FieldRef<"ImageComment", 'Int'>
    readonly imageId: FieldRef<"ImageComment", 'Int'>
    readonly content: FieldRef<"ImageComment", 'String'>
    readonly parentId: FieldRef<"ImageComment", 'Int'>
    readonly createdAt: FieldRef<"ImageComment", 'DateTime'>
    readonly updatedAt: FieldRef<"ImageComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageComment findUnique
   */
  export type ImageCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter, which ImageComment to fetch.
     */
    where: ImageCommentWhereUniqueInput
  }

  /**
   * ImageComment findUniqueOrThrow
   */
  export type ImageCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter, which ImageComment to fetch.
     */
    where: ImageCommentWhereUniqueInput
  }

  /**
   * ImageComment findFirst
   */
  export type ImageCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter, which ImageComment to fetch.
     */
    where?: ImageCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageComments to fetch.
     */
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageComments.
     */
    cursor?: ImageCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageComments.
     */
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * ImageComment findFirstOrThrow
   */
  export type ImageCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter, which ImageComment to fetch.
     */
    where?: ImageCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageComments to fetch.
     */
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageComments.
     */
    cursor?: ImageCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageComments.
     */
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * ImageComment findMany
   */
  export type ImageCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter, which ImageComments to fetch.
     */
    where?: ImageCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageComments to fetch.
     */
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageComments.
     */
    cursor?: ImageCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageComments.
     */
    skip?: number
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * ImageComment create
   */
  export type ImageCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageComment.
     */
    data: XOR<ImageCommentCreateInput, ImageCommentUncheckedCreateInput>
  }

  /**
   * ImageComment createMany
   */
  export type ImageCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageComments.
     */
    data: ImageCommentCreateManyInput | ImageCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageComment update
   */
  export type ImageCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageComment.
     */
    data: XOR<ImageCommentUpdateInput, ImageCommentUncheckedUpdateInput>
    /**
     * Choose, which ImageComment to update.
     */
    where: ImageCommentWhereUniqueInput
  }

  /**
   * ImageComment updateMany
   */
  export type ImageCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageComments.
     */
    data: XOR<ImageCommentUpdateManyMutationInput, ImageCommentUncheckedUpdateManyInput>
    /**
     * Filter which ImageComments to update
     */
    where?: ImageCommentWhereInput
    /**
     * Limit how many ImageComments to update.
     */
    limit?: number
  }

  /**
   * ImageComment upsert
   */
  export type ImageCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageComment to update in case it exists.
     */
    where: ImageCommentWhereUniqueInput
    /**
     * In case the ImageComment found by the `where` argument doesn't exist, create a new ImageComment with this data.
     */
    create: XOR<ImageCommentCreateInput, ImageCommentUncheckedCreateInput>
    /**
     * In case the ImageComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageCommentUpdateInput, ImageCommentUncheckedUpdateInput>
  }

  /**
   * ImageComment delete
   */
  export type ImageCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    /**
     * Filter which ImageComment to delete.
     */
    where: ImageCommentWhereUniqueInput
  }

  /**
   * ImageComment deleteMany
   */
  export type ImageCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageComments to delete
     */
    where?: ImageCommentWhereInput
    /**
     * Limit how many ImageComments to delete.
     */
    limit?: number
  }

  /**
   * ImageComment.parent
   */
  export type ImageComment$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    where?: ImageCommentWhereInput
  }

  /**
   * ImageComment.replies
   */
  export type ImageComment$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    where?: ImageCommentWhereInput
    orderBy?: ImageCommentOrderByWithRelationInput | ImageCommentOrderByWithRelationInput[]
    cursor?: ImageCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageCommentScalarFieldEnum | ImageCommentScalarFieldEnum[]
  }

  /**
   * ImageComment.notifications
   */
  export type ImageComment$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * ImageComment without action
   */
  export type ImageCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
  }


  /**
   * Model CreditSettings
   */

  export type AggregateCreditSettings = {
    _count: CreditSettingsCountAggregateOutputType | null
    _avg: CreditSettingsAvgAggregateOutputType | null
    _sum: CreditSettingsSumAggregateOutputType | null
    _min: CreditSettingsMinAggregateOutputType | null
    _max: CreditSettingsMaxAggregateOutputType | null
  }

  export type CreditSettingsAvgAggregateOutputType = {
    id: number | null
    dallE3: number | null
    stableDiffusionXl: number | null
    googleImagen: number | null
    nanoBanana: number | null
    zImage: number | null
  }

  export type CreditSettingsSumAggregateOutputType = {
    id: number | null
    dallE3: number | null
    stableDiffusionXl: number | null
    googleImagen: number | null
    nanoBanana: number | null
    zImage: number | null
  }

  export type CreditSettingsMinAggregateOutputType = {
    id: number | null
    dallE3: number | null
    stableDiffusionXl: number | null
    googleImagen: number | null
    nanoBanana: number | null
    zImage: number | null
    updatedAt: Date | null
  }

  export type CreditSettingsMaxAggregateOutputType = {
    id: number | null
    dallE3: number | null
    stableDiffusionXl: number | null
    googleImagen: number | null
    nanoBanana: number | null
    zImage: number | null
    updatedAt: Date | null
  }

  export type CreditSettingsCountAggregateOutputType = {
    id: number
    dallE3: number
    stableDiffusionXl: number
    googleImagen: number
    nanoBanana: number
    zImage: number
    updatedAt: number
    _all: number
  }


  export type CreditSettingsAvgAggregateInputType = {
    id?: true
    dallE3?: true
    stableDiffusionXl?: true
    googleImagen?: true
    nanoBanana?: true
    zImage?: true
  }

  export type CreditSettingsSumAggregateInputType = {
    id?: true
    dallE3?: true
    stableDiffusionXl?: true
    googleImagen?: true
    nanoBanana?: true
    zImage?: true
  }

  export type CreditSettingsMinAggregateInputType = {
    id?: true
    dallE3?: true
    stableDiffusionXl?: true
    googleImagen?: true
    nanoBanana?: true
    zImage?: true
    updatedAt?: true
  }

  export type CreditSettingsMaxAggregateInputType = {
    id?: true
    dallE3?: true
    stableDiffusionXl?: true
    googleImagen?: true
    nanoBanana?: true
    zImage?: true
    updatedAt?: true
  }

  export type CreditSettingsCountAggregateInputType = {
    id?: true
    dallE3?: true
    stableDiffusionXl?: true
    googleImagen?: true
    nanoBanana?: true
    zImage?: true
    updatedAt?: true
    _all?: true
  }

  export type CreditSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreditSettings to aggregate.
     */
    where?: CreditSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreditSettings to fetch.
     */
    orderBy?: CreditSettingsOrderByWithRelationInput | CreditSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CreditSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreditSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreditSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CreditSettings
    **/
    _count?: true | CreditSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CreditSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CreditSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CreditSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CreditSettingsMaxAggregateInputType
  }

  export type GetCreditSettingsAggregateType<T extends CreditSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateCreditSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCreditSettings[P]>
      : GetScalarType<T[P], AggregateCreditSettings[P]>
  }




  export type CreditSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CreditSettingsWhereInput
    orderBy?: CreditSettingsOrderByWithAggregationInput | CreditSettingsOrderByWithAggregationInput[]
    by: CreditSettingsScalarFieldEnum[] | CreditSettingsScalarFieldEnum
    having?: CreditSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CreditSettingsCountAggregateInputType | true
    _avg?: CreditSettingsAvgAggregateInputType
    _sum?: CreditSettingsSumAggregateInputType
    _min?: CreditSettingsMinAggregateInputType
    _max?: CreditSettingsMaxAggregateInputType
  }

  export type CreditSettingsGroupByOutputType = {
    id: number
    dallE3: number
    stableDiffusionXl: number
    googleImagen: number
    nanoBanana: number
    zImage: number
    updatedAt: Date
    _count: CreditSettingsCountAggregateOutputType | null
    _avg: CreditSettingsAvgAggregateOutputType | null
    _sum: CreditSettingsSumAggregateOutputType | null
    _min: CreditSettingsMinAggregateOutputType | null
    _max: CreditSettingsMaxAggregateOutputType | null
  }

  type GetCreditSettingsGroupByPayload<T extends CreditSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CreditSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CreditSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CreditSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], CreditSettingsGroupByOutputType[P]>
        }
      >
    >


  export type CreditSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dallE3?: boolean
    stableDiffusionXl?: boolean
    googleImagen?: boolean
    nanoBanana?: boolean
    zImage?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["creditSettings"]>



  export type CreditSettingsSelectScalar = {
    id?: boolean
    dallE3?: boolean
    stableDiffusionXl?: boolean
    googleImagen?: boolean
    nanoBanana?: boolean
    zImage?: boolean
    updatedAt?: boolean
  }

  export type CreditSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dallE3" | "stableDiffusionXl" | "googleImagen" | "nanoBanana" | "zImage" | "updatedAt", ExtArgs["result"]["creditSettings"]>

  export type $CreditSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CreditSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      dallE3: number
      stableDiffusionXl: number
      googleImagen: number
      nanoBanana: number
      zImage: number
      updatedAt: Date
    }, ExtArgs["result"]["creditSettings"]>
    composites: {}
  }

  type CreditSettingsGetPayload<S extends boolean | null | undefined | CreditSettingsDefaultArgs> = $Result.GetResult<Prisma.$CreditSettingsPayload, S>

  type CreditSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CreditSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CreditSettingsCountAggregateInputType | true
    }

  export interface CreditSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CreditSettings'], meta: { name: 'CreditSettings' } }
    /**
     * Find zero or one CreditSettings that matches the filter.
     * @param {CreditSettingsFindUniqueArgs} args - Arguments to find a CreditSettings
     * @example
     * // Get one CreditSettings
     * const creditSettings = await prisma.creditSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CreditSettingsFindUniqueArgs>(args: SelectSubset<T, CreditSettingsFindUniqueArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CreditSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CreditSettingsFindUniqueOrThrowArgs} args - Arguments to find a CreditSettings
     * @example
     * // Get one CreditSettings
     * const creditSettings = await prisma.creditSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CreditSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, CreditSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreditSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsFindFirstArgs} args - Arguments to find a CreditSettings
     * @example
     * // Get one CreditSettings
     * const creditSettings = await prisma.creditSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CreditSettingsFindFirstArgs>(args?: SelectSubset<T, CreditSettingsFindFirstArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CreditSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsFindFirstOrThrowArgs} args - Arguments to find a CreditSettings
     * @example
     * // Get one CreditSettings
     * const creditSettings = await prisma.creditSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CreditSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, CreditSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CreditSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CreditSettings
     * const creditSettings = await prisma.creditSettings.findMany()
     * 
     * // Get first 10 CreditSettings
     * const creditSettings = await prisma.creditSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const creditSettingsWithIdOnly = await prisma.creditSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CreditSettingsFindManyArgs>(args?: SelectSubset<T, CreditSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CreditSettings.
     * @param {CreditSettingsCreateArgs} args - Arguments to create a CreditSettings.
     * @example
     * // Create one CreditSettings
     * const CreditSettings = await prisma.creditSettings.create({
     *   data: {
     *     // ... data to create a CreditSettings
     *   }
     * })
     * 
     */
    create<T extends CreditSettingsCreateArgs>(args: SelectSubset<T, CreditSettingsCreateArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CreditSettings.
     * @param {CreditSettingsCreateManyArgs} args - Arguments to create many CreditSettings.
     * @example
     * // Create many CreditSettings
     * const creditSettings = await prisma.creditSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CreditSettingsCreateManyArgs>(args?: SelectSubset<T, CreditSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CreditSettings.
     * @param {CreditSettingsDeleteArgs} args - Arguments to delete one CreditSettings.
     * @example
     * // Delete one CreditSettings
     * const CreditSettings = await prisma.creditSettings.delete({
     *   where: {
     *     // ... filter to delete one CreditSettings
     *   }
     * })
     * 
     */
    delete<T extends CreditSettingsDeleteArgs>(args: SelectSubset<T, CreditSettingsDeleteArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CreditSettings.
     * @param {CreditSettingsUpdateArgs} args - Arguments to update one CreditSettings.
     * @example
     * // Update one CreditSettings
     * const creditSettings = await prisma.creditSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CreditSettingsUpdateArgs>(args: SelectSubset<T, CreditSettingsUpdateArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CreditSettings.
     * @param {CreditSettingsDeleteManyArgs} args - Arguments to filter CreditSettings to delete.
     * @example
     * // Delete a few CreditSettings
     * const { count } = await prisma.creditSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CreditSettingsDeleteManyArgs>(args?: SelectSubset<T, CreditSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CreditSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CreditSettings
     * const creditSettings = await prisma.creditSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CreditSettingsUpdateManyArgs>(args: SelectSubset<T, CreditSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CreditSettings.
     * @param {CreditSettingsUpsertArgs} args - Arguments to update or create a CreditSettings.
     * @example
     * // Update or create a CreditSettings
     * const creditSettings = await prisma.creditSettings.upsert({
     *   create: {
     *     // ... data to create a CreditSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CreditSettings we want to update
     *   }
     * })
     */
    upsert<T extends CreditSettingsUpsertArgs>(args: SelectSubset<T, CreditSettingsUpsertArgs<ExtArgs>>): Prisma__CreditSettingsClient<$Result.GetResult<Prisma.$CreditSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CreditSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsCountArgs} args - Arguments to filter CreditSettings to count.
     * @example
     * // Count the number of CreditSettings
     * const count = await prisma.creditSettings.count({
     *   where: {
     *     // ... the filter for the CreditSettings we want to count
     *   }
     * })
    **/
    count<T extends CreditSettingsCountArgs>(
      args?: Subset<T, CreditSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CreditSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CreditSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CreditSettingsAggregateArgs>(args: Subset<T, CreditSettingsAggregateArgs>): Prisma.PrismaPromise<GetCreditSettingsAggregateType<T>>

    /**
     * Group by CreditSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CreditSettingsGroupByArgs} args - Group by arguments.
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
      T extends CreditSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CreditSettingsGroupByArgs['orderBy'] }
        : { orderBy?: CreditSettingsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CreditSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCreditSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CreditSettings model
   */
  readonly fields: CreditSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CreditSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CreditSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CreditSettings model
   */
  interface CreditSettingsFieldRefs {
    readonly id: FieldRef<"CreditSettings", 'Int'>
    readonly dallE3: FieldRef<"CreditSettings", 'Int'>
    readonly stableDiffusionXl: FieldRef<"CreditSettings", 'Int'>
    readonly googleImagen: FieldRef<"CreditSettings", 'Int'>
    readonly nanoBanana: FieldRef<"CreditSettings", 'Int'>
    readonly zImage: FieldRef<"CreditSettings", 'Int'>
    readonly updatedAt: FieldRef<"CreditSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CreditSettings findUnique
   */
  export type CreditSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter, which CreditSettings to fetch.
     */
    where: CreditSettingsWhereUniqueInput
  }

  /**
   * CreditSettings findUniqueOrThrow
   */
  export type CreditSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter, which CreditSettings to fetch.
     */
    where: CreditSettingsWhereUniqueInput
  }

  /**
   * CreditSettings findFirst
   */
  export type CreditSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter, which CreditSettings to fetch.
     */
    where?: CreditSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreditSettings to fetch.
     */
    orderBy?: CreditSettingsOrderByWithRelationInput | CreditSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreditSettings.
     */
    cursor?: CreditSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreditSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreditSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreditSettings.
     */
    distinct?: CreditSettingsScalarFieldEnum | CreditSettingsScalarFieldEnum[]
  }

  /**
   * CreditSettings findFirstOrThrow
   */
  export type CreditSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter, which CreditSettings to fetch.
     */
    where?: CreditSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreditSettings to fetch.
     */
    orderBy?: CreditSettingsOrderByWithRelationInput | CreditSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CreditSettings.
     */
    cursor?: CreditSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreditSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreditSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CreditSettings.
     */
    distinct?: CreditSettingsScalarFieldEnum | CreditSettingsScalarFieldEnum[]
  }

  /**
   * CreditSettings findMany
   */
  export type CreditSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter, which CreditSettings to fetch.
     */
    where?: CreditSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CreditSettings to fetch.
     */
    orderBy?: CreditSettingsOrderByWithRelationInput | CreditSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CreditSettings.
     */
    cursor?: CreditSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CreditSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CreditSettings.
     */
    skip?: number
    distinct?: CreditSettingsScalarFieldEnum | CreditSettingsScalarFieldEnum[]
  }

  /**
   * CreditSettings create
   */
  export type CreditSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a CreditSettings.
     */
    data: XOR<CreditSettingsCreateInput, CreditSettingsUncheckedCreateInput>
  }

  /**
   * CreditSettings createMany
   */
  export type CreditSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CreditSettings.
     */
    data: CreditSettingsCreateManyInput | CreditSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CreditSettings update
   */
  export type CreditSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a CreditSettings.
     */
    data: XOR<CreditSettingsUpdateInput, CreditSettingsUncheckedUpdateInput>
    /**
     * Choose, which CreditSettings to update.
     */
    where: CreditSettingsWhereUniqueInput
  }

  /**
   * CreditSettings updateMany
   */
  export type CreditSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CreditSettings.
     */
    data: XOR<CreditSettingsUpdateManyMutationInput, CreditSettingsUncheckedUpdateManyInput>
    /**
     * Filter which CreditSettings to update
     */
    where?: CreditSettingsWhereInput
    /**
     * Limit how many CreditSettings to update.
     */
    limit?: number
  }

  /**
   * CreditSettings upsert
   */
  export type CreditSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the CreditSettings to update in case it exists.
     */
    where: CreditSettingsWhereUniqueInput
    /**
     * In case the CreditSettings found by the `where` argument doesn't exist, create a new CreditSettings with this data.
     */
    create: XOR<CreditSettingsCreateInput, CreditSettingsUncheckedCreateInput>
    /**
     * In case the CreditSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CreditSettingsUpdateInput, CreditSettingsUncheckedUpdateInput>
  }

  /**
   * CreditSettings delete
   */
  export type CreditSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
    /**
     * Filter which CreditSettings to delete.
     */
    where: CreditSettingsWhereUniqueInput
  }

  /**
   * CreditSettings deleteMany
   */
  export type CreditSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CreditSettings to delete
     */
    where?: CreditSettingsWhereInput
    /**
     * Limit how many CreditSettings to delete.
     */
    limit?: number
  }

  /**
   * CreditSettings without action
   */
  export type CreditSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CreditSettings
     */
    select?: CreditSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CreditSettings
     */
    omit?: CreditSettingsOmit<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    images?: boolean | Category$imagesArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>



  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | Category$imagesArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      images: Prisma.$GeneratedImagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
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
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    images<T extends Category$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Category$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.images
   */
  export type Category$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    where?: GeneratedImageWhereInput
    orderBy?: GeneratedImageOrderByWithRelationInput | GeneratedImageOrderByWithRelationInput[]
    cursor?: GeneratedImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GeneratedImageScalarFieldEnum | GeneratedImageScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    actorId: number | null
    imageId: number | null
    commentId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    userId: number | null
    actorId: number | null
    imageId: number | null
    commentId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    actorId: number | null
    type: $Enums.NotificationType | null
    message: string | null
    isRead: boolean | null
    imageId: number | null
    commentId: number | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    actorId: number | null
    type: $Enums.NotificationType | null
    message: string | null
    isRead: boolean | null
    imageId: number | null
    commentId: number | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    actorId: number
    type: number
    message: number
    isRead: number
    imageId: number
    commentId: number
    createdAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    userId?: true
    actorId?: true
    imageId?: true
    commentId?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    userId?: true
    actorId?: true
    imageId?: true
    commentId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    actorId?: true
    type?: true
    message?: true
    isRead?: true
    imageId?: true
    commentId?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    actorId?: true
    type?: true
    message?: true
    isRead?: true
    imageId?: true
    commentId?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    actorId?: true
    type?: true
    message?: true
    isRead?: true
    imageId?: true
    commentId?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message: string | null
    isRead: boolean
    imageId: number | null
    commentId: number | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    actorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    imageId?: boolean
    commentId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | Notification$imageArgs<ExtArgs>
    comment?: boolean | Notification$commentArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    actorId?: boolean
    type?: boolean
    message?: boolean
    isRead?: boolean
    imageId?: boolean
    commentId?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "actorId" | "type" | "message" | "isRead" | "imageId" | "commentId" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    actor?: boolean | UserDefaultArgs<ExtArgs>
    image?: boolean | Notification$imageArgs<ExtArgs>
    comment?: boolean | Notification$commentArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      actor: Prisma.$UserPayload<ExtArgs>
      image: Prisma.$GeneratedImagePayload<ExtArgs> | null
      comment: Prisma.$ImageCommentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      actorId: number
      type: $Enums.NotificationType
      message: string | null
      isRead: boolean
      imageId: number | null
      commentId: number | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    actor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    image<T extends Notification$imageArgs<ExtArgs> = {}>(args?: Subset<T, Notification$imageArgs<ExtArgs>>): Prisma__GeneratedImageClient<$Result.GetResult<Prisma.$GeneratedImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    comment<T extends Notification$commentArgs<ExtArgs> = {}>(args?: Subset<T, Notification$commentArgs<ExtArgs>>): Prisma__ImageCommentClient<$Result.GetResult<Prisma.$ImageCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly userId: FieldRef<"Notification", 'Int'>
    readonly actorId: FieldRef<"Notification", 'Int'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly imageId: FieldRef<"Notification", 'Int'>
    readonly commentId: FieldRef<"Notification", 'Int'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.image
   */
  export type Notification$imageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedImage
     */
    select?: GeneratedImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedImage
     */
    omit?: GeneratedImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedImageInclude<ExtArgs> | null
    where?: GeneratedImageWhereInput
  }

  /**
   * Notification.comment
   */
  export type Notification$commentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageComment
     */
    select?: ImageCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageComment
     */
    omit?: ImageCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageCommentInclude<ExtArgs> | null
    where?: ImageCommentWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    nickname: 'nickname',
    credits: 'credits',
    role: 'role',
    provider: 'provider',
    kakaoId: 'kakaoId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    profileImageUrl: 'profileImageUrl'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LoginAttemptScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    failedAt: 'failedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoginAttemptScalarFieldEnum = (typeof LoginAttemptScalarFieldEnum)[keyof typeof LoginAttemptScalarFieldEnum]


  export const GeneratedImageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    prompt: 'prompt',
    translatedPrompt: 'translatedPrompt',
    imageUrl: 'imageUrl',
    model: 'model',
    size: 'size',
    editData: 'editData',
    editedImageUrl: 'editedImageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GeneratedImageScalarFieldEnum = (typeof GeneratedImageScalarFieldEnum)[keyof typeof GeneratedImageScalarFieldEnum]


  export const ImageLikeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    imageId: 'imageId',
    createdAt: 'createdAt'
  };

  export type ImageLikeScalarFieldEnum = (typeof ImageLikeScalarFieldEnum)[keyof typeof ImageLikeScalarFieldEnum]


  export const ImageCommentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    imageId: 'imageId',
    content: 'content',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImageCommentScalarFieldEnum = (typeof ImageCommentScalarFieldEnum)[keyof typeof ImageCommentScalarFieldEnum]


  export const CreditSettingsScalarFieldEnum: {
    id: 'id',
    dallE3: 'dallE3',
    stableDiffusionXl: 'stableDiffusionXl',
    googleImagen: 'googleImagen',
    nanoBanana: 'nanoBanana',
    zImage: 'zImage',
    updatedAt: 'updatedAt'
  };

  export type CreditSettingsScalarFieldEnum = (typeof CreditSettingsScalarFieldEnum)[keyof typeof CreditSettingsScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    actorId: 'actorId',
    type: 'type',
    message: 'message',
    isRead: 'isRead',
    imageId: 'imageId',
    commentId: 'commentId',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    email: 'email',
    password: 'password',
    nickname: 'nickname',
    kakaoId: 'kakaoId',
    profileImageUrl: 'profileImageUrl'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const LoginAttemptOrderByRelevanceFieldEnum: {
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type LoginAttemptOrderByRelevanceFieldEnum = (typeof LoginAttemptOrderByRelevanceFieldEnum)[keyof typeof LoginAttemptOrderByRelevanceFieldEnum]


  export const GeneratedImageOrderByRelevanceFieldEnum: {
    prompt: 'prompt',
    translatedPrompt: 'translatedPrompt',
    imageUrl: 'imageUrl',
    model: 'model',
    size: 'size',
    editData: 'editData',
    editedImageUrl: 'editedImageUrl'
  };

  export type GeneratedImageOrderByRelevanceFieldEnum = (typeof GeneratedImageOrderByRelevanceFieldEnum)[keyof typeof GeneratedImageOrderByRelevanceFieldEnum]


  export const ImageCommentOrderByRelevanceFieldEnum: {
    content: 'content'
  };

  export type ImageCommentOrderByRelevanceFieldEnum = (typeof ImageCommentOrderByRelevanceFieldEnum)[keyof typeof ImageCommentOrderByRelevanceFieldEnum]


  export const CategoryOrderByRelevanceFieldEnum: {
    name: 'name',
    slug: 'slug'
  };

  export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    message: 'message'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'AuthProvider'
   */
  export type EnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    nickname?: StringFilter<"User"> | string
    credits?: IntFilter<"User"> | number
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    provider?: EnumAuthProviderFilter<"User"> | $Enums.AuthProvider
    kakaoId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    loginAttempts?: LoginAttemptListRelationFilter
    generatedImages?: GeneratedImageListRelationFilter
    imageLikes?: ImageLikeListRelationFilter
    imageComments?: ImageCommentListRelationFilter
    notifications?: NotificationListRelationFilter
    triggeredNotifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    nickname?: SortOrder
    credits?: SortOrder
    role?: SortOrder
    provider?: SortOrder
    kakaoId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    loginAttempts?: LoginAttemptOrderByRelationAggregateInput
    generatedImages?: GeneratedImageOrderByRelationAggregateInput
    imageLikes?: ImageLikeOrderByRelationAggregateInput
    imageComments?: ImageCommentOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    triggeredNotifications?: NotificationOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    nickname?: string
    kakaoId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    credits?: IntFilter<"User"> | number
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    provider?: EnumAuthProviderFilter<"User"> | $Enums.AuthProvider
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    loginAttempts?: LoginAttemptListRelationFilter
    generatedImages?: GeneratedImageListRelationFilter
    imageLikes?: ImageLikeListRelationFilter
    imageComments?: ImageCommentListRelationFilter
    notifications?: NotificationListRelationFilter
    triggeredNotifications?: NotificationListRelationFilter
  }, "id" | "email" | "nickname" | "kakaoId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    nickname?: SortOrder
    credits?: SortOrder
    role?: SortOrder
    provider?: SortOrder
    kakaoId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    nickname?: StringWithAggregatesFilter<"User"> | string
    credits?: IntWithAggregatesFilter<"User"> | number
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    provider?: EnumAuthProviderWithAggregatesFilter<"User"> | $Enums.AuthProvider
    kakaoId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    profileImageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type LoginAttemptWhereInput = {
    AND?: LoginAttemptWhereInput | LoginAttemptWhereInput[]
    OR?: LoginAttemptWhereInput[]
    NOT?: LoginAttemptWhereInput | LoginAttemptWhereInput[]
    id?: IntFilter<"LoginAttempt"> | number
    userId?: IntFilter<"LoginAttempt"> | number
    failedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    ipAddress?: StringNullableFilter<"LoginAttempt"> | string | null
    userAgent?: StringNullableFilter<"LoginAttempt"> | string | null
    createdAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LoginAttemptOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    failedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: LoginAttemptOrderByRelevanceInput
  }

  export type LoginAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LoginAttemptWhereInput | LoginAttemptWhereInput[]
    OR?: LoginAttemptWhereInput[]
    NOT?: LoginAttemptWhereInput | LoginAttemptWhereInput[]
    userId?: IntFilter<"LoginAttempt"> | number
    failedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    ipAddress?: StringNullableFilter<"LoginAttempt"> | string | null
    userAgent?: StringNullableFilter<"LoginAttempt"> | string | null
    createdAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type LoginAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    failedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoginAttemptCountOrderByAggregateInput
    _avg?: LoginAttemptAvgOrderByAggregateInput
    _max?: LoginAttemptMaxOrderByAggregateInput
    _min?: LoginAttemptMinOrderByAggregateInput
    _sum?: LoginAttemptSumOrderByAggregateInput
  }

  export type LoginAttemptScalarWhereWithAggregatesInput = {
    AND?: LoginAttemptScalarWhereWithAggregatesInput | LoginAttemptScalarWhereWithAggregatesInput[]
    OR?: LoginAttemptScalarWhereWithAggregatesInput[]
    NOT?: LoginAttemptScalarWhereWithAggregatesInput | LoginAttemptScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LoginAttempt"> | number
    userId?: IntWithAggregatesFilter<"LoginAttempt"> | number
    failedAt?: DateTimeWithAggregatesFilter<"LoginAttempt"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"LoginAttempt"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"LoginAttempt"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LoginAttempt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LoginAttempt"> | Date | string
  }

  export type GeneratedImageWhereInput = {
    AND?: GeneratedImageWhereInput | GeneratedImageWhereInput[]
    OR?: GeneratedImageWhereInput[]
    NOT?: GeneratedImageWhereInput | GeneratedImageWhereInput[]
    id?: IntFilter<"GeneratedImage"> | number
    userId?: IntFilter<"GeneratedImage"> | number
    prompt?: StringFilter<"GeneratedImage"> | string
    translatedPrompt?: StringNullableFilter<"GeneratedImage"> | string | null
    imageUrl?: StringFilter<"GeneratedImage"> | string
    model?: StringFilter<"GeneratedImage"> | string
    size?: StringFilter<"GeneratedImage"> | string
    editData?: StringNullableFilter<"GeneratedImage"> | string | null
    editedImageUrl?: StringNullableFilter<"GeneratedImage"> | string | null
    createdAt?: DateTimeFilter<"GeneratedImage"> | Date | string
    updatedAt?: DateTimeFilter<"GeneratedImage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    likes?: ImageLikeListRelationFilter
    comments?: ImageCommentListRelationFilter
    categories?: CategoryListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type GeneratedImageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    prompt?: SortOrder
    translatedPrompt?: SortOrderInput | SortOrder
    imageUrl?: SortOrder
    model?: SortOrder
    size?: SortOrder
    editData?: SortOrderInput | SortOrder
    editedImageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    likes?: ImageLikeOrderByRelationAggregateInput
    comments?: ImageCommentOrderByRelationAggregateInput
    categories?: CategoryOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    _relevance?: GeneratedImageOrderByRelevanceInput
  }

  export type GeneratedImageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GeneratedImageWhereInput | GeneratedImageWhereInput[]
    OR?: GeneratedImageWhereInput[]
    NOT?: GeneratedImageWhereInput | GeneratedImageWhereInput[]
    userId?: IntFilter<"GeneratedImage"> | number
    prompt?: StringFilter<"GeneratedImage"> | string
    translatedPrompt?: StringNullableFilter<"GeneratedImage"> | string | null
    imageUrl?: StringFilter<"GeneratedImage"> | string
    model?: StringFilter<"GeneratedImage"> | string
    size?: StringFilter<"GeneratedImage"> | string
    editData?: StringNullableFilter<"GeneratedImage"> | string | null
    editedImageUrl?: StringNullableFilter<"GeneratedImage"> | string | null
    createdAt?: DateTimeFilter<"GeneratedImage"> | Date | string
    updatedAt?: DateTimeFilter<"GeneratedImage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    likes?: ImageLikeListRelationFilter
    comments?: ImageCommentListRelationFilter
    categories?: CategoryListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id">

  export type GeneratedImageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    prompt?: SortOrder
    translatedPrompt?: SortOrderInput | SortOrder
    imageUrl?: SortOrder
    model?: SortOrder
    size?: SortOrder
    editData?: SortOrderInput | SortOrder
    editedImageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GeneratedImageCountOrderByAggregateInput
    _avg?: GeneratedImageAvgOrderByAggregateInput
    _max?: GeneratedImageMaxOrderByAggregateInput
    _min?: GeneratedImageMinOrderByAggregateInput
    _sum?: GeneratedImageSumOrderByAggregateInput
  }

  export type GeneratedImageScalarWhereWithAggregatesInput = {
    AND?: GeneratedImageScalarWhereWithAggregatesInput | GeneratedImageScalarWhereWithAggregatesInput[]
    OR?: GeneratedImageScalarWhereWithAggregatesInput[]
    NOT?: GeneratedImageScalarWhereWithAggregatesInput | GeneratedImageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GeneratedImage"> | number
    userId?: IntWithAggregatesFilter<"GeneratedImage"> | number
    prompt?: StringWithAggregatesFilter<"GeneratedImage"> | string
    translatedPrompt?: StringNullableWithAggregatesFilter<"GeneratedImage"> | string | null
    imageUrl?: StringWithAggregatesFilter<"GeneratedImage"> | string
    model?: StringWithAggregatesFilter<"GeneratedImage"> | string
    size?: StringWithAggregatesFilter<"GeneratedImage"> | string
    editData?: StringNullableWithAggregatesFilter<"GeneratedImage"> | string | null
    editedImageUrl?: StringNullableWithAggregatesFilter<"GeneratedImage"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GeneratedImage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GeneratedImage"> | Date | string
  }

  export type ImageLikeWhereInput = {
    AND?: ImageLikeWhereInput | ImageLikeWhereInput[]
    OR?: ImageLikeWhereInput[]
    NOT?: ImageLikeWhereInput | ImageLikeWhereInput[]
    id?: IntFilter<"ImageLike"> | number
    userId?: IntFilter<"ImageLike"> | number
    imageId?: IntFilter<"ImageLike"> | number
    createdAt?: DateTimeFilter<"ImageLike"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageScalarRelationFilter, GeneratedImageWhereInput>
  }

  export type ImageLikeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    image?: GeneratedImageOrderByWithRelationInput
  }

  export type ImageLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_imageId?: ImageLikeUserIdImageIdCompoundUniqueInput
    AND?: ImageLikeWhereInput | ImageLikeWhereInput[]
    OR?: ImageLikeWhereInput[]
    NOT?: ImageLikeWhereInput | ImageLikeWhereInput[]
    userId?: IntFilter<"ImageLike"> | number
    imageId?: IntFilter<"ImageLike"> | number
    createdAt?: DateTimeFilter<"ImageLike"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageScalarRelationFilter, GeneratedImageWhereInput>
  }, "id" | "userId_imageId">

  export type ImageLikeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    createdAt?: SortOrder
    _count?: ImageLikeCountOrderByAggregateInput
    _avg?: ImageLikeAvgOrderByAggregateInput
    _max?: ImageLikeMaxOrderByAggregateInput
    _min?: ImageLikeMinOrderByAggregateInput
    _sum?: ImageLikeSumOrderByAggregateInput
  }

  export type ImageLikeScalarWhereWithAggregatesInput = {
    AND?: ImageLikeScalarWhereWithAggregatesInput | ImageLikeScalarWhereWithAggregatesInput[]
    OR?: ImageLikeScalarWhereWithAggregatesInput[]
    NOT?: ImageLikeScalarWhereWithAggregatesInput | ImageLikeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ImageLike"> | number
    userId?: IntWithAggregatesFilter<"ImageLike"> | number
    imageId?: IntWithAggregatesFilter<"ImageLike"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ImageLike"> | Date | string
  }

  export type ImageCommentWhereInput = {
    AND?: ImageCommentWhereInput | ImageCommentWhereInput[]
    OR?: ImageCommentWhereInput[]
    NOT?: ImageCommentWhereInput | ImageCommentWhereInput[]
    id?: IntFilter<"ImageComment"> | number
    userId?: IntFilter<"ImageComment"> | number
    imageId?: IntFilter<"ImageComment"> | number
    content?: StringFilter<"ImageComment"> | string
    parentId?: IntNullableFilter<"ImageComment"> | number | null
    createdAt?: DateTimeFilter<"ImageComment"> | Date | string
    updatedAt?: DateTimeFilter<"ImageComment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageScalarRelationFilter, GeneratedImageWhereInput>
    parent?: XOR<ImageCommentNullableScalarRelationFilter, ImageCommentWhereInput> | null
    replies?: ImageCommentListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type ImageCommentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    content?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    image?: GeneratedImageOrderByWithRelationInput
    parent?: ImageCommentOrderByWithRelationInput
    replies?: ImageCommentOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    _relevance?: ImageCommentOrderByRelevanceInput
  }

  export type ImageCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ImageCommentWhereInput | ImageCommentWhereInput[]
    OR?: ImageCommentWhereInput[]
    NOT?: ImageCommentWhereInput | ImageCommentWhereInput[]
    userId?: IntFilter<"ImageComment"> | number
    imageId?: IntFilter<"ImageComment"> | number
    content?: StringFilter<"ImageComment"> | string
    parentId?: IntNullableFilter<"ImageComment"> | number | null
    createdAt?: DateTimeFilter<"ImageComment"> | Date | string
    updatedAt?: DateTimeFilter<"ImageComment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageScalarRelationFilter, GeneratedImageWhereInput>
    parent?: XOR<ImageCommentNullableScalarRelationFilter, ImageCommentWhereInput> | null
    replies?: ImageCommentListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id">

  export type ImageCommentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    content?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImageCommentCountOrderByAggregateInput
    _avg?: ImageCommentAvgOrderByAggregateInput
    _max?: ImageCommentMaxOrderByAggregateInput
    _min?: ImageCommentMinOrderByAggregateInput
    _sum?: ImageCommentSumOrderByAggregateInput
  }

  export type ImageCommentScalarWhereWithAggregatesInput = {
    AND?: ImageCommentScalarWhereWithAggregatesInput | ImageCommentScalarWhereWithAggregatesInput[]
    OR?: ImageCommentScalarWhereWithAggregatesInput[]
    NOT?: ImageCommentScalarWhereWithAggregatesInput | ImageCommentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ImageComment"> | number
    userId?: IntWithAggregatesFilter<"ImageComment"> | number
    imageId?: IntWithAggregatesFilter<"ImageComment"> | number
    content?: StringWithAggregatesFilter<"ImageComment"> | string
    parentId?: IntNullableWithAggregatesFilter<"ImageComment"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ImageComment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImageComment"> | Date | string
  }

  export type CreditSettingsWhereInput = {
    AND?: CreditSettingsWhereInput | CreditSettingsWhereInput[]
    OR?: CreditSettingsWhereInput[]
    NOT?: CreditSettingsWhereInput | CreditSettingsWhereInput[]
    id?: IntFilter<"CreditSettings"> | number
    dallE3?: IntFilter<"CreditSettings"> | number
    stableDiffusionXl?: IntFilter<"CreditSettings"> | number
    googleImagen?: IntFilter<"CreditSettings"> | number
    nanoBanana?: IntFilter<"CreditSettings"> | number
    zImage?: IntFilter<"CreditSettings"> | number
    updatedAt?: DateTimeFilter<"CreditSettings"> | Date | string
  }

  export type CreditSettingsOrderByWithRelationInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
    updatedAt?: SortOrder
  }

  export type CreditSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CreditSettingsWhereInput | CreditSettingsWhereInput[]
    OR?: CreditSettingsWhereInput[]
    NOT?: CreditSettingsWhereInput | CreditSettingsWhereInput[]
    dallE3?: IntFilter<"CreditSettings"> | number
    stableDiffusionXl?: IntFilter<"CreditSettings"> | number
    googleImagen?: IntFilter<"CreditSettings"> | number
    nanoBanana?: IntFilter<"CreditSettings"> | number
    zImage?: IntFilter<"CreditSettings"> | number
    updatedAt?: DateTimeFilter<"CreditSettings"> | Date | string
  }, "id">

  export type CreditSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
    updatedAt?: SortOrder
    _count?: CreditSettingsCountOrderByAggregateInput
    _avg?: CreditSettingsAvgOrderByAggregateInput
    _max?: CreditSettingsMaxOrderByAggregateInput
    _min?: CreditSettingsMinOrderByAggregateInput
    _sum?: CreditSettingsSumOrderByAggregateInput
  }

  export type CreditSettingsScalarWhereWithAggregatesInput = {
    AND?: CreditSettingsScalarWhereWithAggregatesInput | CreditSettingsScalarWhereWithAggregatesInput[]
    OR?: CreditSettingsScalarWhereWithAggregatesInput[]
    NOT?: CreditSettingsScalarWhereWithAggregatesInput | CreditSettingsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CreditSettings"> | number
    dallE3?: IntWithAggregatesFilter<"CreditSettings"> | number
    stableDiffusionXl?: IntWithAggregatesFilter<"CreditSettings"> | number
    googleImagen?: IntWithAggregatesFilter<"CreditSettings"> | number
    nanoBanana?: IntWithAggregatesFilter<"CreditSettings"> | number
    zImage?: IntWithAggregatesFilter<"CreditSettings"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"CreditSettings"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    images?: GeneratedImageListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    images?: GeneratedImageOrderByRelationAggregateInput
    _relevance?: CategoryOrderByRelevanceInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    images?: GeneratedImageListRelationFilter
  }, "id" | "name" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    actorId?: IntFilter<"Notification"> | number
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    message?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    imageId?: IntNullableFilter<"Notification"> | number | null
    commentId?: IntNullableFilter<"Notification"> | number | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    actor?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageNullableScalarRelationFilter, GeneratedImageWhereInput> | null
    comment?: XOR<ImageCommentNullableScalarRelationFilter, ImageCommentWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    message?: SortOrderInput | SortOrder
    isRead?: SortOrder
    imageId?: SortOrderInput | SortOrder
    commentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    actor?: UserOrderByWithRelationInput
    image?: GeneratedImageOrderByWithRelationInput
    comment?: ImageCommentOrderByWithRelationInput
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: IntFilter<"Notification"> | number
    actorId?: IntFilter<"Notification"> | number
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    message?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    imageId?: IntNullableFilter<"Notification"> | number | null
    commentId?: IntNullableFilter<"Notification"> | number | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    actor?: XOR<UserScalarRelationFilter, UserWhereInput>
    image?: XOR<GeneratedImageNullableScalarRelationFilter, GeneratedImageWhereInput> | null
    comment?: XOR<ImageCommentNullableScalarRelationFilter, ImageCommentWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    message?: SortOrderInput | SortOrder
    isRead?: SortOrder
    imageId?: SortOrderInput | SortOrder
    commentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    userId?: IntWithAggregatesFilter<"Notification"> | number
    actorId?: IntWithAggregatesFilter<"Notification"> | number
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    message?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    imageId?: IntNullableWithAggregatesFilter<"Notification"> | number | null
    commentId?: IntNullableWithAggregatesFilter<"Notification"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoginAttemptCreateInput = {
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLoginAttemptsInput
  }

  export type LoginAttemptUncheckedCreateInput = {
    id?: number
    userId: number
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoginAttemptUpdateInput = {
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoginAttemptsNestedInput
  }

  export type LoginAttemptUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptCreateManyInput = {
    id?: number
    userId: number
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoginAttemptUpdateManyMutationInput = {
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedImageCreateInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedImagesInput
    likes?: ImageLikeCreateNestedManyWithoutImageInput
    comments?: ImageCommentCreateNestedManyWithoutImageInput
    categories?: CategoryCreateNestedManyWithoutImagesInput
    notifications?: NotificationCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUncheckedCreateInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeUncheckedCreateNestedManyWithoutImageInput
    comments?: ImageCommentUncheckedCreateNestedManyWithoutImageInput
    categories?: CategoryUncheckedCreateNestedManyWithoutImagesInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUpdateInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedImagesNestedInput
    likes?: ImageLikeUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUpdateManyWithoutImageNestedInput
    categories?: CategoryUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUncheckedUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUncheckedUpdateManyWithoutImageNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageCreateManyInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GeneratedImageUpdateManyMutationInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedImageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeCreateInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutImageLikesInput
    image: GeneratedImageCreateNestedOneWithoutLikesInput
  }

  export type ImageLikeUncheckedCreateInput = {
    id?: number
    userId: number
    imageId: number
    createdAt?: Date | string
  }

  export type ImageLikeUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageLikesNestedInput
    image?: GeneratedImageUpdateOneRequiredWithoutLikesNestedInput
  }

  export type ImageLikeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeCreateManyInput = {
    id?: number
    userId: number
    imageId: number
    createdAt?: Date | string
  }

  export type ImageLikeUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCommentCreateInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutImageCommentsInput
    image: GeneratedImageCreateNestedOneWithoutCommentsInput
    parent?: ImageCommentCreateNestedOneWithoutRepliesInput
    replies?: ImageCommentCreateNestedManyWithoutParentInput
    notifications?: NotificationCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUncheckedCreateInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ImageCommentUncheckedCreateNestedManyWithoutParentInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageCommentsNestedInput
    image?: GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ImageCommentUpdateOneWithoutRepliesNestedInput
    replies?: ImageCommentUpdateManyWithoutParentNestedInput
    notifications?: NotificationUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ImageCommentUncheckedUpdateManyWithoutParentNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentCreateManyInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageCommentUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCommentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CreditSettingsCreateInput = {
    id?: number
    dallE3?: number
    stableDiffusionXl?: number
    googleImagen?: number
    nanoBanana?: number
    zImage?: number
    updatedAt?: Date | string
  }

  export type CreditSettingsUncheckedCreateInput = {
    id?: number
    dallE3?: number
    stableDiffusionXl?: number
    googleImagen?: number
    nanoBanana?: number
    zImage?: number
    updatedAt?: Date | string
  }

  export type CreditSettingsUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    dallE3?: IntFieldUpdateOperationsInput | number
    stableDiffusionXl?: IntFieldUpdateOperationsInput | number
    googleImagen?: IntFieldUpdateOperationsInput | number
    nanoBanana?: IntFieldUpdateOperationsInput | number
    zImage?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CreditSettingsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    dallE3?: IntFieldUpdateOperationsInput | number
    stableDiffusionXl?: IntFieldUpdateOperationsInput | number
    googleImagen?: IntFieldUpdateOperationsInput | number
    nanoBanana?: IntFieldUpdateOperationsInput | number
    zImage?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CreditSettingsCreateManyInput = {
    id?: number
    dallE3?: number
    stableDiffusionXl?: number
    googleImagen?: number
    nanoBanana?: number
    zImage?: number
    updatedAt?: Date | string
  }

  export type CreditSettingsUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    dallE3?: IntFieldUpdateOperationsInput | number
    stableDiffusionXl?: IntFieldUpdateOperationsInput | number
    googleImagen?: IntFieldUpdateOperationsInput | number
    nanoBanana?: IntFieldUpdateOperationsInput | number
    zImage?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CreditSettingsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    dallE3?: IntFieldUpdateOperationsInput | number
    stableDiffusionXl?: IntFieldUpdateOperationsInput | number
    googleImagen?: IntFieldUpdateOperationsInput | number
    nanoBanana?: IntFieldUpdateOperationsInput | number
    zImage?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: GeneratedImageCreateNestedManyWithoutCategoriesInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: GeneratedImageUncheckedCreateNestedManyWithoutCategoriesInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: GeneratedImageUpdateManyWithoutCategoriesNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: GeneratedImageUncheckedUpdateManyWithoutCategoriesNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput
    image?: GeneratedImageCreateNestedOneWithoutNotificationsInput
    comment?: ImageCommentCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput
    image?: GeneratedImageUpdateOneWithoutNotificationsNestedInput
    comment?: ImageCommentUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type EnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[]
    notIn?: $Enums.AuthProvider[]
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LoginAttemptListRelationFilter = {
    every?: LoginAttemptWhereInput
    some?: LoginAttemptWhereInput
    none?: LoginAttemptWhereInput
  }

  export type GeneratedImageListRelationFilter = {
    every?: GeneratedImageWhereInput
    some?: GeneratedImageWhereInput
    none?: GeneratedImageWhereInput
  }

  export type ImageLikeListRelationFilter = {
    every?: ImageLikeWhereInput
    some?: ImageLikeWhereInput
    none?: ImageLikeWhereInput
  }

  export type ImageCommentListRelationFilter = {
    every?: ImageCommentWhereInput
    some?: ImageCommentWhereInput
    none?: ImageCommentWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LoginAttemptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GeneratedImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImageLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImageCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    credits?: SortOrder
    role?: SortOrder
    provider?: SortOrder
    kakaoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileImageUrl?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    credits?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    credits?: SortOrder
    role?: SortOrder
    provider?: SortOrder
    kakaoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileImageUrl?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nickname?: SortOrder
    credits?: SortOrder
    role?: SortOrder
    provider?: SortOrder
    kakaoId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileImageUrl?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    credits?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[]
    notIn?: $Enums.AuthProvider[]
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LoginAttemptOrderByRelevanceInput = {
    fields: LoginAttemptOrderByRelevanceFieldEnum | LoginAttemptOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LoginAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    failedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoginAttemptAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type LoginAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    failedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoginAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    failedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoginAttemptSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GeneratedImageOrderByRelevanceInput = {
    fields: GeneratedImageOrderByRelevanceFieldEnum | GeneratedImageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GeneratedImageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    prompt?: SortOrder
    translatedPrompt?: SortOrder
    imageUrl?: SortOrder
    model?: SortOrder
    size?: SortOrder
    editData?: SortOrder
    editedImageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GeneratedImageAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type GeneratedImageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    prompt?: SortOrder
    translatedPrompt?: SortOrder
    imageUrl?: SortOrder
    model?: SortOrder
    size?: SortOrder
    editData?: SortOrder
    editedImageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GeneratedImageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    prompt?: SortOrder
    translatedPrompt?: SortOrder
    imageUrl?: SortOrder
    model?: SortOrder
    size?: SortOrder
    editData?: SortOrder
    editedImageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GeneratedImageSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type GeneratedImageScalarRelationFilter = {
    is?: GeneratedImageWhereInput
    isNot?: GeneratedImageWhereInput
  }

  export type ImageLikeUserIdImageIdCompoundUniqueInput = {
    userId: number
    imageId: number
  }

  export type ImageLikeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageLikeAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
  }

  export type ImageLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageLikeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageLikeSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ImageCommentNullableScalarRelationFilter = {
    is?: ImageCommentWhereInput | null
    isNot?: ImageCommentWhereInput | null
  }

  export type ImageCommentOrderByRelevanceInput = {
    fields: ImageCommentOrderByRelevanceFieldEnum | ImageCommentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ImageCommentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageCommentAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    parentId?: SortOrder
  }

  export type ImageCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageCommentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageCommentSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    imageId?: SortOrder
    parentId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CreditSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
    updatedAt?: SortOrder
  }

  export type CreditSettingsAvgOrderByAggregateInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
  }

  export type CreditSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
    updatedAt?: SortOrder
  }

  export type CreditSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
    updatedAt?: SortOrder
  }

  export type CreditSettingsSumOrderByAggregateInput = {
    id?: SortOrder
    dallE3?: SortOrder
    stableDiffusionXl?: SortOrder
    googleImagen?: SortOrder
    nanoBanana?: SortOrder
    zImage?: SortOrder
  }

  export type CategoryOrderByRelevanceInput = {
    fields: CategoryOrderByRelevanceFieldEnum | CategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type GeneratedImageNullableScalarRelationFilter = {
    is?: GeneratedImageWhereInput | null
    isNot?: GeneratedImageWhereInput | null
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    imageId?: SortOrder
    commentId?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    imageId?: SortOrder
    commentId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    imageId?: SortOrder
    commentId?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    imageId?: SortOrder
    commentId?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    actorId?: SortOrder
    imageId?: SortOrder
    commentId?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LoginAttemptCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput> | LoginAttemptCreateWithoutUserInput[] | LoginAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginAttemptCreateOrConnectWithoutUserInput | LoginAttemptCreateOrConnectWithoutUserInput[]
    createMany?: LoginAttemptCreateManyUserInputEnvelope
    connect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
  }

  export type GeneratedImageCreateNestedManyWithoutUserInput = {
    create?: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput> | GeneratedImageCreateWithoutUserInput[] | GeneratedImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutUserInput | GeneratedImageCreateOrConnectWithoutUserInput[]
    createMany?: GeneratedImageCreateManyUserInputEnvelope
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
  }

  export type ImageLikeCreateNestedManyWithoutUserInput = {
    create?: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput> | ImageLikeCreateWithoutUserInput[] | ImageLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutUserInput | ImageLikeCreateOrConnectWithoutUserInput[]
    createMany?: ImageLikeCreateManyUserInputEnvelope
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
  }

  export type ImageCommentCreateNestedManyWithoutUserInput = {
    create?: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput> | ImageCommentCreateWithoutUserInput[] | ImageCommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutUserInput | ImageCommentCreateOrConnectWithoutUserInput[]
    createMany?: ImageCommentCreateManyUserInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutActorInput = {
    create?: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput> | NotificationCreateWithoutActorInput[] | NotificationUncheckedCreateWithoutActorInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutActorInput | NotificationCreateOrConnectWithoutActorInput[]
    createMany?: NotificationCreateManyActorInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type LoginAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput> | LoginAttemptCreateWithoutUserInput[] | LoginAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginAttemptCreateOrConnectWithoutUserInput | LoginAttemptCreateOrConnectWithoutUserInput[]
    createMany?: LoginAttemptCreateManyUserInputEnvelope
    connect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
  }

  export type GeneratedImageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput> | GeneratedImageCreateWithoutUserInput[] | GeneratedImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutUserInput | GeneratedImageCreateOrConnectWithoutUserInput[]
    createMany?: GeneratedImageCreateManyUserInputEnvelope
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
  }

  export type ImageLikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput> | ImageLikeCreateWithoutUserInput[] | ImageLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutUserInput | ImageLikeCreateOrConnectWithoutUserInput[]
    createMany?: ImageLikeCreateManyUserInputEnvelope
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
  }

  export type ImageCommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput> | ImageCommentCreateWithoutUserInput[] | ImageCommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutUserInput | ImageCommentCreateOrConnectWithoutUserInput[]
    createMany?: ImageCommentCreateManyUserInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput> | NotificationCreateWithoutActorInput[] | NotificationUncheckedCreateWithoutActorInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutActorInput | NotificationCreateOrConnectWithoutActorInput[]
    createMany?: NotificationCreateManyActorInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type EnumAuthProviderFieldUpdateOperationsInput = {
    set?: $Enums.AuthProvider
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LoginAttemptUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput> | LoginAttemptCreateWithoutUserInput[] | LoginAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginAttemptCreateOrConnectWithoutUserInput | LoginAttemptCreateOrConnectWithoutUserInput[]
    upsert?: LoginAttemptUpsertWithWhereUniqueWithoutUserInput | LoginAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginAttemptCreateManyUserInputEnvelope
    set?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    disconnect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    delete?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    connect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    update?: LoginAttemptUpdateWithWhereUniqueWithoutUserInput | LoginAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginAttemptUpdateManyWithWhereWithoutUserInput | LoginAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginAttemptScalarWhereInput | LoginAttemptScalarWhereInput[]
  }

  export type GeneratedImageUpdateManyWithoutUserNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput> | GeneratedImageCreateWithoutUserInput[] | GeneratedImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutUserInput | GeneratedImageCreateOrConnectWithoutUserInput[]
    upsert?: GeneratedImageUpsertWithWhereUniqueWithoutUserInput | GeneratedImageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GeneratedImageCreateManyUserInputEnvelope
    set?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    disconnect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    delete?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    update?: GeneratedImageUpdateWithWhereUniqueWithoutUserInput | GeneratedImageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GeneratedImageUpdateManyWithWhereWithoutUserInput | GeneratedImageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
  }

  export type ImageLikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput> | ImageLikeCreateWithoutUserInput[] | ImageLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutUserInput | ImageLikeCreateOrConnectWithoutUserInput[]
    upsert?: ImageLikeUpsertWithWhereUniqueWithoutUserInput | ImageLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImageLikeCreateManyUserInputEnvelope
    set?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    disconnect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    delete?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    update?: ImageLikeUpdateWithWhereUniqueWithoutUserInput | ImageLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImageLikeUpdateManyWithWhereWithoutUserInput | ImageLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
  }

  export type ImageCommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput> | ImageCommentCreateWithoutUserInput[] | ImageCommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutUserInput | ImageCommentCreateOrConnectWithoutUserInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutUserInput | ImageCommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImageCommentCreateManyUserInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutUserInput | ImageCommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutUserInput | ImageCommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutActorNestedInput = {
    create?: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput> | NotificationCreateWithoutActorInput[] | NotificationUncheckedCreateWithoutActorInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutActorInput | NotificationCreateOrConnectWithoutActorInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutActorInput | NotificationUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: NotificationCreateManyActorInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutActorInput | NotificationUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutActorInput | NotificationUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type LoginAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput> | LoginAttemptCreateWithoutUserInput[] | LoginAttemptUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginAttemptCreateOrConnectWithoutUserInput | LoginAttemptCreateOrConnectWithoutUserInput[]
    upsert?: LoginAttemptUpsertWithWhereUniqueWithoutUserInput | LoginAttemptUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginAttemptCreateManyUserInputEnvelope
    set?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    disconnect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    delete?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    connect?: LoginAttemptWhereUniqueInput | LoginAttemptWhereUniqueInput[]
    update?: LoginAttemptUpdateWithWhereUniqueWithoutUserInput | LoginAttemptUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginAttemptUpdateManyWithWhereWithoutUserInput | LoginAttemptUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginAttemptScalarWhereInput | LoginAttemptScalarWhereInput[]
  }

  export type GeneratedImageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput> | GeneratedImageCreateWithoutUserInput[] | GeneratedImageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutUserInput | GeneratedImageCreateOrConnectWithoutUserInput[]
    upsert?: GeneratedImageUpsertWithWhereUniqueWithoutUserInput | GeneratedImageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GeneratedImageCreateManyUserInputEnvelope
    set?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    disconnect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    delete?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    update?: GeneratedImageUpdateWithWhereUniqueWithoutUserInput | GeneratedImageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GeneratedImageUpdateManyWithWhereWithoutUserInput | GeneratedImageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
  }

  export type ImageLikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput> | ImageLikeCreateWithoutUserInput[] | ImageLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutUserInput | ImageLikeCreateOrConnectWithoutUserInput[]
    upsert?: ImageLikeUpsertWithWhereUniqueWithoutUserInput | ImageLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImageLikeCreateManyUserInputEnvelope
    set?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    disconnect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    delete?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    update?: ImageLikeUpdateWithWhereUniqueWithoutUserInput | ImageLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImageLikeUpdateManyWithWhereWithoutUserInput | ImageLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
  }

  export type ImageCommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput> | ImageCommentCreateWithoutUserInput[] | ImageCommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutUserInput | ImageCommentCreateOrConnectWithoutUserInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutUserInput | ImageCommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ImageCommentCreateManyUserInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutUserInput | ImageCommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutUserInput | ImageCommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput> | NotificationCreateWithoutActorInput[] | NotificationUncheckedCreateWithoutActorInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutActorInput | NotificationCreateOrConnectWithoutActorInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutActorInput | NotificationUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: NotificationCreateManyActorInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutActorInput | NotificationUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutActorInput | NotificationUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLoginAttemptsInput = {
    create?: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginAttemptsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLoginAttemptsNestedInput = {
    create?: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginAttemptsInput
    upsert?: UserUpsertWithoutLoginAttemptsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLoginAttemptsInput, UserUpdateWithoutLoginAttemptsInput>, UserUncheckedUpdateWithoutLoginAttemptsInput>
  }

  export type UserCreateNestedOneWithoutGeneratedImagesInput = {
    create?: XOR<UserCreateWithoutGeneratedImagesInput, UserUncheckedCreateWithoutGeneratedImagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutGeneratedImagesInput
    connect?: UserWhereUniqueInput
  }

  export type ImageLikeCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput> | ImageLikeCreateWithoutImageInput[] | ImageLikeUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutImageInput | ImageLikeCreateOrConnectWithoutImageInput[]
    createMany?: ImageLikeCreateManyImageInputEnvelope
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
  }

  export type ImageCommentCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput> | ImageCommentCreateWithoutImageInput[] | ImageCommentUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutImageInput | ImageCommentCreateOrConnectWithoutImageInput[]
    createMany?: ImageCommentCreateManyImageInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type CategoryCreateNestedManyWithoutImagesInput = {
    create?: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput> | CategoryCreateWithoutImagesInput[] | CategoryUncheckedCreateWithoutImagesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutImagesInput | CategoryCreateOrConnectWithoutImagesInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutImageInput = {
    create?: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput> | NotificationCreateWithoutImageInput[] | NotificationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutImageInput | NotificationCreateOrConnectWithoutImageInput[]
    createMany?: NotificationCreateManyImageInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type ImageLikeUncheckedCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput> | ImageLikeCreateWithoutImageInput[] | ImageLikeUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutImageInput | ImageLikeCreateOrConnectWithoutImageInput[]
    createMany?: ImageLikeCreateManyImageInputEnvelope
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
  }

  export type ImageCommentUncheckedCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput> | ImageCommentCreateWithoutImageInput[] | ImageCommentUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutImageInput | ImageCommentCreateOrConnectWithoutImageInput[]
    createMany?: ImageCommentCreateManyImageInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutImagesInput = {
    create?: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput> | CategoryCreateWithoutImagesInput[] | CategoryUncheckedCreateWithoutImagesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutImagesInput | CategoryCreateOrConnectWithoutImagesInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutImageInput = {
    create?: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput> | NotificationCreateWithoutImageInput[] | NotificationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutImageInput | NotificationCreateOrConnectWithoutImageInput[]
    createMany?: NotificationCreateManyImageInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGeneratedImagesNestedInput = {
    create?: XOR<UserCreateWithoutGeneratedImagesInput, UserUncheckedCreateWithoutGeneratedImagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutGeneratedImagesInput
    upsert?: UserUpsertWithoutGeneratedImagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGeneratedImagesInput, UserUpdateWithoutGeneratedImagesInput>, UserUncheckedUpdateWithoutGeneratedImagesInput>
  }

  export type ImageLikeUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput> | ImageLikeCreateWithoutImageInput[] | ImageLikeUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutImageInput | ImageLikeCreateOrConnectWithoutImageInput[]
    upsert?: ImageLikeUpsertWithWhereUniqueWithoutImageInput | ImageLikeUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageLikeCreateManyImageInputEnvelope
    set?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    disconnect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    delete?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    update?: ImageLikeUpdateWithWhereUniqueWithoutImageInput | ImageLikeUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageLikeUpdateManyWithWhereWithoutImageInput | ImageLikeUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
  }

  export type ImageCommentUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput> | ImageCommentCreateWithoutImageInput[] | ImageCommentUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutImageInput | ImageCommentCreateOrConnectWithoutImageInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutImageInput | ImageCommentUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageCommentCreateManyImageInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutImageInput | ImageCommentUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutImageInput | ImageCommentUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type CategoryUpdateManyWithoutImagesNestedInput = {
    create?: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput> | CategoryCreateWithoutImagesInput[] | CategoryUncheckedCreateWithoutImagesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutImagesInput | CategoryCreateOrConnectWithoutImagesInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutImagesInput | CategoryUpsertWithWhereUniqueWithoutImagesInput[]
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutImagesInput | CategoryUpdateWithWhereUniqueWithoutImagesInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutImagesInput | CategoryUpdateManyWithWhereWithoutImagesInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutImageNestedInput = {
    create?: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput> | NotificationCreateWithoutImageInput[] | NotificationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutImageInput | NotificationCreateOrConnectWithoutImageInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutImageInput | NotificationUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: NotificationCreateManyImageInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutImageInput | NotificationUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutImageInput | NotificationUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ImageLikeUncheckedUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput> | ImageLikeCreateWithoutImageInput[] | ImageLikeUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageLikeCreateOrConnectWithoutImageInput | ImageLikeCreateOrConnectWithoutImageInput[]
    upsert?: ImageLikeUpsertWithWhereUniqueWithoutImageInput | ImageLikeUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageLikeCreateManyImageInputEnvelope
    set?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    disconnect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    delete?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    connect?: ImageLikeWhereUniqueInput | ImageLikeWhereUniqueInput[]
    update?: ImageLikeUpdateWithWhereUniqueWithoutImageInput | ImageLikeUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageLikeUpdateManyWithWhereWithoutImageInput | ImageLikeUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
  }

  export type ImageCommentUncheckedUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput> | ImageCommentCreateWithoutImageInput[] | ImageCommentUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutImageInput | ImageCommentCreateOrConnectWithoutImageInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutImageInput | ImageCommentUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageCommentCreateManyImageInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutImageInput | ImageCommentUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutImageInput | ImageCommentUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type CategoryUncheckedUpdateManyWithoutImagesNestedInput = {
    create?: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput> | CategoryCreateWithoutImagesInput[] | CategoryUncheckedCreateWithoutImagesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutImagesInput | CategoryCreateOrConnectWithoutImagesInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutImagesInput | CategoryUpsertWithWhereUniqueWithoutImagesInput[]
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutImagesInput | CategoryUpdateWithWhereUniqueWithoutImagesInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutImagesInput | CategoryUpdateManyWithWhereWithoutImagesInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutImageNestedInput = {
    create?: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput> | NotificationCreateWithoutImageInput[] | NotificationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutImageInput | NotificationCreateOrConnectWithoutImageInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutImageInput | NotificationUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: NotificationCreateManyImageInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutImageInput | NotificationUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutImageInput | NotificationUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutImageLikesInput = {
    create?: XOR<UserCreateWithoutImageLikesInput, UserUncheckedCreateWithoutImageLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutImageLikesInput
    connect?: UserWhereUniqueInput
  }

  export type GeneratedImageCreateNestedOneWithoutLikesInput = {
    create?: XOR<GeneratedImageCreateWithoutLikesInput, GeneratedImageUncheckedCreateWithoutLikesInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutLikesInput
    connect?: GeneratedImageWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutImageLikesNestedInput = {
    create?: XOR<UserCreateWithoutImageLikesInput, UserUncheckedCreateWithoutImageLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutImageLikesInput
    upsert?: UserUpsertWithoutImageLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutImageLikesInput, UserUpdateWithoutImageLikesInput>, UserUncheckedUpdateWithoutImageLikesInput>
  }

  export type GeneratedImageUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutLikesInput, GeneratedImageUncheckedCreateWithoutLikesInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutLikesInput
    upsert?: GeneratedImageUpsertWithoutLikesInput
    connect?: GeneratedImageWhereUniqueInput
    update?: XOR<XOR<GeneratedImageUpdateToOneWithWhereWithoutLikesInput, GeneratedImageUpdateWithoutLikesInput>, GeneratedImageUncheckedUpdateWithoutLikesInput>
  }

  export type UserCreateNestedOneWithoutImageCommentsInput = {
    create?: XOR<UserCreateWithoutImageCommentsInput, UserUncheckedCreateWithoutImageCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImageCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type GeneratedImageCreateNestedOneWithoutCommentsInput = {
    create?: XOR<GeneratedImageCreateWithoutCommentsInput, GeneratedImageUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCommentsInput
    connect?: GeneratedImageWhereUniqueInput
  }

  export type ImageCommentCreateNestedOneWithoutRepliesInput = {
    create?: XOR<ImageCommentCreateWithoutRepliesInput, ImageCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: ImageCommentCreateOrConnectWithoutRepliesInput
    connect?: ImageCommentWhereUniqueInput
  }

  export type ImageCommentCreateNestedManyWithoutParentInput = {
    create?: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput> | ImageCommentCreateWithoutParentInput[] | ImageCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutParentInput | ImageCommentCreateOrConnectWithoutParentInput[]
    createMany?: ImageCommentCreateManyParentInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutCommentInput = {
    create?: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput> | NotificationCreateWithoutCommentInput[] | NotificationUncheckedCreateWithoutCommentInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutCommentInput | NotificationCreateOrConnectWithoutCommentInput[]
    createMany?: NotificationCreateManyCommentInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type ImageCommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput> | ImageCommentCreateWithoutParentInput[] | ImageCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutParentInput | ImageCommentCreateOrConnectWithoutParentInput[]
    createMany?: ImageCommentCreateManyParentInputEnvelope
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutCommentInput = {
    create?: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput> | NotificationCreateWithoutCommentInput[] | NotificationUncheckedCreateWithoutCommentInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutCommentInput | NotificationCreateOrConnectWithoutCommentInput[]
    createMany?: NotificationCreateManyCommentInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutImageCommentsNestedInput = {
    create?: XOR<UserCreateWithoutImageCommentsInput, UserUncheckedCreateWithoutImageCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImageCommentsInput
    upsert?: UserUpsertWithoutImageCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutImageCommentsInput, UserUpdateWithoutImageCommentsInput>, UserUncheckedUpdateWithoutImageCommentsInput>
  }

  export type GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutCommentsInput, GeneratedImageUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCommentsInput
    upsert?: GeneratedImageUpsertWithoutCommentsInput
    connect?: GeneratedImageWhereUniqueInput
    update?: XOR<XOR<GeneratedImageUpdateToOneWithWhereWithoutCommentsInput, GeneratedImageUpdateWithoutCommentsInput>, GeneratedImageUncheckedUpdateWithoutCommentsInput>
  }

  export type ImageCommentUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<ImageCommentCreateWithoutRepliesInput, ImageCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: ImageCommentCreateOrConnectWithoutRepliesInput
    upsert?: ImageCommentUpsertWithoutRepliesInput
    disconnect?: ImageCommentWhereInput | boolean
    delete?: ImageCommentWhereInput | boolean
    connect?: ImageCommentWhereUniqueInput
    update?: XOR<XOR<ImageCommentUpdateToOneWithWhereWithoutRepliesInput, ImageCommentUpdateWithoutRepliesInput>, ImageCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type ImageCommentUpdateManyWithoutParentNestedInput = {
    create?: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput> | ImageCommentCreateWithoutParentInput[] | ImageCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutParentInput | ImageCommentCreateOrConnectWithoutParentInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutParentInput | ImageCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ImageCommentCreateManyParentInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutParentInput | ImageCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutParentInput | ImageCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutCommentNestedInput = {
    create?: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput> | NotificationCreateWithoutCommentInput[] | NotificationUncheckedCreateWithoutCommentInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutCommentInput | NotificationCreateOrConnectWithoutCommentInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutCommentInput | NotificationUpsertWithWhereUniqueWithoutCommentInput[]
    createMany?: NotificationCreateManyCommentInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutCommentInput | NotificationUpdateWithWhereUniqueWithoutCommentInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutCommentInput | NotificationUpdateManyWithWhereWithoutCommentInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ImageCommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput> | ImageCommentCreateWithoutParentInput[] | ImageCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ImageCommentCreateOrConnectWithoutParentInput | ImageCommentCreateOrConnectWithoutParentInput[]
    upsert?: ImageCommentUpsertWithWhereUniqueWithoutParentInput | ImageCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ImageCommentCreateManyParentInputEnvelope
    set?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    disconnect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    delete?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    connect?: ImageCommentWhereUniqueInput | ImageCommentWhereUniqueInput[]
    update?: ImageCommentUpdateWithWhereUniqueWithoutParentInput | ImageCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ImageCommentUpdateManyWithWhereWithoutParentInput | ImageCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutCommentNestedInput = {
    create?: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput> | NotificationCreateWithoutCommentInput[] | NotificationUncheckedCreateWithoutCommentInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutCommentInput | NotificationCreateOrConnectWithoutCommentInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutCommentInput | NotificationUpsertWithWhereUniqueWithoutCommentInput[]
    createMany?: NotificationCreateManyCommentInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutCommentInput | NotificationUpdateWithWhereUniqueWithoutCommentInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutCommentInput | NotificationUpdateManyWithWhereWithoutCommentInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type GeneratedImageCreateNestedManyWithoutCategoriesInput = {
    create?: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput> | GeneratedImageCreateWithoutCategoriesInput[] | GeneratedImageUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCategoriesInput | GeneratedImageCreateOrConnectWithoutCategoriesInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
  }

  export type GeneratedImageUncheckedCreateNestedManyWithoutCategoriesInput = {
    create?: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput> | GeneratedImageCreateWithoutCategoriesInput[] | GeneratedImageUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCategoriesInput | GeneratedImageCreateOrConnectWithoutCategoriesInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
  }

  export type GeneratedImageUpdateManyWithoutCategoriesNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput> | GeneratedImageCreateWithoutCategoriesInput[] | GeneratedImageUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCategoriesInput | GeneratedImageCreateOrConnectWithoutCategoriesInput[]
    upsert?: GeneratedImageUpsertWithWhereUniqueWithoutCategoriesInput | GeneratedImageUpsertWithWhereUniqueWithoutCategoriesInput[]
    set?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    disconnect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    delete?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    update?: GeneratedImageUpdateWithWhereUniqueWithoutCategoriesInput | GeneratedImageUpdateWithWhereUniqueWithoutCategoriesInput[]
    updateMany?: GeneratedImageUpdateManyWithWhereWithoutCategoriesInput | GeneratedImageUpdateManyWithWhereWithoutCategoriesInput[]
    deleteMany?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
  }

  export type GeneratedImageUncheckedUpdateManyWithoutCategoriesNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput> | GeneratedImageCreateWithoutCategoriesInput[] | GeneratedImageUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutCategoriesInput | GeneratedImageCreateOrConnectWithoutCategoriesInput[]
    upsert?: GeneratedImageUpsertWithWhereUniqueWithoutCategoriesInput | GeneratedImageUpsertWithWhereUniqueWithoutCategoriesInput[]
    set?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    disconnect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    delete?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    connect?: GeneratedImageWhereUniqueInput | GeneratedImageWhereUniqueInput[]
    update?: GeneratedImageUpdateWithWhereUniqueWithoutCategoriesInput | GeneratedImageUpdateWithWhereUniqueWithoutCategoriesInput[]
    updateMany?: GeneratedImageUpdateManyWithWhereWithoutCategoriesInput | GeneratedImageUpdateManyWithWhereWithoutCategoriesInput[]
    deleteMany?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTriggeredNotificationsInput = {
    create?: XOR<UserCreateWithoutTriggeredNotificationsInput, UserUncheckedCreateWithoutTriggeredNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTriggeredNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type GeneratedImageCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<GeneratedImageCreateWithoutNotificationsInput, GeneratedImageUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutNotificationsInput
    connect?: GeneratedImageWhereUniqueInput
  }

  export type ImageCommentCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<ImageCommentCreateWithoutNotificationsInput, ImageCommentUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: ImageCommentCreateOrConnectWithoutNotificationsInput
    connect?: ImageCommentWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutTriggeredNotificationsInput, UserUncheckedCreateWithoutTriggeredNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTriggeredNotificationsInput
    upsert?: UserUpsertWithoutTriggeredNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTriggeredNotificationsInput, UserUpdateWithoutTriggeredNotificationsInput>, UserUncheckedUpdateWithoutTriggeredNotificationsInput>
  }

  export type GeneratedImageUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<GeneratedImageCreateWithoutNotificationsInput, GeneratedImageUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: GeneratedImageCreateOrConnectWithoutNotificationsInput
    upsert?: GeneratedImageUpsertWithoutNotificationsInput
    disconnect?: GeneratedImageWhereInput | boolean
    delete?: GeneratedImageWhereInput | boolean
    connect?: GeneratedImageWhereUniqueInput
    update?: XOR<XOR<GeneratedImageUpdateToOneWithWhereWithoutNotificationsInput, GeneratedImageUpdateWithoutNotificationsInput>, GeneratedImageUncheckedUpdateWithoutNotificationsInput>
  }

  export type ImageCommentUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<ImageCommentCreateWithoutNotificationsInput, ImageCommentUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: ImageCommentCreateOrConnectWithoutNotificationsInput
    upsert?: ImageCommentUpsertWithoutNotificationsInput
    disconnect?: ImageCommentWhereInput | boolean
    delete?: ImageCommentWhereInput | boolean
    connect?: ImageCommentWhereUniqueInput
    update?: XOR<XOR<ImageCommentUpdateToOneWithWhereWithoutNotificationsInput, ImageCommentUpdateWithoutNotificationsInput>, ImageCommentUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[]
    notIn?: $Enums.AuthProvider[]
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[]
    notIn?: $Enums.AuthProvider[]
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[]
    notIn?: $Enums.NotificationType[]
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LoginAttemptCreateWithoutUserInput = {
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoginAttemptUncheckedCreateWithoutUserInput = {
    id?: number
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoginAttemptCreateOrConnectWithoutUserInput = {
    where: LoginAttemptWhereUniqueInput
    create: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput>
  }

  export type LoginAttemptCreateManyUserInputEnvelope = {
    data: LoginAttemptCreateManyUserInput | LoginAttemptCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GeneratedImageCreateWithoutUserInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeCreateNestedManyWithoutImageInput
    comments?: ImageCommentCreateNestedManyWithoutImageInput
    categories?: CategoryCreateNestedManyWithoutImagesInput
    notifications?: NotificationCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUncheckedCreateWithoutUserInput = {
    id?: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeUncheckedCreateNestedManyWithoutImageInput
    comments?: ImageCommentUncheckedCreateNestedManyWithoutImageInput
    categories?: CategoryUncheckedCreateNestedManyWithoutImagesInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageCreateOrConnectWithoutUserInput = {
    where: GeneratedImageWhereUniqueInput
    create: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput>
  }

  export type GeneratedImageCreateManyUserInputEnvelope = {
    data: GeneratedImageCreateManyUserInput | GeneratedImageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ImageLikeCreateWithoutUserInput = {
    createdAt?: Date | string
    image: GeneratedImageCreateNestedOneWithoutLikesInput
  }

  export type ImageLikeUncheckedCreateWithoutUserInput = {
    id?: number
    imageId: number
    createdAt?: Date | string
  }

  export type ImageLikeCreateOrConnectWithoutUserInput = {
    where: ImageLikeWhereUniqueInput
    create: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput>
  }

  export type ImageLikeCreateManyUserInputEnvelope = {
    data: ImageLikeCreateManyUserInput | ImageLikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ImageCommentCreateWithoutUserInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    image: GeneratedImageCreateNestedOneWithoutCommentsInput
    parent?: ImageCommentCreateNestedOneWithoutRepliesInput
    replies?: ImageCommentCreateNestedManyWithoutParentInput
    notifications?: NotificationCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUncheckedCreateWithoutUserInput = {
    id?: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ImageCommentUncheckedCreateNestedManyWithoutParentInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentCreateOrConnectWithoutUserInput = {
    where: ImageCommentWhereUniqueInput
    create: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput>
  }

  export type ImageCommentCreateManyUserInputEnvelope = {
    data: ImageCommentCreateManyUserInput | ImageCommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    createdAt?: Date | string
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput
    image?: GeneratedImageCreateNestedOneWithoutNotificationsInput
    comment?: ImageCommentCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutActorInput = {
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    image?: GeneratedImageCreateNestedOneWithoutNotificationsInput
    comment?: ImageCommentCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutActorInput = {
    id?: number
    userId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutActorInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput>
  }

  export type NotificationCreateManyActorInputEnvelope = {
    data: NotificationCreateManyActorInput | NotificationCreateManyActorInput[]
    skipDuplicates?: boolean
  }

  export type LoginAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: LoginAttemptWhereUniqueInput
    update: XOR<LoginAttemptUpdateWithoutUserInput, LoginAttemptUncheckedUpdateWithoutUserInput>
    create: XOR<LoginAttemptCreateWithoutUserInput, LoginAttemptUncheckedCreateWithoutUserInput>
  }

  export type LoginAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: LoginAttemptWhereUniqueInput
    data: XOR<LoginAttemptUpdateWithoutUserInput, LoginAttemptUncheckedUpdateWithoutUserInput>
  }

  export type LoginAttemptUpdateManyWithWhereWithoutUserInput = {
    where: LoginAttemptScalarWhereInput
    data: XOR<LoginAttemptUpdateManyMutationInput, LoginAttemptUncheckedUpdateManyWithoutUserInput>
  }

  export type LoginAttemptScalarWhereInput = {
    AND?: LoginAttemptScalarWhereInput | LoginAttemptScalarWhereInput[]
    OR?: LoginAttemptScalarWhereInput[]
    NOT?: LoginAttemptScalarWhereInput | LoginAttemptScalarWhereInput[]
    id?: IntFilter<"LoginAttempt"> | number
    userId?: IntFilter<"LoginAttempt"> | number
    failedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    ipAddress?: StringNullableFilter<"LoginAttempt"> | string | null
    userAgent?: StringNullableFilter<"LoginAttempt"> | string | null
    createdAt?: DateTimeFilter<"LoginAttempt"> | Date | string
    updatedAt?: DateTimeFilter<"LoginAttempt"> | Date | string
  }

  export type GeneratedImageUpsertWithWhereUniqueWithoutUserInput = {
    where: GeneratedImageWhereUniqueInput
    update: XOR<GeneratedImageUpdateWithoutUserInput, GeneratedImageUncheckedUpdateWithoutUserInput>
    create: XOR<GeneratedImageCreateWithoutUserInput, GeneratedImageUncheckedCreateWithoutUserInput>
  }

  export type GeneratedImageUpdateWithWhereUniqueWithoutUserInput = {
    where: GeneratedImageWhereUniqueInput
    data: XOR<GeneratedImageUpdateWithoutUserInput, GeneratedImageUncheckedUpdateWithoutUserInput>
  }

  export type GeneratedImageUpdateManyWithWhereWithoutUserInput = {
    where: GeneratedImageScalarWhereInput
    data: XOR<GeneratedImageUpdateManyMutationInput, GeneratedImageUncheckedUpdateManyWithoutUserInput>
  }

  export type GeneratedImageScalarWhereInput = {
    AND?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
    OR?: GeneratedImageScalarWhereInput[]
    NOT?: GeneratedImageScalarWhereInput | GeneratedImageScalarWhereInput[]
    id?: IntFilter<"GeneratedImage"> | number
    userId?: IntFilter<"GeneratedImage"> | number
    prompt?: StringFilter<"GeneratedImage"> | string
    translatedPrompt?: StringNullableFilter<"GeneratedImage"> | string | null
    imageUrl?: StringFilter<"GeneratedImage"> | string
    model?: StringFilter<"GeneratedImage"> | string
    size?: StringFilter<"GeneratedImage"> | string
    editData?: StringNullableFilter<"GeneratedImage"> | string | null
    editedImageUrl?: StringNullableFilter<"GeneratedImage"> | string | null
    createdAt?: DateTimeFilter<"GeneratedImage"> | Date | string
    updatedAt?: DateTimeFilter<"GeneratedImage"> | Date | string
  }

  export type ImageLikeUpsertWithWhereUniqueWithoutUserInput = {
    where: ImageLikeWhereUniqueInput
    update: XOR<ImageLikeUpdateWithoutUserInput, ImageLikeUncheckedUpdateWithoutUserInput>
    create: XOR<ImageLikeCreateWithoutUserInput, ImageLikeUncheckedCreateWithoutUserInput>
  }

  export type ImageLikeUpdateWithWhereUniqueWithoutUserInput = {
    where: ImageLikeWhereUniqueInput
    data: XOR<ImageLikeUpdateWithoutUserInput, ImageLikeUncheckedUpdateWithoutUserInput>
  }

  export type ImageLikeUpdateManyWithWhereWithoutUserInput = {
    where: ImageLikeScalarWhereInput
    data: XOR<ImageLikeUpdateManyMutationInput, ImageLikeUncheckedUpdateManyWithoutUserInput>
  }

  export type ImageLikeScalarWhereInput = {
    AND?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
    OR?: ImageLikeScalarWhereInput[]
    NOT?: ImageLikeScalarWhereInput | ImageLikeScalarWhereInput[]
    id?: IntFilter<"ImageLike"> | number
    userId?: IntFilter<"ImageLike"> | number
    imageId?: IntFilter<"ImageLike"> | number
    createdAt?: DateTimeFilter<"ImageLike"> | Date | string
  }

  export type ImageCommentUpsertWithWhereUniqueWithoutUserInput = {
    where: ImageCommentWhereUniqueInput
    update: XOR<ImageCommentUpdateWithoutUserInput, ImageCommentUncheckedUpdateWithoutUserInput>
    create: XOR<ImageCommentCreateWithoutUserInput, ImageCommentUncheckedCreateWithoutUserInput>
  }

  export type ImageCommentUpdateWithWhereUniqueWithoutUserInput = {
    where: ImageCommentWhereUniqueInput
    data: XOR<ImageCommentUpdateWithoutUserInput, ImageCommentUncheckedUpdateWithoutUserInput>
  }

  export type ImageCommentUpdateManyWithWhereWithoutUserInput = {
    where: ImageCommentScalarWhereInput
    data: XOR<ImageCommentUpdateManyMutationInput, ImageCommentUncheckedUpdateManyWithoutUserInput>
  }

  export type ImageCommentScalarWhereInput = {
    AND?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
    OR?: ImageCommentScalarWhereInput[]
    NOT?: ImageCommentScalarWhereInput | ImageCommentScalarWhereInput[]
    id?: IntFilter<"ImageComment"> | number
    userId?: IntFilter<"ImageComment"> | number
    imageId?: IntFilter<"ImageComment"> | number
    content?: StringFilter<"ImageComment"> | string
    parentId?: IntNullableFilter<"ImageComment"> | number | null
    createdAt?: DateTimeFilter<"ImageComment"> | Date | string
    updatedAt?: DateTimeFilter<"ImageComment"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    actorId?: IntFilter<"Notification"> | number
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    message?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    imageId?: IntNullableFilter<"Notification"> | number | null
    commentId?: IntNullableFilter<"Notification"> | number | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutActorInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutActorInput, NotificationUncheckedUpdateWithoutActorInput>
    create: XOR<NotificationCreateWithoutActorInput, NotificationUncheckedCreateWithoutActorInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutActorInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutActorInput, NotificationUncheckedUpdateWithoutActorInput>
  }

  export type NotificationUpdateManyWithWhereWithoutActorInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutActorInput>
  }

  export type UserCreateWithoutLoginAttemptsInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutLoginAttemptsInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutLoginAttemptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
  }

  export type UserUpsertWithoutLoginAttemptsInput = {
    update: XOR<UserUpdateWithoutLoginAttemptsInput, UserUncheckedUpdateWithoutLoginAttemptsInput>
    create: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLoginAttemptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLoginAttemptsInput, UserUncheckedUpdateWithoutLoginAttemptsInput>
  }

  export type UserUpdateWithoutLoginAttemptsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutLoginAttemptsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserCreateWithoutGeneratedImagesInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutGeneratedImagesInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutGeneratedImagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGeneratedImagesInput, UserUncheckedCreateWithoutGeneratedImagesInput>
  }

  export type ImageLikeCreateWithoutImageInput = {
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutImageLikesInput
  }

  export type ImageLikeUncheckedCreateWithoutImageInput = {
    id?: number
    userId: number
    createdAt?: Date | string
  }

  export type ImageLikeCreateOrConnectWithoutImageInput = {
    where: ImageLikeWhereUniqueInput
    create: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput>
  }

  export type ImageLikeCreateManyImageInputEnvelope = {
    data: ImageLikeCreateManyImageInput | ImageLikeCreateManyImageInput[]
    skipDuplicates?: boolean
  }

  export type ImageCommentCreateWithoutImageInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutImageCommentsInput
    parent?: ImageCommentCreateNestedOneWithoutRepliesInput
    replies?: ImageCommentCreateNestedManyWithoutParentInput
    notifications?: NotificationCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUncheckedCreateWithoutImageInput = {
    id?: number
    userId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ImageCommentUncheckedCreateNestedManyWithoutParentInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentCreateOrConnectWithoutImageInput = {
    where: ImageCommentWhereUniqueInput
    create: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput>
  }

  export type ImageCommentCreateManyImageInputEnvelope = {
    data: ImageCommentCreateManyImageInput | ImageCommentCreateManyImageInput[]
    skipDuplicates?: boolean
  }

  export type CategoryCreateWithoutImagesInput = {
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutImagesInput = {
    id?: number
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutImagesInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput>
  }

  export type NotificationCreateWithoutImageInput = {
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput
    comment?: ImageCommentCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutImageInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutImageInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput>
  }

  export type NotificationCreateManyImageInputEnvelope = {
    data: NotificationCreateManyImageInput | NotificationCreateManyImageInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGeneratedImagesInput = {
    update: XOR<UserUpdateWithoutGeneratedImagesInput, UserUncheckedUpdateWithoutGeneratedImagesInput>
    create: XOR<UserCreateWithoutGeneratedImagesInput, UserUncheckedCreateWithoutGeneratedImagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGeneratedImagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGeneratedImagesInput, UserUncheckedUpdateWithoutGeneratedImagesInput>
  }

  export type UserUpdateWithoutGeneratedImagesInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutGeneratedImagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type ImageLikeUpsertWithWhereUniqueWithoutImageInput = {
    where: ImageLikeWhereUniqueInput
    update: XOR<ImageLikeUpdateWithoutImageInput, ImageLikeUncheckedUpdateWithoutImageInput>
    create: XOR<ImageLikeCreateWithoutImageInput, ImageLikeUncheckedCreateWithoutImageInput>
  }

  export type ImageLikeUpdateWithWhereUniqueWithoutImageInput = {
    where: ImageLikeWhereUniqueInput
    data: XOR<ImageLikeUpdateWithoutImageInput, ImageLikeUncheckedUpdateWithoutImageInput>
  }

  export type ImageLikeUpdateManyWithWhereWithoutImageInput = {
    where: ImageLikeScalarWhereInput
    data: XOR<ImageLikeUpdateManyMutationInput, ImageLikeUncheckedUpdateManyWithoutImageInput>
  }

  export type ImageCommentUpsertWithWhereUniqueWithoutImageInput = {
    where: ImageCommentWhereUniqueInput
    update: XOR<ImageCommentUpdateWithoutImageInput, ImageCommentUncheckedUpdateWithoutImageInput>
    create: XOR<ImageCommentCreateWithoutImageInput, ImageCommentUncheckedCreateWithoutImageInput>
  }

  export type ImageCommentUpdateWithWhereUniqueWithoutImageInput = {
    where: ImageCommentWhereUniqueInput
    data: XOR<ImageCommentUpdateWithoutImageInput, ImageCommentUncheckedUpdateWithoutImageInput>
  }

  export type ImageCommentUpdateManyWithWhereWithoutImageInput = {
    where: ImageCommentScalarWhereInput
    data: XOR<ImageCommentUpdateManyMutationInput, ImageCommentUncheckedUpdateManyWithoutImageInput>
  }

  export type CategoryUpsertWithWhereUniqueWithoutImagesInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutImagesInput, CategoryUncheckedUpdateWithoutImagesInput>
    create: XOR<CategoryCreateWithoutImagesInput, CategoryUncheckedCreateWithoutImagesInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutImagesInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutImagesInput, CategoryUncheckedUpdateWithoutImagesInput>
  }

  export type CategoryUpdateManyWithWhereWithoutImagesInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutImagesInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutImageInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutImageInput, NotificationUncheckedUpdateWithoutImageInput>
    create: XOR<NotificationCreateWithoutImageInput, NotificationUncheckedCreateWithoutImageInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutImageInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutImageInput, NotificationUncheckedUpdateWithoutImageInput>
  }

  export type NotificationUpdateManyWithWhereWithoutImageInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutImageInput>
  }

  export type UserCreateWithoutImageLikesInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutImageLikesInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutImageLikesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutImageLikesInput, UserUncheckedCreateWithoutImageLikesInput>
  }

  export type GeneratedImageCreateWithoutLikesInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedImagesInput
    comments?: ImageCommentCreateNestedManyWithoutImageInput
    categories?: CategoryCreateNestedManyWithoutImagesInput
    notifications?: NotificationCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUncheckedCreateWithoutLikesInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ImageCommentUncheckedCreateNestedManyWithoutImageInput
    categories?: CategoryUncheckedCreateNestedManyWithoutImagesInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageCreateOrConnectWithoutLikesInput = {
    where: GeneratedImageWhereUniqueInput
    create: XOR<GeneratedImageCreateWithoutLikesInput, GeneratedImageUncheckedCreateWithoutLikesInput>
  }

  export type UserUpsertWithoutImageLikesInput = {
    update: XOR<UserUpdateWithoutImageLikesInput, UserUncheckedUpdateWithoutImageLikesInput>
    create: XOR<UserCreateWithoutImageLikesInput, UserUncheckedCreateWithoutImageLikesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutImageLikesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutImageLikesInput, UserUncheckedUpdateWithoutImageLikesInput>
  }

  export type UserUpdateWithoutImageLikesInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutImageLikesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type GeneratedImageUpsertWithoutLikesInput = {
    update: XOR<GeneratedImageUpdateWithoutLikesInput, GeneratedImageUncheckedUpdateWithoutLikesInput>
    create: XOR<GeneratedImageCreateWithoutLikesInput, GeneratedImageUncheckedCreateWithoutLikesInput>
    where?: GeneratedImageWhereInput
  }

  export type GeneratedImageUpdateToOneWithWhereWithoutLikesInput = {
    where?: GeneratedImageWhereInput
    data: XOR<GeneratedImageUpdateWithoutLikesInput, GeneratedImageUncheckedUpdateWithoutLikesInput>
  }

  export type GeneratedImageUpdateWithoutLikesInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedImagesNestedInput
    comments?: ImageCommentUpdateManyWithoutImageNestedInput
    categories?: CategoryUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateWithoutLikesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ImageCommentUncheckedUpdateManyWithoutImageNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type UserCreateWithoutImageCommentsInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutImageCommentsInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutImageCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutImageCommentsInput, UserUncheckedCreateWithoutImageCommentsInput>
  }

  export type GeneratedImageCreateWithoutCommentsInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedImagesInput
    likes?: ImageLikeCreateNestedManyWithoutImageInput
    categories?: CategoryCreateNestedManyWithoutImagesInput
    notifications?: NotificationCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUncheckedCreateWithoutCommentsInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeUncheckedCreateNestedManyWithoutImageInput
    categories?: CategoryUncheckedCreateNestedManyWithoutImagesInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageCreateOrConnectWithoutCommentsInput = {
    where: GeneratedImageWhereUniqueInput
    create: XOR<GeneratedImageCreateWithoutCommentsInput, GeneratedImageUncheckedCreateWithoutCommentsInput>
  }

  export type ImageCommentCreateWithoutRepliesInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutImageCommentsInput
    image: GeneratedImageCreateNestedOneWithoutCommentsInput
    parent?: ImageCommentCreateNestedOneWithoutRepliesInput
    notifications?: NotificationCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUncheckedCreateWithoutRepliesInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentCreateOrConnectWithoutRepliesInput = {
    where: ImageCommentWhereUniqueInput
    create: XOR<ImageCommentCreateWithoutRepliesInput, ImageCommentUncheckedCreateWithoutRepliesInput>
  }

  export type ImageCommentCreateWithoutParentInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutImageCommentsInput
    image: GeneratedImageCreateNestedOneWithoutCommentsInput
    replies?: ImageCommentCreateNestedManyWithoutParentInput
    notifications?: NotificationCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentUncheckedCreateWithoutParentInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ImageCommentUncheckedCreateNestedManyWithoutParentInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutCommentInput
  }

  export type ImageCommentCreateOrConnectWithoutParentInput = {
    where: ImageCommentWhereUniqueInput
    create: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput>
  }

  export type ImageCommentCreateManyParentInputEnvelope = {
    data: ImageCommentCreateManyParentInput | ImageCommentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutCommentInput = {
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput
    image?: GeneratedImageCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutCommentInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutCommentInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput>
  }

  export type NotificationCreateManyCommentInputEnvelope = {
    data: NotificationCreateManyCommentInput | NotificationCreateManyCommentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutImageCommentsInput = {
    update: XOR<UserUpdateWithoutImageCommentsInput, UserUncheckedUpdateWithoutImageCommentsInput>
    create: XOR<UserCreateWithoutImageCommentsInput, UserUncheckedCreateWithoutImageCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutImageCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutImageCommentsInput, UserUncheckedUpdateWithoutImageCommentsInput>
  }

  export type UserUpdateWithoutImageCommentsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutImageCommentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type GeneratedImageUpsertWithoutCommentsInput = {
    update: XOR<GeneratedImageUpdateWithoutCommentsInput, GeneratedImageUncheckedUpdateWithoutCommentsInput>
    create: XOR<GeneratedImageCreateWithoutCommentsInput, GeneratedImageUncheckedCreateWithoutCommentsInput>
    where?: GeneratedImageWhereInput
  }

  export type GeneratedImageUpdateToOneWithWhereWithoutCommentsInput = {
    where?: GeneratedImageWhereInput
    data: XOR<GeneratedImageUpdateWithoutCommentsInput, GeneratedImageUncheckedUpdateWithoutCommentsInput>
  }

  export type GeneratedImageUpdateWithoutCommentsInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedImagesNestedInput
    likes?: ImageLikeUpdateManyWithoutImageNestedInput
    categories?: CategoryUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateWithoutCommentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUncheckedUpdateManyWithoutImageNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type ImageCommentUpsertWithoutRepliesInput = {
    update: XOR<ImageCommentUpdateWithoutRepliesInput, ImageCommentUncheckedUpdateWithoutRepliesInput>
    create: XOR<ImageCommentCreateWithoutRepliesInput, ImageCommentUncheckedCreateWithoutRepliesInput>
    where?: ImageCommentWhereInput
  }

  export type ImageCommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: ImageCommentWhereInput
    data: XOR<ImageCommentUpdateWithoutRepliesInput, ImageCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type ImageCommentUpdateWithoutRepliesInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageCommentsNestedInput
    image?: GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ImageCommentUpdateOneWithoutRepliesNestedInput
    notifications?: NotificationUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateWithoutRepliesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUpsertWithWhereUniqueWithoutParentInput = {
    where: ImageCommentWhereUniqueInput
    update: XOR<ImageCommentUpdateWithoutParentInput, ImageCommentUncheckedUpdateWithoutParentInput>
    create: XOR<ImageCommentCreateWithoutParentInput, ImageCommentUncheckedCreateWithoutParentInput>
  }

  export type ImageCommentUpdateWithWhereUniqueWithoutParentInput = {
    where: ImageCommentWhereUniqueInput
    data: XOR<ImageCommentUpdateWithoutParentInput, ImageCommentUncheckedUpdateWithoutParentInput>
  }

  export type ImageCommentUpdateManyWithWhereWithoutParentInput = {
    where: ImageCommentScalarWhereInput
    data: XOR<ImageCommentUpdateManyMutationInput, ImageCommentUncheckedUpdateManyWithoutParentInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutCommentInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutCommentInput, NotificationUncheckedUpdateWithoutCommentInput>
    create: XOR<NotificationCreateWithoutCommentInput, NotificationUncheckedCreateWithoutCommentInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutCommentInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutCommentInput, NotificationUncheckedUpdateWithoutCommentInput>
  }

  export type NotificationUpdateManyWithWhereWithoutCommentInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutCommentInput>
  }

  export type GeneratedImageCreateWithoutCategoriesInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedImagesInput
    likes?: ImageLikeCreateNestedManyWithoutImageInput
    comments?: ImageCommentCreateNestedManyWithoutImageInput
    notifications?: NotificationCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageUncheckedCreateWithoutCategoriesInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeUncheckedCreateNestedManyWithoutImageInput
    comments?: ImageCommentUncheckedCreateNestedManyWithoutImageInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutImageInput
  }

  export type GeneratedImageCreateOrConnectWithoutCategoriesInput = {
    where: GeneratedImageWhereUniqueInput
    create: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput>
  }

  export type GeneratedImageUpsertWithWhereUniqueWithoutCategoriesInput = {
    where: GeneratedImageWhereUniqueInput
    update: XOR<GeneratedImageUpdateWithoutCategoriesInput, GeneratedImageUncheckedUpdateWithoutCategoriesInput>
    create: XOR<GeneratedImageCreateWithoutCategoriesInput, GeneratedImageUncheckedCreateWithoutCategoriesInput>
  }

  export type GeneratedImageUpdateWithWhereUniqueWithoutCategoriesInput = {
    where: GeneratedImageWhereUniqueInput
    data: XOR<GeneratedImageUpdateWithoutCategoriesInput, GeneratedImageUncheckedUpdateWithoutCategoriesInput>
  }

  export type GeneratedImageUpdateManyWithWhereWithoutCategoriesInput = {
    where: GeneratedImageScalarWhereInput
    data: XOR<GeneratedImageUpdateManyMutationInput, GeneratedImageUncheckedUpdateManyWithoutCategoriesInput>
  }

  export type UserCreateWithoutNotificationsInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserCreateWithoutTriggeredNotificationsInput = {
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTriggeredNotificationsInput = {
    id?: number
    email: string
    password?: string | null
    nickname: string
    credits?: number
    role?: $Enums.UserRole
    provider?: $Enums.AuthProvider
    kakaoId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileImageUrl?: string | null
    loginAttempts?: LoginAttemptUncheckedCreateNestedManyWithoutUserInput
    generatedImages?: GeneratedImageUncheckedCreateNestedManyWithoutUserInput
    imageLikes?: ImageLikeUncheckedCreateNestedManyWithoutUserInput
    imageComments?: ImageCommentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTriggeredNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTriggeredNotificationsInput, UserUncheckedCreateWithoutTriggeredNotificationsInput>
  }

  export type GeneratedImageCreateWithoutNotificationsInput = {
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedImagesInput
    likes?: ImageLikeCreateNestedManyWithoutImageInput
    comments?: ImageCommentCreateNestedManyWithoutImageInput
    categories?: CategoryCreateNestedManyWithoutImagesInput
  }

  export type GeneratedImageUncheckedCreateWithoutNotificationsInput = {
    id?: number
    userId: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ImageLikeUncheckedCreateNestedManyWithoutImageInput
    comments?: ImageCommentUncheckedCreateNestedManyWithoutImageInput
    categories?: CategoryUncheckedCreateNestedManyWithoutImagesInput
  }

  export type GeneratedImageCreateOrConnectWithoutNotificationsInput = {
    where: GeneratedImageWhereUniqueInput
    create: XOR<GeneratedImageCreateWithoutNotificationsInput, GeneratedImageUncheckedCreateWithoutNotificationsInput>
  }

  export type ImageCommentCreateWithoutNotificationsInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutImageCommentsInput
    image: GeneratedImageCreateNestedOneWithoutCommentsInput
    parent?: ImageCommentCreateNestedOneWithoutRepliesInput
    replies?: ImageCommentCreateNestedManyWithoutParentInput
  }

  export type ImageCommentUncheckedCreateWithoutNotificationsInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ImageCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type ImageCommentCreateOrConnectWithoutNotificationsInput = {
    where: ImageCommentWhereUniqueInput
    create: XOR<ImageCommentCreateWithoutNotificationsInput, ImageCommentUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput
  }

  export type UserUpsertWithoutTriggeredNotificationsInput = {
    update: XOR<UserUpdateWithoutTriggeredNotificationsInput, UserUncheckedUpdateWithoutTriggeredNotificationsInput>
    create: XOR<UserCreateWithoutTriggeredNotificationsInput, UserUncheckedCreateWithoutTriggeredNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTriggeredNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTriggeredNotificationsInput, UserUncheckedUpdateWithoutTriggeredNotificationsInput>
  }

  export type UserUpdateWithoutTriggeredNotificationsInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTriggeredNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    kakaoId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    loginAttempts?: LoginAttemptUncheckedUpdateManyWithoutUserNestedInput
    generatedImages?: GeneratedImageUncheckedUpdateManyWithoutUserNestedInput
    imageLikes?: ImageLikeUncheckedUpdateManyWithoutUserNestedInput
    imageComments?: ImageCommentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GeneratedImageUpsertWithoutNotificationsInput = {
    update: XOR<GeneratedImageUpdateWithoutNotificationsInput, GeneratedImageUncheckedUpdateWithoutNotificationsInput>
    create: XOR<GeneratedImageCreateWithoutNotificationsInput, GeneratedImageUncheckedCreateWithoutNotificationsInput>
    where?: GeneratedImageWhereInput
  }

  export type GeneratedImageUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: GeneratedImageWhereInput
    data: XOR<GeneratedImageUpdateWithoutNotificationsInput, GeneratedImageUncheckedUpdateWithoutNotificationsInput>
  }

  export type GeneratedImageUpdateWithoutNotificationsInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedImagesNestedInput
    likes?: ImageLikeUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUpdateManyWithoutImageNestedInput
    categories?: CategoryUpdateManyWithoutImagesNestedInput
  }

  export type GeneratedImageUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUncheckedUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUncheckedUpdateManyWithoutImageNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutImagesNestedInput
  }

  export type ImageCommentUpsertWithoutNotificationsInput = {
    update: XOR<ImageCommentUpdateWithoutNotificationsInput, ImageCommentUncheckedUpdateWithoutNotificationsInput>
    create: XOR<ImageCommentCreateWithoutNotificationsInput, ImageCommentUncheckedCreateWithoutNotificationsInput>
    where?: ImageCommentWhereInput
  }

  export type ImageCommentUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: ImageCommentWhereInput
    data: XOR<ImageCommentUpdateWithoutNotificationsInput, ImageCommentUncheckedUpdateWithoutNotificationsInput>
  }

  export type ImageCommentUpdateWithoutNotificationsInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageCommentsNestedInput
    image?: GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ImageCommentUpdateOneWithoutRepliesNestedInput
    replies?: ImageCommentUpdateManyWithoutParentNestedInput
  }

  export type ImageCommentUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ImageCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type LoginAttemptCreateManyUserInput = {
    id?: number
    failedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GeneratedImageCreateManyUserInput = {
    id?: number
    prompt: string
    translatedPrompt?: string | null
    imageUrl: string
    model: string
    size?: string
    editData?: string | null
    editedImageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageLikeCreateManyUserInput = {
    id?: number
    imageId: number
    createdAt?: Date | string
  }

  export type ImageCommentCreateManyUserInput = {
    id?: number
    imageId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type NotificationCreateManyActorInput = {
    id?: number
    userId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    commentId?: number | null
    createdAt?: Date | string
  }

  export type LoginAttemptUpdateWithoutUserInput = {
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    failedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedImageUpdateWithoutUserInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUpdateManyWithoutImageNestedInput
    categories?: CategoryUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUncheckedUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUncheckedUpdateManyWithoutImageNestedInput
    categories?: CategoryUncheckedUpdateManyWithoutImagesNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: GeneratedImageUpdateOneRequiredWithoutLikesNestedInput
  }

  export type ImageLikeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCommentUpdateWithoutUserInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ImageCommentUpdateOneWithoutRepliesNestedInput
    replies?: ImageCommentUpdateManyWithoutParentNestedInput
    notifications?: NotificationUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ImageCommentUncheckedUpdateManyWithoutParentNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput
    image?: GeneratedImageUpdateOneWithoutNotificationsNestedInput
    comment?: ImageCommentUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutActorInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    image?: GeneratedImageUpdateOneWithoutNotificationsNestedInput
    comment?: ImageCommentUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutActorInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutActorInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeCreateManyImageInput = {
    id?: number
    userId: number
    createdAt?: Date | string
  }

  export type ImageCommentCreateManyImageInput = {
    id?: number
    userId: number
    content: string
    parentId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyImageInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    commentId?: number | null
    createdAt?: Date | string
  }

  export type ImageLikeUpdateWithoutImageInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageLikesNestedInput
  }

  export type ImageLikeUncheckedUpdateWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageLikeUncheckedUpdateManyWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCommentUpdateWithoutImageInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageCommentsNestedInput
    parent?: ImageCommentUpdateOneWithoutRepliesNestedInput
    replies?: ImageCommentUpdateManyWithoutParentNestedInput
    notifications?: NotificationUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ImageCommentUncheckedUpdateManyWithoutParentNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateManyWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUpdateWithoutImagesInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutImagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyWithoutImagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutImageInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput
    comment?: ImageCommentUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutImageInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    commentId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageCommentCreateManyParentInput = {
    id?: number
    userId: number
    imageId: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyCommentInput = {
    id?: number
    userId: number
    actorId: number
    type: $Enums.NotificationType
    message?: string | null
    isRead?: boolean
    imageId?: number | null
    createdAt?: Date | string
  }

  export type ImageCommentUpdateWithoutParentInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutImageCommentsNestedInput
    image?: GeneratedImageUpdateOneRequiredWithoutCommentsNestedInput
    replies?: ImageCommentUpdateManyWithoutParentNestedInput
    notifications?: NotificationUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ImageCommentUncheckedUpdateManyWithoutParentNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutCommentNestedInput
  }

  export type ImageCommentUncheckedUpdateManyWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    imageId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutCommentInput = {
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput
    image?: GeneratedImageUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutCommentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutCommentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    actorId?: IntFieldUpdateOperationsInput | number
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    imageId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedImageUpdateWithoutCategoriesInput = {
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedImagesNestedInput
    likes?: ImageLikeUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUpdateManyWithoutImageNestedInput
    notifications?: NotificationUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateWithoutCategoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ImageLikeUncheckedUpdateManyWithoutImageNestedInput
    comments?: ImageCommentUncheckedUpdateManyWithoutImageNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type GeneratedImageUncheckedUpdateManyWithoutCategoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    translatedPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    editData?: NullableStringFieldUpdateOperationsInput | string | null
    editedImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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