export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly status: "fail" | "error";

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.status = statusCode >= 500 ? "error" : "fail";
        this.isOperational = true;

        // Preserve the correct prototype chain for this custom error.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}