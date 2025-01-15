'use server';

import {  signOut } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { LoginSchema, loginSchema } from '@/lib/schemas/LoginSchema';
import { registerSchema, RegisterSchema } from '@/lib/schemas/RegisterSchema';
import { ActionResult } from '@/types';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { compare } from "bcryptjs";

export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
	try {
		const validated = loginSchema.safeParse(data);
		if (!validated.success) {
			return { status: "error", error: "Invalid credentials format" };
		}

		const { email, password } = validated.data;

		// Fetch the user from the database
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return { status: "error", error: "User not found" };
		}

		// Verify the password
		const isPasswordValid = await compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return { status: "error", error: "Incorrect password" };
		}

		return { status: 'success', data: 'Logged in' }
	} catch (error) {
		console.log(error);
		return { status: 'error', error: 'Something else went wrong' }
	}
}

export async function signOutUser() {
	await signOut({ redirect: false, callbackUrl: '/' });
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
	try {
		const validated = registerSchema.safeParse(data);

		if (!validated.success) {
			return { status: 'error', error: validated.error.errors }
		}

		const { name, email, password } = validated.data;

		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) return { status: 'error', error: 'User already exists' };

		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword
			}
		})

		return { status: 'success', data: user }
	} catch (error) {
		console.log(error);
		return { status: 'error', error: 'Something went wrong' }
	}

}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
	return prisma.user.findUnique({ where: { id } });
}