declare module "*.less" {
    const cn: (...classes: Array<undefined | string | string[] | { [key: string]: boolean }>) => string;
    export default cn;
}
