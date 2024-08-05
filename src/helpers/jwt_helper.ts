import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config";
import createHttpError from "http-errors";

/*

// Access Tokens

*/
export const accessTokenSing = async (userId: number) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    },
  );
  return accessToken;
};

export const accessTokenVerify = (token: string) => {
  const decode = jwt.verify(
    token,
    process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    {},
  );
  return decode as JwtPayload;
};

/*

// Refresh Tokens

*/
export const refreshTokenSing = async (userId: number) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.AUTH_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1y",
    },
  );
  return refreshToken;
};

export const refreshTokenVerify = async (
  token: string,
): Promise<JwtPayload> => {
  const decodedToken = jwt.verify(
    token,
    process.env.AUTH_REFRESH_TOKEN_SECRET as string,
  );
  await prisma.token.findUniqueOrThrow({
    where: {
      refresh_token: token,
    },
  });
  return decodedToken as JwtPayload;
};

/*

// Set Tokens

*/
export async function setUserTokens(userId: number) {
  const accessToken = await accessTokenSing(userId);
  const refreshToken = await refreshTokenSing(userId);

  const doseExist = await prisma.token.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!doseExist) {
    await prisma.token.create({
      data: { refresh_token: refreshToken, user_id: userId },
    });
  } else {
    await prisma.token.delete({ where: { user_id: userId } });
    await prisma.token.create({
      data: { refresh_token: refreshToken, user_id: userId },
    });
  }
  return { accessToken: accessToken, refreshToken: refreshToken };
}
