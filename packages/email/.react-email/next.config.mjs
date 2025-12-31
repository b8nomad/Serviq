
import path from 'path';
const emailsDirRelativePath = path.normalize('./emails');
const userProjectLocation = '/Users/elisha/Code/Projects/Serviq/packages/email';
const previewServerLocation = '/Users/elisha/Code/Projects/Serviq/packages/email/.react-email';
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_IS_BUILDING: 'true',
    EMAILS_DIR_RELATIVE_PATH: emailsDirRelativePath,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(userProjectLocation, emailsDirRelativePath),
    PREVIEW_SERVER_LOCATION: previewServerLocation,
    USER_PROJECT_LOCATION: userProjectLocation
  },
  outputFileTracingRoot: previewServerLocation,
  serverExternalPackages: ['esbuild'],
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    webpackBuildWorker: true
  },
}

export default nextConfig