/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['v5.airtableusercontent.com'], // Add Airtable's image domain
    },
};

export default nextConfig;
