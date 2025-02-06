import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "lh3.googleusercontent.com" }, // Todo: Find a better way to limit this Image Optimization
		],
	},
}

export default nextConfig
