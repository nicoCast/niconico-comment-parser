declare namespace eaw {
	export function eastAsianWidth (character: string): string;
	export function characterLength (character: string): number;
	export function length (string: string): number;
	export function slice (text: string, start?: number, end?: number): string;
}

export = eaw;
