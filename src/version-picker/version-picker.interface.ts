export interface IVersionPicker {
  getLatestVersion(name: string): string | Promise<string>;
}
