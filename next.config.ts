const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddddddddddddddfffffff.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "my-streams-bucket-ap-south-1.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
