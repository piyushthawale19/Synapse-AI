#!/bin/bash

# Backend Environment Variables Setup Script
# Generated from Vly for Git Sync
# Run this script to set up your Convex backend environment

echo 'Setting up Convex backend environment variables...'

# Check if Convex CLI is installed
if ! command -v npx &> /dev/null; then
    echo 'Error: npx is not installed. Please install Node.js and npm first.'
    exit 1
fi

echo "Setting JWKS..."
npx convex env set "JWKS" -- "{\"keys\":[{\"use\":\"sig\",\"kty\":\"RSA\",\"n\":\"5ivQhENKuj3Rq0CfLHJ7kKSMuTJYkxYldSLlo6uDL2N9GL-UvpJFhoK8OnclBFNBBnFtgIC_fioDPRz1Khie2zvUP_VYhNEHuqMrCfx_jqEYX7k2geTwAwzNfe1KSBQYyEGu52sklW2uYqZXIeMltrbVHjrFzExSgnYwVgV5J82TPUeRP98j1TKcYWNDHdKP1RwXluimI5X8cvomOL0zyYEeniroO26tuVqCOdgL_Nk2BVVxUvag0n6xTaSiJc6PlxdhLmojHGKbiruA-Ja4Xg4yopuVOZ781RoaHyEfijwbgbuzewS5299Kb4WpVW7fG82jgBggRDzC-iT8h78zkw\",\"e\":\"AQAB\"}]}"

echo "Setting JWT_PRIVATE_KEY..."
npx convex env set "JWT_PRIVATE_KEY" -- "-----BEGIN PRIVATE KEY----- MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmK9CEQ0q6PdGr QJ8scnuQpIy5MliTFiV1IuWjq4MvY30Yv5S+kkWGgrw6dyUEU0EGcW2AgL9+KgM9 HPUqGJ7bO9Q/9ViE0Qe6oysJ/H+OoRhfuTaB5PADDM197UpIFBjIQa7naySVba5i plch4yW2ttUeOsXMTFKCdjBWBXknzZM9R5E/3yPVMpxhY0Md0o/VHBeW6KYjlfxy +iY4vTPJgR6eKug7bq25WoI52Av82TYFVXFS9qDSfrFNpKIlzo+XF2EuaiMcYpuK u4D4lrheDjKim5U5nvzVGhofIR+KPBuBu7N7BLnb30pvhalVbt8bzaOAGCBEPML6 JPyHvzOTAgMBAAECggEAZ68BBTOS7AaA9pXrnggMJYIaaiqFv+xP/04zB+Fw/N3i Mk3K4XXen9Mwm12kbShbuF1MKIDWwiyGvPbYcZgZp0RyPkV1FI9c3fQ2pQ77HvLu meBC74yDmbwgrUNBHOsApuT/tvuKxU1dKs8nnPpHuODva+ipxXf0CxTWfUmF5Cla DJpqDFS/Ktq9g1wTvmY31BdyISRwM+WZO6XgKHMS9gn6cNBVhyPzpyjhxsb5MFaG C+7NWCqCoLN34MkJpGsEIVNa9a+UhqcPc4BZAzHwHDDdegaDmobsk014dn950xlo 38klyU12LfkOOftvBfwaX7czqfsE445dpu4BRYCmAQKBgQD5kGq3dKS2ThZLKvjh Jgeg1songj0enbahTTBKfwlzGg/ekQ5WaEPjefYhsq4garJhEbuNcWtByyjpOjti sMeriRq4gKr/2lY3bdhmk/xJmwnIklbeK54k8QiXJaVvRAkPTozJZdSarTlOT8ft bb+M+IIb24OrN+LzGyIdUGRXEwKBgQDsG15Goc5nFGMx4+awDzBRmmDwBguC30KQ x1ilF5YizWcnBLX7mrhfE1qEo5mKP3roSPktydrqqfoVhwdpjaX0wMNWey/maq/H T1bzKsYBGdPtGXpGAQayGTlrfg22vPiMybP0y/1dA9Fbo+XSgguMPQ2WBv7ZVns0 Qi50AY7BgQKBgQDRXPpqFYzo8/F39gD8wS69G/RT2Mr1mFHSWDMfDBwdV8vgZ8ij bK0ndPWrp360603iaUHykyfr9kfIAXY4gR3BJjAogKj0I3MY5SoaRCPujAZVIY+G qwjs7NjMFGUJRwZitP8fJjKJ4LCmpf+Pi/aaiRB91lZLmYLnd+fSt9K1yQKBgDP8 eq+WpPmxVX4AriSJ05vEIB/5VMOGIQP7wJrpLJeRHmtK8D7r/DiC7GVUGFSGUauf la3tShRtRLFEv+8Pz0CqyNfb29oiF34NDBoSivJnG3CTMYcEZtMEFs6CPMbFqPxm 1QbLe4fldU12Mv48wAoqzzj/ZVG5ZvtErzG/vg0BAoGBAOEHYYWDc+jq+qCxOMz7 PtVZVddvmAhQpBDADg2EbI/qi6Dg8t99amvVvj4q7ANnTpjdf9Ad2LgXVoq+5C+i 0VLs31LXIm5chVmYnlhNM9bs7PWbSd4YhswNnD7Foffp6BXNSJ/JgX0E2QBdO0SH I621DFr/ctlbNQFKw7ze4Tng -----END PRIVATE KEY-----"

echo "Setting SITE_URL..."
npx convex env set "SITE_URL" -- "http://localhost:5173"

echo "Setting VLY_APP_NAME..."
npx convex env set "VLY_APP_NAME" -- "CuraLink AI"

echo "✅ All backend environment variables have been set!"
echo "You can now run: pnpm dev:backend"
