import Path from "node:path";
import Fs from "node:fs/promises";

import { type PackageJson } from "type-fest";

import { isPathExists } from "./fs.js";

export async function findPackageJson(projectDir: string): Promise<PackageJson | null> {
	const possiblePackageJsonPath = Path.resolve(projectDir, "package.json");

	const isExists = await isPathExists(possiblePackageJsonPath);

	if (!isExists) {
		return null;
	}

	const packageJson = await Fs.readFile(possiblePackageJsonPath, "utf-8");

	return JSON.parse(packageJson) as PackageJson;
}
