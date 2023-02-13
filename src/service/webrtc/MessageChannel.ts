export interface MessageChannel {
  sendMessage(data: string | object): void;

  onMessage(callback: (message: string) => Promise<void>): void;
}
