import { NextApiResponse, NextApiRequest } from 'next';
import bcrypt from 'bcrypt';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).end();
	}

	try {
		const { email, name, password } = req.body;

		const existingUser = await prismadb.user.findUnique({
			where: {
				email,
			},
		});

		if (existingUser) {
			return res.status(422).json({ error: 'Email already exists.' });
		}

		if (password.length < 5) {
			return res.status(401).json({ error: 'Password must atleast contain 5 or more characters.' });
		}
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prismadb.user.create({
			data: {
				email,
				name,
				hashedPassword,
				image: '',
				emailVerified: new Date(),
			},
		});

		return res.status(201).json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).end();
	}
}
