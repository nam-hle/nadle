/**
 * Supported wrapper types for the StringBuilder.
 * - "parentheses": ( ... )
 * - "brackets": [ ... ]
 * - "braces": { ... }
 * - "none": no wrapper
 */
type Wrapper = "parentheses" | "brackets" | "braces" | "none";

/**
 * Utility class for building complex strings with chainable methods, pluralization, and optional wrappers.
 */
export class StringBuilder {
	private readonly items: string[] = [];
	private wrapper: Wrapper | null = null;

	public constructor(private separator: string = " ") {}

	/**
	 * Add a string or falsy value to the builder.
	 * @param item - The string to add, or false to skip.
	 * @returns This StringBuilder instance for chaining.
	 */
	public add(item: string | false): this {
		if (item === false) {
			return this;
		}

		this.items.push(item);

		return this;
	}

	/**
	 * Conditionally add a string to the builder if the condition is true.
	 * @param condition - If true, the string is added.
	 * @param item - The string to add if condition is true.
	 * @returns This StringBuilder instance for chaining.
	 */
	public addWhen(condition: boolean, item: string): this {
		return condition ? this.add(item) : this;
	}

	/**
	 * Add a string with pluralization support based on count.
	 * @param template - Template string containing `{count}` and `{noun}` placeholders.
	 * @param count - The count to determine pluralization.
	 * @param noun - The singular form of the noun.
	 * @param options - Optional plural form (defaults to noun + 's').
	 * @returns This StringBuilder instance for chaining.
	 * @example
	 *   .plural('{count} {noun} executed', 1, 'task') // '1 task executed'
	 *   .plural('{count} {noun} executed', 2, 'task') // '2 tasks executed'
	 *   .plural('{count} {noun}', 3, 'person', { plural: 'people' }) // '3 people'
	 */
	public plural(template: string, count: number, noun: string, options?: { plural?: string }): this {
		if (count < 0) {
			throw new Error("Count must be a non-negative integer.");
		}

		if (count === 0) {
			return this;
		}

		return this.add(template.replace(`{count}`, String(count)).replace(`{noun}`, count === 1 ? noun : (options?.plural ?? `${noun}s`)));
	}

	/**
	 * Wrap the final output in parentheses, brackets, braces, or none.
	 * @param wrapper - The wrapper type to use.
	 * @returns This StringBuilder instance for chaining.
	 * @throws If a wrapper is already set.
	 */
	public wrap(wrapper: Wrapper): this {
		if (this.wrapper !== null) {
			throw new Error("Wrapper is already set. Cannot change wrapper type.");
		}

		this.wrapper = wrapper;

		return this;
	}

	/**
	 * Build and return the final string, applying any wrapper if set.
	 * @returns The constructed string.
	 */
	public build(): string {
		if (this.items.length === 0) {
			return "";
		}

		const result = this.items.join(this.separator);

		if (this.wrapper === null) {
			return result;
		}

		switch (this.wrapper) {
			case "parentheses":
				return `(${result})`;
			case "brackets":
				return `[${result}]`;
			case "braces":
				return `{${result}}`;
			case "none":
				return result;
			default:
				throw new Error(`Unknown wrapper type: ${this.wrapper}`);
		}
	}
}
