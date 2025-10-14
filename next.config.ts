/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  images:{
  domains: ['static.mycdn.com', 'images.example.com'],
  unoptimized:true,
  },
};
 
module.exports = nextConfig