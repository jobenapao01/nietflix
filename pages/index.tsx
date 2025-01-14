import Billboard from '@/components/Billboard';
import InfoModal from '@/components/InfoModal';
import MovieList from '@/components/MovieList';
import Navbar from '@/components/Navbar';
import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';
import useInfoModal from '@/hooks/useInfoModal';
import useMovieList from '@/hooks/useMovieList';
import { NextPageContext } from 'next';
import { signOut, getSession } from 'next-auth/react';
import Head from 'next/head';

//Protect client route to prevent the client to visit private routes without logging in
export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}

export default function Home() {
	const { data: user } = useCurrentUser();
	const { data: movies = [] } = useMovieList();
	const { data: favorites = [] } = useFavorites();
	const { isOpen, closeModal } = useInfoModal();

	return (
		<>
			<Head>
				<title>Nietflix</title>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<InfoModal visible={isOpen} onClose={closeModal} />
			<Navbar />
			<Billboard />
			<div className='pb-40'>
				<MovieList title='Trending Now' data={movies} />
				<MovieList title='My List' data={favorites} />
			</div>
		</>
	);
}
