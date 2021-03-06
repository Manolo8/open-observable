export interface IConfigurator<TSource> {
    once(callback: (value: TSource) => void): IConfigurator<TSource>;

    on(deps: any[], callback: (value: TSource) => void): IConfigurator<TSource>;
}
