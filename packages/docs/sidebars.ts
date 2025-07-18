import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	docsSidebar: [
		"why-nadle",
		"introduction",
		{
			type: "category",
			label: "Getting Started",
			items: [
				"getting-started/installation",
				"getting-started/playground",
				{
					type: "category",
					label: "Features",
					items: ["getting-started/features/monorepo", "getting-started/features/auto-correction"]
				}
			]
		},
		{
			type: "category",
			label: "Concepts",
			items: ["concepts/task", "concepts/workspace"]
		},
		{
			label: "Guides",
			type: "category",
			items: ["guides/defining-task", "guides/registering-task", "guides/configuring-task", "guides/executing-task", "guides/configuring-nadle"]
		},
		"config-reference",
		{ dirName: "api", type: "autogenerated" }
	]
};

export default sidebars;
