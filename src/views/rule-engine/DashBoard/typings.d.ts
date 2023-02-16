export type Footer = {
    title: string;
    value: number | string;
    status?: "default" | "error" | "success" | "warning" | "processing"
}