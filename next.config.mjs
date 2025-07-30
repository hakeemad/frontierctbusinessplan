 /** @type {import('next').NextConfig} */
 const nextConfig = {
   eslint: {
     ignoreDuringBuilds: true,
   },
   typescript: {
     ignoreBuildErrors: true,
   },
   images: {
     unoptimized: true,
   },
   allowedDevOrigins: ['https://*.replit.dev', 'https://*.repl.co'],
 };

 export default nextConfig;

