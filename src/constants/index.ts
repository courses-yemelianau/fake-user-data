export enum Env {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Staging = 'staging'
}

export const {
    NODE_ENV = Env.Development,
} = process.env;
