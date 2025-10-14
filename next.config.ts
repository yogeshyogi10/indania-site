/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  domains: ['static.mycdn.com', 'images.example.com'],
  unoptimized:true,
 
}
 
module.exports = nextConfig