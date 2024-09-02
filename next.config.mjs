/** @type {import('next').NextConfig} */

// The 'incremental' value allows you to adopt PPR for specific routes.
// add the experimental_ppr segment config option to your dashboard layout:
const nextConfig = {
    experimental: {
        ppr: 'incremental',
    },
};
export default nextConfig;
