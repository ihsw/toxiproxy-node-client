export class ToxiproxyError extends Error {
    constructor(name: string, message: string, stack?: string) {
        super(message);
        this.name = name;
        if (stack !== undefined) {
            this.stack = stack;
        }
    }
}

