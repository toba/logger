declare module 'flat' {
   // https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html
   //type flatten = (data: any, options?: Options) => { [key: string]: any };

   /**
    * https://github.com/hughsk/flat#options
    */
   export interface Options {
      delimiter?: string;
      safe?: boolean;
      object?: boolean;
      overwrite?: boolean;
      maxDepth?: number;
   }

   //export = flatten;

   /**
    * https://github.com/hughsk/flat
    */
   export = function flatten(
      data: any,
      options?: Options
   ): { [key: string]: any } {};
}

// export = flatten;

// declare function flatten(data: any, options?: Options): { [key: string]: any };
