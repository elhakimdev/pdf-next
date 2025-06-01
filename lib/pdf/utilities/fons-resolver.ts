import { capitalize } from "vue";

export function resolveFontName(family: string, weight: string, italic: boolean): string {
  let name = `${family}-${capitalize(weight)}`;
  if (italic) name += "Italic";
  return name;
}