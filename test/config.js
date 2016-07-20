System.config({
	lessOptions: {
		strictMath: true, // default false
		dumpLineNumbers: "comments", // default false
		plugins: ["less_plugins/plugin"]
	},
	paths: {
		"bootstrap/*": "less_tilde/libs/bootstrap/*",
		"img-pack/*": "less_tilde/libs/img-pack/*",
		"$less": "../less.js"
	}
});
