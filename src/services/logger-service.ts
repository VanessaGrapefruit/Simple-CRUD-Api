
export class LoggerService {
    public static api(method: string | undefined, url: string | undefined, status: number): void {
        console.log(`[${method}] - ${url} responded with status code: ${status}`);
    }

    public static error(error: unknown): void {
        console.log(error);
    }
}