import { User } from "../models/User.js";
import { FitnessProfile } from "../models/FitnessProfile.js";
import { signToken } from "../services/tokenService.js";
import { AppError, asyncHandler } from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedBody;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  const profile = await FitnessProfile.findOne({ user: user._id });

  res.status(200).json({
    success: true,
    message: `Logged in as ${user.name}`,
    data: { user, token, hasProfile: !!profile },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await FitnessProfile.findOne({ user: req.user._id });
  res.status(200).json({
    success: true,
    data: { user: req.user, hasProfile: !!profile },
  });
});
